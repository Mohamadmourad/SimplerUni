import 'package:flutter/material.dart';
import 'package:senior_project/modules/club.dart';
import 'package:senior_project/theme/app_theme.dart';
import 'package:go_router/go_router.dart';
import 'package:senior_project/screens/clubs/club_members_page.dart';
import 'package:senior_project/screens/clubs/club_join_requests_page.dart';
import 'package:senior_project/screens/clubs/club_details_page.dart';
import 'package:provider/provider.dart';
import 'package:senior_project/providers/user_provider.dart';

class ClubCard extends StatelessWidget {
  final Club club;
  final bool isUserMember;
  final VoidCallback? onJoin;
  final bool isAdmin;
  final bool isProcessingRequest;
  final VoidCallback? onShowMembers; // Add this parameter
  final VoidCallback? onShowRequests; // Add this parameter

  const ClubCard({
    super.key,
    required this.club,
    required this.isUserMember,
    this.onJoin,
    this.isAdmin = false,
    this.isProcessingRequest = false,
    this.onShowMembers, // Add this parameter
    this.onShowRequests, // Add this parameter
  });

  @override
  Widget build(BuildContext context) {
    // Check if the current user is the admin of this club
    final userProvider = Provider.of<UserProvider>(context, listen: false);
    final userIsClubAdmin = club.adminId == userProvider.currentUser?.userId;

    // Determine if this card shows an admin club
    final showAsAdmin = isAdmin || userIsClubAdmin;

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
            if (showAsAdmin)
              Padding(padding: const EdgeInsets.only(top: 8, bottom: 4)),
            if (isUserMember)
              _buildMemberActions(context, showAsAdmin)
            else if (onJoin != null)
              _buildJoinButton(context),
          ],
        ),
      ),
    );
  }

  Widget _buildMemberActions(BuildContext context, bool isClubAdmin) {
    if (isClubAdmin) {
      return Padding(
        padding: const EdgeInsets.all(8.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            ElevatedButton.icon(
              icon: const Icon(Icons.info_outline),
              label: const Text('Club Details & Members'),
              onPressed: onShowMembers, // Use the callback here
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primaryColor,
              ),
            ),
            const SizedBox(height: 8),
            ElevatedButton.icon(
              icon: const Icon(Icons.pending_actions),
              label: const Text('View Join Requests'),
              onPressed: onShowRequests, // Use the callback here
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.orange[700],
              ),
            ),
          ],
        ),
      );
    } else {
      // For regular members, show a more compact right-aligned button
      return Padding(
        padding: const EdgeInsets.symmetric(vertical: 8.0),
        child: Align(
          alignment: Alignment.centerRight,
          child: ElevatedButton(
            onPressed: () {
              if (club.clubId != null) {
                Navigator.of(context).push(
                  MaterialPageRoute(
                    builder:
                        (context) => ClubDetailsPage(
                          clubId: club.clubId!,
                          clubName: club.name ?? 'Club Details',
                        ),
                  ),
                );
              }
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primaryColor,
              padding: const EdgeInsets.symmetric(horizontal: 25, vertical: 12),
              minimumSize: const Size(0, 0),
            ),
            child: const Text('Club Details'),
          ),
        ),
      );
    }
  }

  Widget _buildJoinButton(BuildContext context) {
    return Align(
      alignment: Alignment.centerRight,
      child:
          isProcessingRequest
              ? SizedBox(
                height: 24,
                width: 24,
                child: CircularProgressIndicator(
                  valueColor: AlwaysStoppedAnimation<Color>(
                    AppColors.primaryColor,
                  ),
                  strokeWidth: 2,
                ),
              )
              : ElevatedButton(
                onPressed: onJoin,
                style: ElevatedButton.styleFrom(
                  backgroundColor:
                      club.hasUserMadeRequest == true
                          ? Colors.grey[400]
                          : AppColors.primaryColor,
                ),
                child: Text(
                  club.hasUserMadeRequest == true
                      ? 'Requested'
                      : 'Request to Join',
                ),
              ),
    );
  }
}
