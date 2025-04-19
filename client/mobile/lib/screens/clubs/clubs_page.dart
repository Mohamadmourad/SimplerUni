import 'package:flutter/material.dart';

class ClubsPage extends StatefulWidget {
  const ClubsPage({super.key});

  @override
  State<ClubsPage> createState() => ClubsPageState();
}

class ClubsPageState extends State<ClubsPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Clubs'), elevation: 0),
      body: const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.groups_outlined, size: 80, color: Colors.white54),
            SizedBox(height: 24),
            Text(
              'University clubs will be listed here',
              style: TextStyle(fontSize: 16),
            ),
          ],
        ),
      ),
    );
  }
}
