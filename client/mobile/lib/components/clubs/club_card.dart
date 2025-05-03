import 'package:flutter/material.dart';
import 'package:senior_project/modules/club.dart';
import 'package:senior_project/theme/app_theme.dart';
import 'package:go_router/go_router.dart';
import 'package:senior_project/screens/clubs/club_members_page.dart';
import 'package:senior_project/screens/clubs/club_join_requests_page.dart';

class ClubCard extends StatelessWidget {
  final Club club;
  final bool isUserMember;
  final VoidCallback? onJoin;
  final bool isAdmin; // Add the isAdmin property

  const ClubCard({
    super.key,
    required this.club,
    required this.isUserMember,
    this.onJoin,
    this.isAdmin = false, // Default to false
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Expanded(
                  child: Text(
                    club.name ?? 'Unnamed Club',
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                // Removed the Member chip that was here
              ],
            ),
            if (club.description != null && club.description!.isNotEmpty) ...[
              const SizedBox(height: 12),
              Text(
                club.description!,
                style: TextStyle(fontSize: 14, color: Colors.grey[600]),
              ),
            ],
            if (club.room != null && club.room!.isNotEmpty) ...[
              const SizedBox(height: 8),
              Row(
                children: [
                  const Icon(Icons.location_on, size: 16, color: Colors.grey),
                  const SizedBox(width: 4),
                  Text(
                    'Room: ${club.room}',
                    style: TextStyle(fontSize: 14, color: Colors.grey[600]),
                  ),
                ],
              ),
            ],
            if (isUserMember)
              _buildMemberActions(context)
            else if (onJoin != null)
              _buildJoinButton(context),
          ],
        ),
      ),
    );
  }

  Widget _buildMemberActions(BuildContext context) {
    if (isAdmin) {
      // Admin/instructor specific actions - simplified to just two primary functions
      return Padding(
        padding: const EdgeInsets.all(8.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            ElevatedButton.icon(
              icon: const Icon(Icons.people),
              label: const Text('Manage Members'),
              onPressed: () {
                if (club.chatroomId != null) {
                  // Navigate to members management screen
                  Navigator.of(context).push(
                    MaterialPageRoute(
                      builder:
                          (context) => ClubMembersPage(
                            clubId: club.chatroomId!,
                            clubName: club.name ?? 'Club Members',
                          ),
                    ),
                  );
                }
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primaryColor,
              ),
            ),
            const SizedBox(height: 8),
            ElevatedButton.icon(
              icon: const Icon(Icons.pending_actions),
              label: const Text('View Join Requests'),
              onPressed: () {
                if (club.chatroomId != null) {
                  // Navigate to join requests screen
                  Navigator.of(context).push(
                    MaterialPageRoute(
                      builder:
                          (context) => ClubJoinRequestsPage(
                            clubId: club.chatroomId!,
                            clubName: club.name ?? 'Join Requests',
                          ),
                    ),
                  );
                }
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.orange[700],
              ),
            ),
          ],
        ),
      );
    } else {
      return Padding(
        padding: const EdgeInsets.all(8.0),
        child: ElevatedButton.icon(
          icon: const Icon(Icons.forum),
          label: const Text('Open Chat'),
          onPressed: () {
            if (club.chatroomId != null) {
              context.go(
                '/chat/${Uri.encodeComponent(club.name ?? 'Unnamed Club')}/${club.chatroomId}',
              );
            } else {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Chat not available')),
              );
            }
          },
          style: ElevatedButton.styleFrom(
            backgroundColor: AppColors.primaryColor,
          ),
        ),
      );
    }
  }

  Widget _buildJoinButton(BuildContext context) {
    return Align(
      alignment: Alignment.centerRight,
      child: ElevatedButton(
        onPressed: onJoin,
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.primaryColor,
        ),
        child: const Text('Request to Join'),
      ),
    );
  }
}
