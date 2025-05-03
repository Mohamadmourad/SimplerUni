import 'package:flutter/material.dart';
import 'package:senior_project/functions/clubs/clubs_api.dart';
import 'package:senior_project/theme/app_theme.dart';

class ClubMembersPage extends StatefulWidget {
  final String clubId;
  final String clubName;

  const ClubMembersPage({
    Key? key,
    required this.clubId,
    required this.clubName,
  }) : super(key: key);

  @override
  State<ClubMembersPage> createState() => _ClubMembersPageState();
}

class _ClubMembersPageState extends State<ClubMembersPage> {
  bool isLoading = true;
  String? errorMessage;
  List<dynamic> members = [];

  @override
  void initState() {
    super.initState();
    loadMembers();
  }

  Future<void> loadMembers() async {
    setState(() {
      isLoading = true;
      errorMessage = null;
    });

    try {
      final result = await getClubMembers(widget.clubId);
      setState(() {
        members = result;
        isLoading = false;
      });
    } catch (e) {
      setState(() {
        errorMessage = e.toString();
        isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('${widget.clubName} - Members'), elevation: 0),
      body:
          isLoading
              ? const Center(child: CircularProgressIndicator())
              : errorMessage != null
              ? Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text('Error: $errorMessage'),
                    const SizedBox(height: 16),
                    ElevatedButton(
                      onPressed: loadMembers,
                      child: const Text('Retry'),
                    ),
                  ],
                ),
              )
              : members.isEmpty
              ? const Center(child: Text('No members found'))
              : ListView.builder(
                itemCount: members.length,
                itemBuilder: (context, index) {
                  final member = members[index];
                  return ListTile(
                    leading: CircleAvatar(
                      backgroundColor: AppColors.primaryColor,
                      child: Text(
                        member['username']?.isNotEmpty == true
                            ? member['username'][0].toUpperCase()
                            : '?',
                        style: const TextStyle(color: Colors.white),
                      ),
                    ),
                    title: Text(member['username'] ?? 'Unknown'),
                    subtitle: Text(member['email'] ?? ''),
                    trailing: IconButton(
                      icon: const Icon(Icons.person_remove),
                      onPressed: () {
                        // Add functionality to remove member
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Remove member feature coming soon'),
                          ),
                        );
                      },
                    ),
                  );
                },
              ),
    );
  }
}
