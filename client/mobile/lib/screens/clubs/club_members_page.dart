import 'package:flutter/material.dart';
import 'package:senior_project/functions/clubs/clubs_api.dart';
import 'package:senior_project/theme/app_theme.dart';
import 'package:senior_project/modules/club.dart';
import 'package:go_router/go_router.dart';

class ClubMembersPage extends StatefulWidget {
  final String clubId;
  final String clubName;

  const ClubMembersPage({
    Key? key,
    required this.clubId,
    required this.clubName,
  }) : super(key: key);

  @override
  State<ClubMembersPage> createState() => _ClubMembersPageState();
}

class _ClubMembersPageState extends State<ClubMembersPage> {
  bool isLoading = true;
  String? errorMessage;
  List<dynamic> members = [];
  Map<String, dynamic> clubInfo = {};

  @override
  void initState() {
    super.initState();
    loadClubInfo();
  }

  Future<void> loadClubInfo() async {
    setState(() {
      isLoading = true;
      errorMessage = null;
    });

    try {
      final info = await getClubInfo(widget.clubId);
      setState(() {
        clubInfo = info;
        // Extract members from the clubMembers property
        members = info['clubMembers'] as List<dynamic>? ?? [];
        isLoading = false;
      });
    } catch (e) {
      setState(() {
        errorMessage = e.toString();
        isLoading = false;
      });
    }
  }

  Future<void> removeMember(String userId) async {
    try {
      // Show confirmation dialog
      final shouldRemove =
          await showDialog<bool>(
            context: context,
            builder:
                (context) => AlertDialog(
                  title: const Text('Remove Member'),
                  content: const Text(
                    'Are you sure you want to remove this member from the club?',
                  ),
                  actions: [
                    TextButton(
                      onPressed: () => Navigator.of(context).pop(false),
                      child: const Text('Cancel'),
                    ),
                    TextButton(
                      onPressed: () => Navigator.of(context).pop(true),
                      child: const Text(
                        'Remove',
                        style: TextStyle(color: Colors.red),
                      ),
                    ),
                  ],
                ),
          ) ??
          false;

      if (!shouldRemove) return;

      // Show loading indicator
      setState(() {
        isLoading = true;
      });

      // Call API to remove the member
      final success = await removeStudentFromClub(widget.clubId, userId);

      if (success) {
        // Reload club info to refresh the members list
        await loadClubInfo();

        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Member removed successfully')),
          );
        }
      } else {
        setState(() {
          isLoading = false;
        });

        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Failed to remove member')),
          );
        }
      }
    } catch (e) {
      setState(() {
        isLoading = false;
      });

      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Error: ${e.toString()}')));
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(widget.clubName), elevation: 0),
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
                      onPressed: loadClubInfo,
                      child: const Text('Retry'),
                    ),
                  ],
                ),
              )
              : SingleChildScrollView(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildClubInfoSection(),
                    const Divider(height: 32, thickness: 1),
                    _buildMembersSection(),
                  ],
                ),
              ),
    );
  }

  Widget _buildClubInfoSection() {
    if (clubInfo.isEmpty) {
      return const Padding(
        padding: EdgeInsets.all(16.0),
        child: Text('Club information not available'),
      );
    }

    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Club Information',
            style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 16),

          _buildInfoRow('Name', clubInfo['name'] ?? 'Not specified'),

          if (clubInfo['description'] != null &&
              clubInfo['description'].toString().isNotEmpty)
            _buildInfoRow('Description', clubInfo['description']),

          if (clubInfo['room'] != null &&
              clubInfo['room'].toString().isNotEmpty)
            _buildInfoRow('Room', clubInfo['room']),
        ],
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: const TextStyle(fontSize: 14, color: Colors.grey)),
          const SizedBox(height: 4),
          Text(value, style: const TextStyle(fontSize: 16)),
        ],
      ),
    );
  }

  Widget _buildMembersSection() {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Members (${members.length})',
                style: const TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          members.isEmpty
              ? const Center(
                child: Padding(
                  padding: EdgeInsets.symmetric(vertical: 32.0),
                  child: Text('No members found'),
                ),
              )
              : ListView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: members.length,
                itemBuilder: (context, index) {
                  final member = members[index];
                  return Card(
                    margin: const EdgeInsets.only(bottom: 8),
                    child: ListTile(
                      leading: CircleAvatar(
                        backgroundColor: AppColors.primaryColor,
                        backgroundImage:
                            member['profilepicture'] != null
                                ? NetworkImage(member['profilepicture'])
                                : null,
                        child:
                            member['profilepicture'] == null
                                ? Text(
                                  member['username']?.isNotEmpty == true
                                      ? member['username'][0].toUpperCase()
                                      : '?',
                                  style: const TextStyle(color: Colors.white),
                                )
                                : null,
                      ),
                      title: GestureDetector(
                        onTap: () {
                          final userId = member['userid'];
                          if (userId != null) {
                            context.push('/profile/$userId');
                          }
                        },
                        child: Text(
                          member['username'] ?? 'Unknown',
                          style: TextStyle(
                            color: Colors.blue[700],
                            decoration: TextDecoration.underline,
                          ),
                        ),
                      ),
                      subtitle: Text(member['email'] ?? ''),
                      trailing: IconButton(
                        icon: const Icon(Icons.person_remove),
                        onPressed: () {
                          final userId = member['userid'];
                          if (userId != null) {
                            removeMember(userId);
                          } else {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text('User ID not found'),
                              ),
                            );
                          }
                        },
                      ),
                    ),
                  );
                },
              ),
        ],
      ),
    );
  }
}
