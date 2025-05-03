import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:senior_project/components/clubs/club_card.dart';
import 'package:senior_project/components/clubs/create_club_dialog.dart';
import 'package:senior_project/components/common/error_state.dart';
import 'package:senior_project/functions/clubs/clubs_api.dart';
import 'package:senior_project/modules/club.dart';
import 'package:senior_project/providers/user_provider.dart';

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
  List<Club> adminClubs = []; // For instructors
  List<Club> underReviewClubs = []; // Add this for clubs under review
  late TabController tabController;
  bool isStudent = true;

  @override
  void initState() {
    super.initState();
    // Check if the user is a student or instructor
    final userProvider = Provider.of<UserProvider>(context, listen: false);
    isStudent = userProvider.currentUser?.isStudent ?? true;

    // Initialize tab controller with appropriate number of tabs (3 for students now)
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
        // Student view - load clubs they're in, available clubs, and under review clubs
        final results = await Future.wait([
          getClubsUserIsIn(),
          getClubsUserNotIn(),
          getUnderReviewClubs(), // Add this call
        ]);

        setState(() {
          myClubs = results[0];
          availableClubs = results[1];
          underReviewClubs = results[2]; // Set under review clubs
          isLoading = false;
        });
      } else {
        // Instructor view - load clubs they're responsible for
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

    try {
      final success = await requestJoinClub(club.clubId!);

      if (success) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Request to join club sent successfully'),
          ),
        );
        // Reload clubs to reflect changes
        loadClubs();
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Failed to send join request')),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Error: ${e.toString()}')));
    }
  }

  Future<void> handleCreateClubRequest(String name, String description) async {
    try {
      final success = await makeClubRequest(name, description);

      Navigator.of(context).pop(); // Close the dialog

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
      Navigator.of(context).pop(); // Close the dialog
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
          if (isStudent) // Only show create club button for students
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
                    Tab(text: 'MY CLUBS'),
                    Tab(text: 'AVAILABLE'),
                    Tab(text: 'UNDER REVIEW'),
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
        // My Clubs Tab
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

        // Available Clubs Tab
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
                      return ClubCard(
                        club: availableClubs[index],
                        isUserMember: false,
                        onJoin: () => handleJoinClub(availableClubs[index]),
                      );
                    },
                  ),
        ),

        // Under Review Clubs Tab (new)
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
                  return ClubCard(
                    club: adminClubs[index],
                    isUserMember: true,
                    isAdmin: true, // Now the parameter is defined in ClubCard
                  );
                },
              ),
    );
  }
}
