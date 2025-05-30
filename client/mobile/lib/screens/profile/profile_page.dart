import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:senior_project/providers/user_provider.dart';
import 'package:go_router/go_router.dart';
import 'package:senior_project/components/profile/profile_info_row.dart';
import 'package:senior_project/components/profile/profile_section_card.dart';
import 'package:senior_project/modules/user_profile.dart';
import 'package:senior_project/functions/user/get_user_profile.dart';

class ProfilePage extends StatefulWidget {
  final bool fromBottomNav;
  final String? userId;

  const ProfilePage({super.key, this.fromBottomNav = true, this.userId});

  @override
  State<ProfilePage> createState() => ProfilePageState();
}

class ProfilePageState extends State<ProfilePage> {
  UserProfile? userProfile;
  bool isLoading = true;
  String? errorMessage;

  @override
  void initState() {
    super.initState();
    _loadUserProfile();
  }

  Future<void> _loadUserProfile() async {
    setState(() {
      isLoading = true;
      errorMessage = null;
    });

    try {
      final userId =
          widget.userId ??
          Provider.of<UserProvider>(context, listen: false).currentUser?.userId;

      if (userId == null) {
        setState(() {
          errorMessage = 'User ID not found';
          isLoading = false;
        });
        return;
      }

      final profile = await getUserProfileData(userId);

      if (profile == null) {
        setState(() {
          errorMessage = 'Failed to load user profile';
          isLoading = false;
        });
        return;
      }

      setState(() {
        userProfile = profile;
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
      appBar: AppBar(
        title: Text(widget.fromBottomNav ? 'My Profile' : 'Profile'),
        elevation: 0,
        actions:
            widget.fromBottomNav
                ? [
                  IconButton(
                    icon: const Icon(Icons.edit),
                    tooltip: 'Edit Profile',
                    onPressed: () {
                      context.push('/edit-profile', extra: userProfile);
                    },
                  ),
                  IconButton(
                    icon: const Icon(Icons.logout),
                    onPressed: () {
                      showDialog(
                        context: context,
                        builder:
                            (context) => AlertDialog(
                              title: const Text('Sign Out'),
                              content: const Text(
                                'Are you sure you want to sign out?',
                              ),
                              actions: [
                                TextButton(
                                  child: const Text('Cancel'),
                                  onPressed: () => Navigator.pop(context),
                                ),
                                TextButton(
                                  child: const Text('Sign Out'),
                                  onPressed: () {
                                    Provider.of<UserProvider>(
                                      context,
                                      listen: false,
                                    ).clearUser();
                                    Navigator.pop(context);
                                    context.go('/login');
                                  },
                                ),
                              ],
                            ),
                      );
                    },
                  ),
                ]
                : null,
      ),
      body:
          isLoading
              ? const Center(child: CircularProgressIndicator())
              : errorMessage != null
              ? Center(child: Text('Error: $errorMessage'))
              : _buildProfileContent(),
    );
  }

  Widget _buildProfileContent() {
    if (userProfile == null) {
      return const Center(child: Text('No profile data available'));
    }

    return RefreshIndicator(
      onRefresh: _loadUserProfile,
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Center(
              child: CircleAvatar(
                radius: 60,
                backgroundColor:
                    userProfile!.profilePicture == null ||
                            userProfile!.profilePicture!.isEmpty
                        ? Colors.blueGrey[700]
                        : Colors.grey[300],
                backgroundImage:
                    userProfile!.profilePicture != null &&
                            userProfile!.profilePicture!.isNotEmpty
                        ? NetworkImage(userProfile!.profilePicture!)
                            as ImageProvider
                        : null,
                child:
                    userProfile!.profilePicture == null ||
                            userProfile!.profilePicture!.isEmpty
                        ? Text(
                          (userProfile!.username?.isNotEmpty == true)
                              ? userProfile!.username![0].toUpperCase()
                              : '?',
                          style: const TextStyle(
                            fontSize: 40,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        )
                        : null,
              ),
            ),

            const SizedBox(height: 20),

            Text(
              userProfile!.username ?? 'No Username',
              style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 5),
            Text(
              userProfile!.email ?? 'No Email',
              style: TextStyle(fontSize: 16, color: Colors.grey[600]),
            ),

            const SizedBox(height: 20),

            ProfileSectionCard(
              title: 'Bio',
              children: [
                Text(
                  userProfile!.bio ?? 'No bio information available.',
                  style: const TextStyle(
                    fontSize: 16,
                    color: Color.fromARGB(255, 255, 255, 255),
                  ),
                ),
              ],
            ),

            ProfileSectionCard(
              title: 'Education',
              children: [
                ProfileInfoRow(
                  label: 'University',
                  value: userProfile!.universityName ?? 'Not specified',
                ),
                if (userProfile!.isStudent == true) ...[
                  const Divider(height: 20),
                  ProfileInfoRow(
                    label: 'Campus',
                    value: userProfile!.campusName ?? 'Not specified',
                  ),
                  const Divider(height: 20),
                  ProfileInfoRow(
                    label: 'Major',
                    value: userProfile!.majorName ?? 'Not specified',
                  ),
                ],
              ],
            ),

            ProfileSectionCard(
              title: 'Account Status',
              children: [
                ProfileInfoRow(
                  label: 'Account Type',
                  value:
                      userProfile!.isStudent == true ? 'Student' : 'Instructor',
                ),
                const Divider(height: 20),
                ProfileInfoRow(
                  label: 'Member Since',
                  value:
                      userProfile!.createdAt != null
                          ? '${userProfile!.createdAt!.day}/${userProfile!.createdAt!.month}/${userProfile!.createdAt!.year}'
                          : 'Unknown',
                ),
              ],
            ),

            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }
}
