import 'package:flutter/material.dart';
import 'package:senior_project/functions/clubs/clubs_api.dart';
import 'package:senior_project/functions/user/get_user_profile.dart'; 
import 'package:senior_project/theme/app_theme.dart';
import 'package:go_router/go_router.dart'; 

class ClubDetailsPage extends StatefulWidget {
  final String clubId;
  final String clubName;

  const ClubDetailsPage({
    Key? key,
    required this.clubId,
    required this.clubName,
  }) : super(key: key);

  @override
  State<ClubDetailsPage> createState() => ClubDetailsPageState();
}

class ClubDetailsPageState extends State<ClubDetailsPage> {
  bool isLoading = true;
  String? errorMessage;
  List<dynamic> members = [];
  Map<String, dynamic> clubInfo = {};
  Map<String, dynamic>? instructorInfo; 

  @override
  void initState() {
    super.initState();
    loadClubInfo();
  }

  Future<void> loadClubInfo() async {
    setState(() {
      isLoading = true;
      errorMessage = null;
    });

    try {
      final info = await getClubInfo(widget.clubId);
      setState(() {
        clubInfo = info;
        members = info['clubMembers'] as List<dynamic>? ?? [];
      });

      if (clubInfo['adminid'] != null) {
        try {
          final adminProfile = await getUserProfileData(clubInfo['adminid']);
          if (mounted && adminProfile != null) {
            setState(() {
              instructorInfo = {
                'username': adminProfile.username,
                'email': adminProfile.email,
              };
            });
          }
        } catch (e) {
          print('Failed to load instructor info: $e');
        }
      }

      if (mounted) {
        setState(() {
          isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          errorMessage = e.toString();
          isLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(widget.clubName), elevation: 0),
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
                      onPressed: loadClubInfo,
                      child: const Text('Retry'),
                    ),
                  ],
                ),
              )
              : SingleChildScrollView(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    buildClubInfoSection(),
                    const Divider(height: 32, thickness: 1),
                    buildMembersSection(),
                  ],
                ),
              ),
    );
  }

  Widget buildClubInfoSection() {
    if (clubInfo.isEmpty) {
      return const Padding(
        padding: EdgeInsets.all(16.0),
        child: Text('Club information not available'),
      );
    }

    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Club Information',
            style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 16),

          buildInfoRow('Name', clubInfo['name'] ?? 'Not specified'),

          if (clubInfo['description'] != null &&
              clubInfo['description'].toString().isNotEmpty)
            buildInfoRow('Description', clubInfo['description']),

          if (clubInfo['room'] != null &&
              clubInfo['room'].toString().isNotEmpty)
            buildInfoRow('Room', clubInfo['room']),

          if (instructorInfo != null)
            buildInstructorRow(
              'Instructor',
              '${instructorInfo!['username'] ?? 'Unknown'} (${instructorInfo!['email'] ?? ''})',
              clubInfo['adminid'],
            )
          else if (clubInfo['adminid'] != null)
            buildInfoRow('Instructor ID', clubInfo['adminid']),
        ],
      ),
    );
  }

  Widget buildInstructorRow(String label, String value, String? userId) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: const TextStyle(fontSize: 14, color: Colors.grey)),
          const SizedBox(height: 4),
          GestureDetector(
            onTap: () {
              if (userId != null) {
                context.push('/profile/$userId');
              }
            },
            child: Text(
              value,
              style: const TextStyle(fontSize: 16),
            ),
          ),
        ],
      ),
    );
  }

  Widget buildInfoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: const TextStyle(fontSize: 14, color: Colors.grey)),
          const SizedBox(height: 4),
          Text(value, style: const TextStyle(fontSize: 16)),
        ],
      ),
    );
  }

  Widget buildMembersSection() {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Members (${members.length})',
                style: const TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          members.isEmpty
              ? const Center(
                child: Padding(
                  padding: EdgeInsets.symmetric(vertical: 32.0),
                  child: Text('No members found'),
                ),
              )
              : ListView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: members.length,
                itemBuilder: (context, index) {
                  final member = members[index];
                  return Card(
                    margin: const EdgeInsets.only(bottom: 8),
                    child: ListTile(
                      leading: CircleAvatar(
                        backgroundColor: AppColors.primaryColor,
                        backgroundImage:
                            member['profilepicture'] != null
                                ? NetworkImage(member['profilepicture'])
                                : null,
                        child:
                            member['profilepicture'] == null
                                ? Text(
                                  member['username']?.isNotEmpty == true
                                      ? member['username'][0].toUpperCase()
                                      : '?',
                                  style: const TextStyle(color: Colors.white),
                                )
                                : null,
                      ),
                      title: GestureDetector(
                        onTap: () {
                          final userId = member['userid'];
                          if (userId != null) {
                            context.push('/profile/$userId');
                          }
                        },
                        child: Text(
                          member['username'] ?? 'Unknown',
                          style: const TextStyle(fontSize: 16),
                        ),
                      ),
                      subtitle: Text(member['email'] ?? ''),
                    ),
                  );
                },
              ),
        ],
      ),
    );
  }
}
