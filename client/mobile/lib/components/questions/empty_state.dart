import 'package:flutter/material.dart';

class EmptyState extends StatelessWidget {
  final VoidCallback onAddQuestion;

  const EmptyState({Key? key, required this.onAddQuestion}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.question_mark, size: 80, color: Colors.grey),
          const SizedBox(height: 16),
          const Text(
            'No questions yet',
            style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 8),
          const Text(
            'Be the first to ask a question!',
            style: TextStyle(color: Colors.grey),
          ),
          const SizedBox(height: 24),
          ElevatedButton(
            onPressed: onAddQuestion,
            child: const Text('Ask a Question'),
          ),
        ],
      ),
    );
  }
}
