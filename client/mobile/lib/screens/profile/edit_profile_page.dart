import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:senior_project/functions/callApi.dart';
import 'package:senior_project/modules/user_profile.dart';
import 'package:senior_project/providers/user_provider.dart';
import 'package:senior_project/functions/chat/uploadDocuments.dart';
import 'package:senior_project/components/custom_dropdown.dart';

class EditProfilePage extends StatefulWidget {
  final UserProfile userProfile;

  const EditProfilePage({super.key, required this.userProfile});

  @override
  State<EditProfilePage> createState() => _EditProfilePageState();
}

class _EditProfilePageState extends State<EditProfilePage> {
  final formKey = GlobalKey<FormState>();
  bool isLoading = false;
  String? errorMessage;
  String? uploadedImageUrl;
  bool isImageUploading = false;

  late TextEditingController usernameController;
  late TextEditingController bioController;

  List<Map<String, dynamic>> campusesList = [];
  List<Map<String, dynamic>> majorsList = [];

  String? selectedCampusId;
  String? selectedMajorId;

  bool get hasProfileImage => uploadedImageUrl != null;

  @override
  void initState() {
    super.initState();
    usernameController = TextEditingController(
      text: widget.userProfile.username,
    );
    bioController = TextEditingController(text: widget.userProfile.bio);

    if (widget.userProfile.profilePicture != null &&
        widget.userProfile.profilePicture!.isNotEmpty) {
      uploadedImageUrl = widget.userProfile.profilePicture;
    }

    if (widget.userProfile.isStudent == true) {
      loadCampusesAndMajors();
    }
  }

  @override
  void dispose() {
    usernameController.dispose();
    bioController.dispose();
    super.dispose();
  }

  Future<void> loadCampusesAndMajors() async {
    setState(() {
      isLoading = true;
      errorMessage = null;
    });

    try {
      final SharedPreferences prefs = await SharedPreferences.getInstance();
      final String? authToken = prefs.getString('authToken');

      if (authToken == null) {
        throw Exception('Authentication token not found');
      }

      final campusesResponse = await makeApiCall(
        'GET',
        null,
        'university/getAllCampsus',
        authToken,
      );

      if (campusesResponse['statusCode'] == 200 &&
          campusesResponse['body'] != null) {
        if (campusesResponse['body'] is Map &&
            campusesResponse['body']['data'] != null) {
          campusesList = List<Map<String, dynamic>>.from(
            campusesResponse['body']['data'],
          );

          if (widget.userProfile.campusName != null) {
            try {
              final currentCampus = campusesList.firstWhere(
                (campus) => campus['name'] == widget.userProfile.campusName,
                orElse: () => {'campus_id': null},
              );

              if (currentCampus['campus_id'] != null) {
                selectedCampusId = currentCampus['campus_id'].toString();
              } else {
                selectedCampusId = null;
              }
            } catch (e) {
              print("Error finding campus: $e");
              selectedCampusId = null;
            }
          }
        }
      }

      final majorsResponse = await makeApiCall(
        'GET',
        null,
        'university/getAllMajors',
        authToken,
      );

      if (majorsResponse['statusCode'] == 200 &&
          majorsResponse['body'] != null) {
        if (majorsResponse['body'] is Map &&
            majorsResponse['body']['data'] != null) {
          majorsList = List<Map<String, dynamic>>.from(
            majorsResponse['body']['data'],
          );

          if (widget.userProfile.majorName != null) {
            try {
              final currentMajor = majorsList.firstWhere(
                (major) => major['name'] == widget.userProfile.majorName,
                orElse: () => {'major_id': null},
              );

              if (currentMajor['major_id'] != null) {
                selectedMajorId = currentMajor['major_id'].toString();
              } else {
                selectedMajorId = null;
              }
            } catch (e) {
              print("Error finding major: $e");
              selectedMajorId = null;
            }
          }
        }
      }
    } catch (e) {
      setState(() {
        errorMessage = 'Failed to load campus or major data: ${e.toString()}';
      });
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }

  Future<void> pickImage() async {
    try {
      setState(() {
        isImageUploading = true;
      });

      bool uploadCompleted = false;

      await handleImageUpload((cdnUrl) {
        uploadCompleted = true;
        final String url = jsonDecode(cdnUrl)['url'];
        print('Image upload completed successfully. CDN URL: $url');

        setState(() {
          uploadedImageUrl = url;
          isImageUploading = false;
        });
      });

      if (!uploadCompleted) {
        setState(() {
          isImageUploading = false;
        });
      }
    } catch (e) {
      setState(() {
        isImageUploading = false;
      });

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error uploading image: ${e.toString()}')),
      );
    }
  }

