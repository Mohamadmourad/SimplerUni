import 'package:flutter/material.dart';

class ProfileInfoRow extends StatelessWidget {
  final String label;
  final String value;
  final IconData? iconData;
  final Color? iconColor;

  const ProfileInfoRow({
    super.key,
    required this.label,
    required this.value,
    this.iconData,
    this.iconColor,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: TextStyle(fontSize: 16, color: Colors.grey[700])),
        Row(
          children: [
            if (iconData != null)
              Padding(
                padding: const EdgeInsets.only(right: 6.0),
                child: Icon(iconData, size: 18, color: iconColor),
              ),
            Text(
              value,
              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
            ),
          ],
        ),
      ],
    );
  }
}
