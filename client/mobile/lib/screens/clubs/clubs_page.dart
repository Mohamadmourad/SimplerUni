import 'package:flutter/material.dart';
import 'package:senior_project/components/clubs/club_card.dart';
import 'package:senior_project/components/clubs/create_club_dialog.dart';
import 'package:senior_project/components/common/error_state.dart';
import 'package:senior_project/functions/clubs/clubs_api.dart';
import 'package:senior_project/modules/club.dart';

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
  late TabController tabController;

  @override
  void initState() {
    super.initState();
    tabController = TabController(length: 2, vsync: this);
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
      // Load both types of clubs in parallel
      final results = await Future.wait([
        getClubsUserIsIn(),
        getClubsUserNotIn(),
      ]);

      setState(() {
        myClubs = results[0];
        availableClubs = results[1];
        isLoading = false;
      });
    } catch (e) {
      setState(() {
        errorMessage = e.toString();
        isLoading = false;
      });
    }
  }

  Future<void> handleJoinClub(Club club) async {
    if (club.chatroomId == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Cannot join club: Missing chatroom ID')),
      );
      return;
    }

    try {
      final success = await requestJoinClub(club.chatroomId!);

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
          IconButton(
            icon: const Icon(Icons.add),
            tooltip: 'Request New Club',
            onPressed: showCreateClubDialog,
          ),
        ],
        bottom: TabBar(
          controller: tabController,
          tabs: const [Tab(text: 'MY CLUBS'), Tab(text: 'AVAILABLE')],
        ),
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
              : TabBarView(
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
                                return ClubCard(
                                  club: myClubs[index],
                                  isUserMember: true,
                                );
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
                                  onJoin:
                                      () =>
                                          handleJoinClub(availableClubs[index]),
                                );
                              },
                            ),
                  ),
                ],
              ),
    );
  }
}
