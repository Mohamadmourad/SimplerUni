import 'package:flutter/material.dart';

class EmptyNewsState extends StatelessWidget {
  final Future<void> Function() onRefresh;

  const EmptyNewsState({Key? key, required this.onRefresh}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return RefreshIndicator(
      onRefresh: onRefresh,
      child: ListView(
        children: [
          SizedBox(
            height: MediaQuery.of(context).size.height * 0.7,
            child: Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.newspaper, size: 80, color: Colors.grey),
                  const SizedBox(height: 16),
                  const Text(
                    'No News Available',
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'There are no university announcements at the moment',
                    textAlign: TextAlign.center,
                    style: TextStyle(color: Colors.grey),
                  ),
                  const SizedBox(height: 24),
                  ElevatedButton(
                    onPressed: onRefresh,
                    child: const Text('Refresh'),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
