import 'package:flutter/material.dart';
import 'package:senior_project/functions/clubs/clubs_api.dart';
import 'package:senior_project/theme/app_theme.dart';
import 'package:go_router/go_router.dart';

class ClubJoinRequestsPage extends StatefulWidget {
  final String clubId;
  final String clubName;

  const ClubJoinRequestsPage({
    Key? key,
    required this.clubId,
    required this.clubName,
  }) : super(key: key);

  @override
  State<ClubJoinRequestsPage> createState() => _ClubJoinRequestsPageState();
}

class _ClubJoinRequestsPageState extends State<ClubJoinRequestsPage> {
  bool isLoading = true;
  String? errorMessage;
  List<dynamic> requests = [];

  @override
  void initState() {
    super.initState();
    loadRequests();
  }

  Future<void> loadRequests() async {
    setState(() {
      isLoading = true;
      errorMessage = null;
    });

    try {
      final result = await getClubJoinRequests(widget.clubId);
      setState(() {
        requests = result;
        isLoading = false;
      });
    } catch (e) {
      setState(() {
        errorMessage = e.toString();
        isLoading = false;
      });
    }
  }

  Future<void> handleAcceptRequest(String userId) async {
    try {
      final success = await acceptJoinRequest(userId, widget.clubId);
      if (success) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Request accepted successfully')),
        );
        loadRequests(); // Reload the list
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Failed to accept request')),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Error: ${e.toString()}')));
    }
  }

  Future<void> handleRejectRequest(String userId) async {
    try {
      final success = await rejectJoinRequest(userId, widget.clubId);
      if (success) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Request rejected successfully')),
        );
        loadRequests(); // Reload the list
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Failed to reject request')),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Error: ${e.toString()}')));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('${widget.clubName} - Join Requests'),
        elevation: 0,
      ),
      body:
          isLoading
              ? const Center(child: CircularProgressIndicator())
              : errorMessage != null
              ? Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text('Error: $errorMessage'),
                    const SizedBox(height: 16),
                    ElevatedButton(
                      onPressed: loadRequests,
                      child: const Text('Retry'),
                    ),
                  ],
                ),
              )
              : requests.isEmpty
              ? const Center(child: Text('No pending join requests'))
              : ListView.builder(
                itemCount: requests.length,
                itemBuilder: (context, index) {
                  final request = requests[index];
                  return Card(
                    margin: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 8,
                    ),
                    child: ListTile(
                      leading: CircleAvatar(
                        backgroundColor: AppColors.primaryColor,
                        backgroundImage:
                            request['profilepicture'] != null
                                ? NetworkImage(request['profilepicture'])
                                : null,
                        child:
                            request['profilepicture'] == null
                                ? Text(
                                  request['username']?.isNotEmpty == true
                                      ? request['username'][0].toUpperCase()
                                      : '?',
                                  style: const TextStyle(color: Colors.white),
                                )
                                : null,
                      ),
                      title: GestureDetector(
                        onTap: () {
                          final userId = request['userid'];
                          if (userId != null) {
                            context.push('/profile/$userId');
                          }
                        },
                        child: Text(
                          request['username'] ?? 'Unknown',
                          style: const TextStyle(fontSize: 16),
                        ),
                      ),
                      subtitle: Text(request['email'] ?? ''),
                      trailing: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          IconButton(
                            icon: const Icon(Icons.check_circle),
                            color: Colors.green,
                            onPressed: () {
                              // Use lowercase 'userid' instead of 'userId'
                              final userId = request['userid'];
                              if (userId != null) {
                                handleAcceptRequest(userId);
                              } else {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(
                                    content: Text('User ID not found'),
                                  ),
                                );
                              }
                            },
                          ),
                          IconButton(
                            icon: const Icon(Icons.cancel),
                            color: Colors.red,
                            onPressed: () {
                              // Use lowercase 'userid' instead of 'userId'
                              final userId = request['userid'];
                              if (userId != null) {
                                handleRejectRequest(userId);
                              } else {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(
                                    content: Text('User ID not found'),
                                  ),
                                );
                              }
                            },
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
    );
  }
}
