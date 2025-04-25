import 'package:flutter/material.dart';

class FilterOptions extends StatelessWidget {
  final Function(String) onFilterSelected;

  const FilterOptions({Key? key, required this.onFilterSelected})
    : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Text(
            'Filter Questions',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 16),
          ListTile(
            leading: const Icon(Icons.access_time),
            title: const Text('Most Recent'),
            onTap: () {
              Navigator.pop(context);
              onFilterSelected('latest');
            },
          ),
          ListTile(
            leading: const Icon(Icons.trending_up),
            title: const Text('Most Upvoted'),
            onTap: () {
              Navigator.pop(context);
              onFilterSelected('mostUpvotes');
            },
          ),
          ListTile(
            leading: const Icon(Icons.comment),
            title: const Text('Most Answers'),
            onTap: () {
              Navigator.pop(context);
              onFilterSelected('mostAnswers');
            },
          ),
        ],
      ),
    );
  }
}
