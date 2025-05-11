import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:senior_project/components/clubs/club_card.dart';
import 'package:senior_project/components/clubs/create_club_dialog.dart';
import 'package:senior_project/components/common/error_state.dart';
import 'package:senior_project/functions/clubs/clubs_api.dart';
import 'package:senior_project/modules/club.dart';
import 'package:senior_project/providers/user_provider.dart';
import 'package:senior_project/screens/clubs/club_join_requests_page.dart';
import 'package:senior_project/screens/clubs/club_members_page.dart';

class ClubsPage extends StatefulWidget {
  const ClubsPage({super.key});

  @override
  State<ClubsPage> createState() => ClubsPageState();
}

class ClubsPageState extends State<ClubsPage>
    with SingleTickerProviderStateMixin {
  bool isLoading = true;
  String? errorMessage;
  List<Club> myClubs = [];
  List<Club> availableClubs = [];
  List<Club> adminClubs = [];
  List<Club> underReviewClubs = [];
  late TabController tabController;
  bool isStudent = true;
  Map<String, bool> processingClubs = {};

  @override
  void initState() {
    super.initState();

    final userProvider = Provider.of<UserProvider>(context, listen: false);
    isStudent = userProvider.currentUser?.isStudent ?? true;

    tabController = TabController(length: isStudent ? 3 : 1, vsync: this);
    loadClubs();
  }

  @override
  void dispose() {
    tabController.dispose();
    super.dispose();
  }

  Future<void> loadClubs() async {
    setState(() {
      isLoading = true;
      errorMessage = null;
    });

    try {
      if (isStudent) {
        final results = await Future.wait([
          getClubsUserIsIn(),
          getClubsUserNotIn(),
          getUnderReviewClubs(),
        ]);

        setState(() {
          myClubs = results[0];
          availableClubs = results[1];
          underReviewClubs = results[2];
          isLoading = false;
        });
      } else {
        final clubs = await getAdminClubList();

        setState(() {
          adminClubs = clubs;
          isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        errorMessage = e.toString();
        isLoading = false;
      });
    }
  }

  Future<void> handleJoinClub(Club club) async {
    if (club.clubId == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Cannot join club: Missing Club ID')),
      );
      return;
    }

    setState(() {
      processingClubs[club.clubId!] = true;
    });

    try {
      if (club.hasUserMadeRequest == true) {
        await removeJoinClubRequest(club.clubId!);
      } else {
        await requestJoinClub(club.clubId!);
      }

      await loadClubs();
    } catch (e) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Error: ${e.toString()}')));
    } finally {
      setState(() {
        processingClubs[club.clubId!] = false;
      });
    }
  }

  Future<void> handleCreateClubRequest(String name, String description) async {
    try {
      final success = await makeClubRequest(name, description);

      Navigator.of(context).pop();

      if (success) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Club creation request sent successfully'),
          ),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Failed to send club creation request')),
        );
      }
    } catch (e) {
      Navigator.of(context).pop();
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Error: ${e.toString()}')));
    }
  }

  void showCreateClubDialog() {
    showDialog(
      context: context,
      builder: (context) => CreateClubDialog(onSubmit: handleCreateClubRequest),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Clubs'),
        elevation: 0,
        actions: [
          if (isStudent)
            IconButton(
              icon: const Icon(Icons.add),
              tooltip: 'Request New Club',
              onPressed: showCreateClubDialog,
            ),
        ],
        bottom:
            isStudent
                ? TabBar(
                  controller: tabController,
                  tabs: const [
                    Tab(text: 'My Clubs'),
                    Tab(text: 'Available'),
                    Tab(text: 'Pending'),
                  ],
                )
                : null,
      ),
      body:
          isLoading
              ? const Center(child: CircularProgressIndicator())
              : errorMessage != null
              ? ErrorState(
                errorMessage: errorMessage!,
                onRetry: loadClubs,
                title: 'Error loading clubs',
              )
              : isStudent
              ? _buildStudentView()
              : _buildInstructorView(),
    );
  }

  Widget _buildStudentView() {
    return TabBarView(
      controller: tabController,
      children: [
        RefreshIndicator(
          onRefresh: loadClubs,
          child:
              myClubs.isEmpty
                  ? ListView(
                    children: const [
                      SizedBox(height: 100),
                      Center(
                        child: Text(
                          'You are not a member of any clubs yet.',
                          style: TextStyle(fontSize: 16),
                        ),
                      ),
                    ],
                  )
                  : ListView.builder(
                    itemCount: myClubs.length,
                    itemBuilder: (context, index) {
                      return ClubCard(club: myClubs[index], isUserMember: true);
                    },
                  ),
        ),

        RefreshIndicator(
          onRefresh: loadClubs,
          child:
              availableClubs.isEmpty
                  ? ListView(
                    children: const [
                      SizedBox(height: 100),
                      Center(
                        child: Text(
                          'No available clubs found.',
                          style: TextStyle(fontSize: 16),
                        ),
                      ),
                    ],
                  )
                  : ListView.builder(
                    itemCount: availableClubs.length,
                    itemBuilder: (context, index) {
                      final club = availableClubs[index];
                      final isProcessing =
                          processingClubs[club.clubId] ?? false;

                      return ClubCard(
                        club: club,
                        isUserMember: false,
                        onJoin: () => handleJoinClub(club),
                        isProcessingRequest: isProcessing,
                      );
                    },
                  ),
        ),

        RefreshIndicator(
          onRefresh: loadClubs,
          child:
              underReviewClubs.isEmpty
                  ? ListView(
                    children: const [
                      SizedBox(height: 100),
                      Center(
                        child: Text(
                          'No pending club requests.',
                          style: TextStyle(fontSize: 16),
                        ),
                      ),
                    ],
                  )
                  : ListView.builder(
                    itemCount: underReviewClubs.length,
                    itemBuilder: (context, index) {
                      return ClubCard(
                        club: underReviewClubs[index],
                        isUserMember: false,
                      );
                    },
                  ),
        ),
      ],
    );
  }

  Widget _buildInstructorView() {
    return RefreshIndicator(
      onRefresh: loadClubs,
      child:
          adminClubs.isEmpty
              ? ListView(
                children: const [
                  SizedBox(height: 100),
                  Center(
                    child: Text(
                      'You are not responsible for any clubs.',
                      style: TextStyle(fontSize: 16),
                    ),
                  ),
                ],
              )
              : ListView.builder(
                itemCount: adminClubs.length,
                itemBuilder: (context, index) {
                  final club = adminClubs[index];
                  return ClubCard(
                    club: club,
                    isUserMember: true,
                    isAdmin: true,
                    onShowMembers: () => showClubMembers(club),
                    onShowRequests: () => showClubRequests(club),
                  );
                },
              ),
    );
  }

  Widget _buildClubCard(Club club) {
    final bool isProcessing = processingClubs[club.clubId] ?? false;
    final userProvider = Provider.of<UserProvider>(context, listen: false);
    final bool isAdmin = club.adminId == userProvider.currentUser?.userId;

    return ClubCard(
      club: club,
      isUserMember: myClubs.any((c) => c.clubId == club.clubId),
      onJoin: () => handleJoinClub(club),
      isAdmin: isAdmin,
      isProcessingRequest: isProcessing,
      onShowMembers: isAdmin ? () => showClubMembers(club) : null,
      onShowRequests: isAdmin ? () => showClubRequests(club) : null,
    );
  }

  void showClubMembers(Club club) {
    if (club.clubId != null) {
      Navigator.of(context).push(
        MaterialPageRoute(
          builder:
              (context) => ClubMembersPage(
                clubId: club.clubId!,
                clubName: club.name ?? 'Club Members',
              ),
        ),
      );
    }
  }

  void showClubRequests(Club club) {
    if (club.clubId != null) {
      Navigator.of(context).push(
        MaterialPageRoute(
          builder:
              (context) => ClubJoinRequestsPage(
                clubId: club.clubId!,
                clubName: club.name ?? 'Join Requests',
              ),
        ),
      );
    }
  }
}