  Future<void> saveProfile() async {
    if (isImageUploading) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please wait for image upload to complete'),
        ),
      );
      return;
    }

    if (!formKey.currentState!.validate()) {
      return;
    }

    setState(() {
      isLoading = true;
      errorMessage = null;
    });

    try {
      final SharedPreferences prefs = await SharedPreferences.getInstance();
      final String? authToken = prefs.getString('authToken');
      final userProvider = Provider.of<UserProvider>(context, listen: false);

      if (authToken == null) {
        throw Exception('Authentication token not found');
      }

      final Map<String, dynamic> updatedData = {};

      if (usernameController.text != widget.userProfile.username) {
        updatedData['username'] = usernameController.text;
      }

      if (bioController.text != widget.userProfile.bio) {
        updatedData['bio'] = bioController.text;
      }

      if (uploadedImageUrl != null &&
          uploadedImageUrl != widget.userProfile.profilePicture) {
        updatedData['profilePicture'] = uploadedImageUrl;
      }

      if (selectedCampusId != null) {
        updatedData['campusId'] = selectedCampusId;
      }

      if (selectedMajorId != null) {
        updatedData['majorId'] = selectedMajorId;
      }

      if (updatedData.isNotEmpty) {
        final response = await makeApiCall(
          'POST',
          jsonEncode(updatedData),
          'user/editUserProfile',
          authToken,
        );

        if (response['statusCode'] == 200 || response['statusCode'] == 201) {
          String? campusName = widget.userProfile.campusName;
          if (selectedCampusId != null) {
            try {
              final matchingCampus = campusesList.firstWhere(
                (c) =>
                    (c['campusid'] ?? c['campus_id'] ?? c['id'])?.toString() ==
                    selectedCampusId,
                orElse: () => {},
              );
              campusName =
                  matchingCampus['campusname'] ??
                  matchingCampus['name'] ??
                  widget.userProfile.campusName;
            } catch (e) {
              print("Error finding campus name: $e");
            }
          }

          String? majorName = widget.userProfile.majorName;
          if (selectedMajorId != null) {
            try {
              final matchingMajor = majorsList.firstWhere(
                (m) =>
                    (m['majorid'] ?? m['major_id'] ?? m['id'])?.toString() ==
                    selectedMajorId,
                orElse: () => {},
              );
              majorName =
                  matchingMajor['majorname'] ??
                  matchingMajor['name'] ??
                  widget.userProfile.majorName;
            } catch (e) {
              print("Error finding major name: $e");
            }
          }

          final updatedProfile = UserProfile(
            userId: widget.userProfile.userId,
            username: usernameController.text,
            email: widget.userProfile.email,
            bio: bioController.text,
            profilePicture:
                uploadedImageUrl ?? widget.userProfile.profilePicture,
            isStudent: widget.userProfile.isStudent,
            universityName: widget.userProfile.universityName,
            campusName: campusName,
            majorName: majorName,
            createdAt: widget.userProfile.createdAt,
          );

          userProvider.updateUserProfile(updatedProfile);

          await updateLocalUserData(updatedData);

          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Profile updated successfully')),
          );
          context.pop(true);
        } else {
          throw Exception(response['error'] ?? 'Failed to update profile');
        }
      } else {
        context.pop(false);
      }
    } catch (e) {
      setState(() {
        errorMessage = e.toString();
      });
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }

  Future<void> updateLocalUserData(Map<String, dynamic> updatedData) async {
    try {
      final SharedPreferences prefs = await SharedPreferences.getInstance();
      final String? userData = prefs.getString('userData');

      if (userData != null) {
        final Map<String, dynamic> userMap = json.decode(userData);

        if (updatedData.containsKey('username')) {
          userMap['username'] = updatedData['username'];
        }
        if (updatedData.containsKey('bio')) {
          userMap['bio'] = updatedData['bio'];
        }
        if (updatedData.containsKey('profilePicture')) {
          userMap['profilePicture'] = updatedData['profilePicture'];
        }

        await prefs.setString('userData', json.encode(userMap));
        print('User data updated in SharedPreferences');
      }
    } catch (e) {
      print('Error updating user data in SharedPreferences: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: !isImageUploading,
      onPopInvoked: (didPop) {
        if (!didPop) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Please wait for image upload to complete'),
            ),
          );
        }
      },
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Edit Profile'),
          elevation: 0,
          automaticallyImplyLeading: !isImageUploading,
          leading:
              isImageUploading
                  ? null
                  : IconButton(
                    icon: const Icon(Icons.arrow_back),
                    onPressed: () => context.pop(),
                  ),
          actions: [
            TextButton.icon(
              icon: const Icon(Icons.save, color: Colors.white),
              label: const Text('Save', style: TextStyle(color: Colors.white)),
              onPressed: (isLoading || isImageUploading) ? null : saveProfile,
              style: TextButton.styleFrom(
                foregroundColor:
                    (isLoading || isImageUploading)
                        ? Colors.grey.shade400
                        : Colors.white,
              ),
            ),
          ],
        ),
        body:
            isLoading
                ? const Center(child: CircularProgressIndicator())
                : Form(
                  key: formKey,
                  child: SingleChildScrollView(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      children: [
                        if (errorMessage != null)
                          Padding(
                            padding: const EdgeInsets.only(bottom: 16.0),
                            child: Card(
                              color: Colors.red[100],
                              child: Padding(
                                padding: const EdgeInsets.all(8.0),
                                child: Row(
                                  children: [
                                    const Icon(Icons.error, color: Colors.red),
                                    const SizedBox(width: 8),
                                    Expanded(
                                      child: Text(
                                        errorMessage!,
                                        style: TextStyle(
                                          color: Colors.red[900],
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ),

                        Center(
                          child: Column(
                            children: [
                              GestureDetector(
                                onTap: isImageUploading ? null : pickImage,
                                child: Container(
                                  width: 120,
                                  height: 120,
                                  decoration: BoxDecoration(
                                    color: Colors.grey[200],
                                    shape: BoxShape.circle,
                                    image:
                                        hasProfileImage && !isImageUploading
                                            ? DecorationImage(
                                              image: NetworkImage(
                                                uploadedImageUrl!,
                                              ),
                                              fit: BoxFit.cover,
                                            )
                                            : null,
                                  ),
                                  child:
                                      isImageUploading
                                          ? const Center(
                                            child: CircularProgressIndicator(),
                                          )
                                          : hasProfileImage
                                          ? null
                                          : Center(
                                            child: Text(
                                              usernameController.text.isNotEmpty
                                                  ? usernameController.text[0]
                                                      .toUpperCase()
                                                  : '?',
                                              style: const TextStyle(
                                                fontSize: 40,
                                                fontWeight: FontWeight.bold,
                                                color: Colors.black54,
                                              ),
                                            ),
                                          ),
                                ),
                              ),
                              const SizedBox(height: 8),
                              TextButton(
                                onPressed: isImageUploading ? null : pickImage,
                                child: Text(
                                  isImageUploading
                                      ? 'Uploading...'
                                      : 'Change Profile Picture',
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 24),

                        TextFormField(
                          controller: usernameController,
                          decoration: const InputDecoration(
                            labelText: 'Username',
                            border: OutlineInputBorder(),
                            prefixIcon: Icon(Icons.person),
                          ),
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'Please enter a username';
                            }
                            return null;
                          },
                        ),
                        const SizedBox(height: 16),

                        TextFormField(
                          controller: bioController,
                          decoration: const InputDecoration(
                            labelText: 'Bio',
                            border: OutlineInputBorder(),
                            prefixIcon: Icon(Icons.description),
                            alignLabelWithHint: true,
                          ),
                          maxLines: 3,
                        ),
                        const SizedBox(height: 16),

                        if (widget.userProfile.isStudent == true) ...[
                          if (campusesList.isNotEmpty) ...[
                            const Text(
                              'Campus',
                              style: TextStyle(fontWeight: FontWeight.bold),
                            ),
                            const SizedBox(height: 8),
                            Builder(
                              builder: (context) {
                                final items =
                                    campusesList
                                        .where((campus) {
                                          final id =
                                              campus['campusid'] ??
                                              campus['campus_id'] ??
                                              campus['id'];
                                          return id != null &&
                                              id.toString().isNotEmpty;
                                        })
                                        .map((campus) {
                                          final id =
                                              (campus['campusid'] ??
                                                      campus['campus_id'] ??
                                                      campus['id'])
                                                  .toString();
                                          return DropdownMenuItem<String>(
                                            value: id,
                                            child: Text(
                                              campus['campusname'] ??
                                                  campus['name'] ??
                                                  'Unknown Campus',
                                            ),
                                          );
                                        })
                                        .toList();

                                final bool hasValidSelection =
                                    selectedCampusId != null &&
                                    items.any(
                                      (item) => item.value == selectedCampusId,
                                    );

                                return CustomDropdown<String>(
                                  value:
                                      hasValidSelection
                                          ? selectedCampusId
                                          : null,
                                  hint: 'Select your campus',
                                  prefixIcon: Icons.location_on,
                                  items: items,
                                  onChanged: (value) {
                                    setState(() {
                                      selectedCampusId = value;
                                    });
                                  },
                                );
                              },
                            ),
                            const SizedBox(height: 16),
                          ],

                          if (majorsList.isNotEmpty) ...[
                            const Text(
                              'Major',
                              style: TextStyle(fontWeight: FontWeight.bold),
                            ),
                            const SizedBox(height: 8),
                            Builder(
                              builder: (context) {
                                final items =
                                    majorsList
                                        .where((major) {
                                          final id =
                                              major['majorid'] ??
                                              major['major_id'] ??
                                              major['id'];
                                          return id != null &&
                                              id.toString().isNotEmpty;
                                        })
                                        .map((major) {
                                          final id =
                                              (major['majorid'] ??
                                                      major['major_id'] ??
                                                      major['id'])
                                                  .toString();
                                          return DropdownMenuItem<String>(
                                            value: id,
                                            child: Text(
                                              major['majorname'] ??
                                                  major['name'] ??
                                                  'Unknown Major',
                                            ),
                                          );
                                        })
                                        .toList();

                                final bool hasValidSelection =
                                    selectedMajorId != null &&
                                    items.any(
                                      (item) => item.value == selectedMajorId,
                                    );

                                return CustomDropdown<String>(
                                  value:
                                      hasValidSelection
                                          ? selectedMajorId
                                          : null,
                                  hint: 'Select your major',
                                  prefixIcon: Icons.school,
                                  items: items,
                                  onChanged: (value) {
                                    setState(() {
                                      selectedMajorId = value;
                                    });
                                  },
                                );
                              },
                            ),
                          ],
                        ],
                      ],
                    ),
                  ),
                ),
      ),
    );
  }
}
