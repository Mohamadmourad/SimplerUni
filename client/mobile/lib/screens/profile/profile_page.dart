import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:senior_project/providers/user_provider.dart';
import 'package:go_router/go_router.dart';
import 'package:senior_project/components/profile/profile_info_row.dart';
import 'package:senior_project/components/profile/profile_section_card.dart';

class ProfilePage extends StatefulWidget {
  final bool fromBottomNav;
  final String? userId;

  const ProfilePage({super.key, this.fromBottomNav = true, this.userId});

  @override
  State<ProfilePage> createState() => ProfilePageState();
}

class ProfilePageState extends State<ProfilePage> {
  @override
  Widget build(BuildContext context) {
    return Consumer<UserProvider>(
      builder: (context, userProvider, _) {
        final user = userProvider.currentUser;
        print('User: $user');
        if (user == null) {
          return Scaffold(
            appBar: AppBar(title: const Text('Profile'), elevation: 0),
            body: const Center(child: CircularProgressIndicator()),
          );
        }

        return Scaffold(
          appBar: AppBar(
            title: Text(widget.fromBottomNav ? 'My Profile' : 'Profile'),
            elevation: 0,
            actions:
                widget.fromBottomNav
                    ? [
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
                                        userProvider.clearUser();
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
          body: SingleChildScrollView(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Center(
                  child: Stack(
                    children: [
                      CircleAvatar(
                        radius: 60,
                        backgroundColor:
                            user.profilePicture == null ||
                                    user.profilePicture!.isEmpty
                                ? Colors.blueGrey[700]
                                : Colors.grey[300],
                        backgroundImage:
                            user.profilePicture != null &&
                                    user.profilePicture!.isNotEmpty
                                ? NetworkImage(user.profilePicture!)
                                    as ImageProvider
                                : null,
                        child:
                            user.profilePicture == null ||
                                    user.profilePicture!.isEmpty
                                ? Text(
                                  (user.username?.isNotEmpty == true)
                                      ? user.username![0].toUpperCase()
                                      : '?',
                                  style: const TextStyle(
                                    fontSize: 40,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.white,
                                  ),
                                )
                                : null,
                      ),
                      if (widget.fromBottomNav)
                        Positioned(
                          right: 0,
                          bottom: 0,
                          child: Container(
                            decoration: BoxDecoration(
                              color: Theme.of(context).primaryColor,
                              shape: BoxShape.circle,
                            ),
                            child: IconButton(
                              icon: const Icon(
                                Icons.edit,
                                color: Colors.white,
                                size: 20,
                              ),
                              onPressed: () {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(
                                    content: Text(
                                      'Edit profile picture feature coming soon',
                                    ),
                                  ),
                                );
                              },
                            ),
                          ),
                        ),
                    ],
                  ),
                ),

                const SizedBox(height: 20),

                // Username
                Text(
                  user.username ?? 'No Username',
                  style: const TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                  ),
                ),

                const SizedBox(height: 5),

                // Email
                Text(
                  user.email ?? 'No Email',
                  style: TextStyle(fontSize: 16, color: Colors.grey[600]),
                ),

                const SizedBox(height: 20),

                // Bio Section
                ProfileSectionCard(
                  title: 'Bio',
                  actionButton:
                      widget.fromBottomNav
                          ? IconButton(
                            icon: const Icon(Icons.edit, size: 20),
                            onPressed: () {
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                  content: Text('Edit bio feature coming soon'),
                                ),
                              );
                            },
                          )
                          : null,
                  children: [
                    Text(
                      user.bio ?? 'No bio information available.',
                      style: TextStyle(fontSize: 16, color: Colors.grey[800]),
                    ),
                  ],
                ),

                // Education Info
                ProfileSectionCard(
                  title: 'Education',
                  children: [
                    ProfileInfoRow(
                      label: 'Starting Year',
                      value: user.startingUniYear ?? 'Not specified',
                    ),
                    const Divider(height: 20),
                    ProfileInfoRow(
                      label: 'University',
                      value: user.universityId ?? 'Not specified',
                    ),
                    const Divider(height: 20),
                    ProfileInfoRow(
                      label: 'Campus',
                      value: user.campusId ?? 'Not specified',
                    ),
                    const Divider(height: 20),
                    ProfileInfoRow(
                      label: 'Major',
                      value: user.majorId ?? 'Not specified',
                    ),
                  ],
                ),

                // Account Status
                ProfileSectionCard(
                  title: 'Account Status',
                  children: [
                    ProfileInfoRow(
                      label: 'Email Verified',
                      value: user.isEmailVerified == true ? 'Yes' : 'No',
                      iconData:
                          user.isEmailVerified == true
                              ? Icons.check_circle
                              : Icons.warning,
                      iconColor:
                          user.isEmailVerified == true
                              ? Colors.green
                              : Colors.orange,
                    ),
                    const Divider(height: 20),
                    ProfileInfoRow(
                      label: 'Account Type',
                      value:
                          user.isStudent == true ? 'Student' : 'Regular User',
                    ),
                    const Divider(height: 20),
                    ProfileInfoRow(
                      label: 'Member Since',
                      value:
                          user.createdAt != null
                              ? '${user.createdAt!.day}/${user.createdAt!.month}/${user.createdAt!.year}'
                              : 'Unknown',
                    ),
                  ],
                ),

                const SizedBox(height: 24),
              ],
            ),
          ),
        );
      },
    );
  }
}
