import 'package:flutter/material.dart';
import 'package:senior_project/modules/club.dart';
import 'package:senior_project/theme/app_theme.dart';

class ClubCard extends StatelessWidget {
  final Club club;
  final VoidCallback? onJoin;
  final bool isUserMember;

  const ClubCard({
    Key? key,
    required this.club,
    this.onJoin,
    this.isUserMember = false,
  }) : super(key: key);

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
                CircleAvatar(
                  backgroundColor: AppColors.primaryColor,
                  child: Text(
                    club.name?.isNotEmpty == true
                        ? club.name![0].toUpperCase()
                        : 'C',
                    style: const TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    club.name ?? 'Unnamed Club',
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                if (!isUserMember && onJoin != null)
                  ElevatedButton(
                    onPressed: onJoin,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primaryColor,
                    ),
                    child: const Text('Join'),
                  ),
                if (isUserMember)
                  Chip(
                    label: const Text('Member'),
                    backgroundColor: Colors.green[100],
                    labelStyle: const TextStyle(
                      color: Colors.green,
                      fontWeight: FontWeight.bold,
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
          ],
        ),
      ),
    );
  }
}
