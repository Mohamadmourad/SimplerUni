import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:senior_project/providers/user_provider.dart';

class Homepage extends StatefulWidget {
  const Homepage({super.key});

  @override
  State<Homepage> createState() => _HomepageState();
}

class _HomepageState extends State<Homepage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Home Page'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text('Welcome to the Home Page!'),
            ElevatedButton(
              onPressed: () {
                // Navigate to another page or perform an action
              },
              child: const Text('Go to another page'),
            ),
          ],
        ),
      ),
    );
  }
}