import 'package:flutter/material.dart';
import 'package:senior_project/theme/app_theme.dart';

class JoinClubButton extends StatelessWidget {
  final bool hasRequested;
  final bool isProcessing;
  final VoidCallback onPressed;
  final bool isAdmin; 
  final VoidCallback? onShowMembers; 
  final VoidCallback? onShowRequests; 

  const JoinClubButton({
    Key? key,
    required this.hasRequested,
    required this.isProcessing,
    required this.onPressed,
    this.isAdmin = false, 
    this.onShowMembers,
    this.onShowRequests,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    if (isAdmin) {
      return Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (onShowMembers != null)
            TextButton(
              onPressed: onShowMembers,
              style: TextButton.styleFrom(
                foregroundColor: Colors.white,
                backgroundColor: AppColors.primaryColor,
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 8,
                ),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(20),
                ),
              ),
              child: const Text(
                'Members',
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
            ),
          const SizedBox(width: 8),
          if (onShowRequests != null)
            TextButton(
              onPressed: onShowRequests,
              style: TextButton.styleFrom(
                foregroundColor: Colors.white,
                backgroundColor: AppColors.accentColor,
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 8,
                ),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(20),
                ),
              ),
              child: const Text(
                'Requests',
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
            ),
        ],
      );
    }

    if (isProcessing) {
      return SizedBox(
        height: 36,
        width: 36,
        child: CircularProgressIndicator(
          strokeWidth: 2,
          valueColor: AlwaysStoppedAnimation<Color>(
            hasRequested ? Colors.grey[400]! : AppColors.primaryColor,
          ),
        ),
      );
    }

    return TextButton(
      onPressed: onPressed,
      style: TextButton.styleFrom(
        foregroundColor: hasRequested ? Colors.grey[600] : Colors.white,
        backgroundColor:
            hasRequested ? Colors.grey[200] : AppColors.primaryColor,
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      ),
      child: Text(
        hasRequested ? 'Requested' : 'Join',
        style: const TextStyle(fontWeight: FontWeight.bold),
      ),
    );
  }
}
