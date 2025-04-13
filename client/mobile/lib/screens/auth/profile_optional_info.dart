import 'package:flutter/material.dart';
import 'package:senior_project/components/auth_button.dart';
import 'package:senior_project/theme/app_theme.dart';
import 'package:go_router/go_router.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:io';
import 'package:image_picker/image_picker.dart';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'dart:typed_data';
import 'package:senior_project/functions/auth/complete_profile.dart';

class ProfileOptionalInfo extends StatefulWidget {
  const ProfileOptionalInfo({super.key});

  @override
  State<ProfileOptionalInfo> createState() => _ProfileOptionalInfoState();
}

class _ProfileOptionalInfoState extends State<ProfileOptionalInfo> {
  final formKey = GlobalKey<FormState>();
  bool isLoading = false;
  String? errorMessage;
  String? selectedMajorId;
  String? selectedCampusId;

  // Bio
  final bioController = TextEditingController();

  // Profile image
  File? profileImage;
  Uint8List? webImage;
  bool get hasProfileImage => profileImage != null || webImage != null;

  @override
  void initState() {
    super.initState();
    _loadSavedData();
  }

  Future<void> _loadSavedData() async {
    try {
      final SharedPreferences prefs = await SharedPreferences.getInstance();
      setState(() {
        selectedMajorId = prefs.getString('selectedMajorId');
        selectedCampusId = prefs.getString('selectedCampusId');
      });

      if (selectedMajorId == null || selectedCampusId == null) {
        // If required data is missing, go back to the first page
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Please complete the required information first'),
          ),
        );
        context.go('/complete-profile');
      }
    } catch (e) {
      setState(() {
        errorMessage = e.toString();
      });
    }
  }

  @override
  void dispose() {
    bioController.dispose();
    super.dispose();
  }

  Future<void> selectImage() async {
    final ImagePicker picker = ImagePicker();

    try {
      if (kIsWeb) {
        // Web implementation
        final XFile? image = await picker.pickImage(
          source: ImageSource.gallery,
          maxWidth: 1000,
          maxHeight: 1000,
        );

        if (image != null) {
          final Uint8List data = await image.readAsBytes();
          setState(() {
            webImage = data;
          });
        }
      } else {
        // Native implementation (Android/iOS)
        final XFile? image = await picker.pickImage(
          source: ImageSource.gallery,
        );

        if (image != null) {
          setState(() {
            profileImage = File(image.path);
          });
        }
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error picking image: ${e.toString()}')),
      );
    }
  }

  Future<void> submitProfile() async {
    if (!formKey.currentState!.validate()) {
      return;
    }

    if (selectedMajorId == null || selectedCampusId == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Required information is missing. Please go back.'),
        ),
      );
      return;
    }

    setState(() {
      isLoading = true;
      errorMessage = null;
    });

    try {
      // Optional data
      Map<String, dynamic> optionalData = {};
      if (bioController.text.isNotEmpty) {
        optionalData['bio'] = bioController.text;
      }

      // Call the API
      final result = await completeUserProfile(
        selectedMajorId!,
        selectedCampusId!,
        optionalData: optionalData,
      );

      if (result['success']) {
        // Show success message
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text(result['message'])));

        // Navigate to home
        context.go('/home');
      } else {
        setState(() {
          errorMessage = result['message'];
        });
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text(result['message'])));
      }
    } catch (e) {
      setState(() {
        errorMessage = e.toString();
      });
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Error: ${e.toString()}')));
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Profile Details'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.go('/complete-profile'),
        ),
      ),
      body: SafeArea(
        child: Form(
          key: formKey,
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const Icon(
                  Icons.person,
                  size: 64,
                  color: AppColors.primaryColor,
                ),
                const SizedBox(height: 24),
                const Text(
                  'Optional Profile Information',
                  style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 8),
                const Text(
                  'Add more details to complete your profile',
                  style: TextStyle(
                    fontSize: 16,
                    color: AppColors.textSecondary,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 32),

                // Error message if any
                if (errorMessage != null)
                  Padding(
                    padding: const EdgeInsets.only(bottom: 16.0),
                    child: Text(
                      errorMessage!,
                      style: const TextStyle(color: Colors.red),
                      textAlign: TextAlign.center,
                    ),
                  ),

                // Profile Image Selection
                Center(
                  child: Column(
                    children: [
                      GestureDetector(
                        onTap: selectImage,
                        child: Container(
                          width: 120,
                          height: 120,
                          decoration: BoxDecoration(
                            color: Colors.grey[200],
                            shape: BoxShape.circle,
                            image:
                                hasProfileImage
                                    ? DecorationImage(
                                      image:
                                          kIsWeb
                                              ? MemoryImage(webImage!)
                                                  as ImageProvider
                                              : FileImage(profileImage!),
                                      fit: BoxFit.cover,
                                    )
                                    : null,
                          ),
                          child:
                              hasProfileImage
                                  ? null
                                  : const Icon(
                                    Icons.add_a_photo,
                                    size: 40,
                                    color: AppColors.primaryColor,
                                  ),
                        ),
                      ),
                      const SizedBox(height: 8),
                      TextButton(
                        onPressed: selectImage,
                        child: const Text('Choose Profile Picture'),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 24),

                // Bio Field
                const Text(
                  'Bio',
                  style: TextStyle(fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 8),
                TextFormField(
                  controller: bioController,
                  decoration: const InputDecoration(
                    hintText: 'Tell us about yourself...',
                    prefixIcon: Icon(Icons.description),
                    border: OutlineInputBorder(),
                    filled: true,
                  ),
                  maxLines: 3,
                ),

                const SizedBox(height: 40),

                // Submit Button
                AuthButton(
                  text: 'COMPLETE PROFILE',
                  isLoading: isLoading,
                  onPressed: submitProfile,
                ),

                const SizedBox(height: 16),

                // Skip button
                TextButton(
                  onPressed:
                      submitProfile, // Same handler, as it will submit with just empty optionals
                  child: const Text('SKIP FOR NOW'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
