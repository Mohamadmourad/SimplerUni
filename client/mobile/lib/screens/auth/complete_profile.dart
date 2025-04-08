import 'package:flutter/material.dart';
import 'package:senior_project/components/form_input.dart';
import 'package:senior_project/components/auth_button.dart';
import 'package:senior_project/theme/app_theme.dart';
import 'dart:io';
import 'package:image_picker/image_picker.dart';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'dart:typed_data';

class CompleteProfile extends StatefulWidget {
  final String? email;

  const CompleteProfile({super.key, this.email});

  @override
  State<CompleteProfile> createState() => _CompleteProfileState();
}

class _CompleteProfileState extends State<CompleteProfile> {
  final _formKey = GlobalKey<FormState>();
  bool _isLoading = false;
  bool _isFirstStep = true;

  // Required fields controllers
  final _majorController = TextEditingController();
  String _selectedCampus = 'Main Campus';
  final List<String> _campuses = [
    'Main Campus',
    'Downtown Campus',
    'Medical Campus',
    'Science Campus',
  ];

  // Optional fields controllers
  final _bioController = TextEditingController();
  File? _profileImage;
  Uint8List? _webImage;
  bool get hasProfileImage => _profileImage != null || _webImage != null;


  void dispose() {
    _majorController.dispose();
    _bioController.dispose();
    super.dispose();
  }

  Future<void> _selectImage() async {
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
            _webImage = data;
          });
        }
      } else {
        // Native implementation (Android/iOS)
        final XFile? image = await picker.pickImage(
          source: ImageSource.gallery,
        );

        if (image != null) {
          setState(() {
            _profileImage = File(image.path);
          });
        }
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error picking image: ${e.toString()}')),
      );
    }
  }

  Future<void> _submitProfile() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    setState(() {
      _isLoading = true;
    });

    try {
      // Prepare form data
      final Map<String, dynamic> profileData = {
        'major': _majorController.text,
        'campus': _selectedCampus,
        'bio': _bioController.text,
      };

      // Here you would handle image upload and API call to update profile
      // For example:
      // if (_profileImage != null) {
      //   profileData['profileImage'] = await uploadImage(_profileImage!, widget.authToken!);
      // }

      // final response = await makeApiCall(
      //   'POST',
      //   jsonEncode(profileData),
      //   'user/complete-profile',
      //   widget.authToken,
      // );

      // Handle response here

      // For demo purposes, we'll just simulate success
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Profile completed successfully!')),
      );

      // Navigate to home
      Navigator.of(context).pushReplacementNamed('/home');
    } catch (e) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Error: ${e.toString()}')));
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _nextStep() {
    if (_formKey.currentState!.validate()) {
      setState(() {
        _isFirstStep = false;
      });
    }
  }

  void _previousStep() {
    setState(() {
      _isFirstStep = true;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          _isFirstStep
              ? 'Complete Profile - Required'
              : 'Complete Profile - Optional',
        ),
        leading:
            _isFirstStep
                ? IconButton(
                  icon: const Icon(Icons.arrow_back),
                  onPressed: () => Navigator.of(context).pop(),
                )
                : IconButton(
                  icon: const Icon(Icons.arrow_back),
                  onPressed: _previousStep,
                ),
      ),
      body: SafeArea(
        child: Form(
          key: _formKey,
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24.0),
            child: _isFirstStep ? _buildFirstStep() : _buildSecondStep(),
          ),
        ),
      ),
    );
  }

  Widget _buildFirstStep() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        const Icon(Icons.school, size: 80, color: AppColors.primaryColor),
        const SizedBox(height: 24),
        const Text(
          'Required Information',
          style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 8),
        const Text(
          'Please provide your academic information',
          style: TextStyle(fontSize: 16, color: AppColors.textSecondary),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 32),

        // Major field
        FormInput(
          error: "",
          controller: _majorController,
          labelText: 'Major',
          prefixIcon: Icons.book_outlined,
          validator: (value) {
            if (value == null || value.isEmpty) {
              return 'Please enter your major';
            }
            return null;
          },
        ),

        const SizedBox(height: 24),

        // Campus selection dropdown
        DropdownButtonFormField<String>(
          decoration: const InputDecoration(
            labelText: 'Campus',
            prefixIcon: Icon(Icons.location_on_outlined),
            border: OutlineInputBorder(),
            filled: true,
            fillColor: Colors.white,
          ),
          value: _selectedCampus,
          items:
              _campuses.map((campus) {
                return DropdownMenuItem<String>(
                  value: campus,
                  child: Text(campus),
                );
              }).toList(),
          onChanged: (value) {
            setState(() {
              _selectedCampus = value!;
            });
          },
          validator: (value) {
            if (value == null || value.isEmpty) {
              return 'Please select your campus';
            }
            return null;
          },
        ),

        const SizedBox(height: 40),

        // Next button
        AuthButton(text: 'NEXT', isLoading: _isLoading, onPressed: _nextStep),
      ],
    );
  }

  Widget _buildSecondStep() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        const Icon(
          Icons.person_outline,
          size: 80,
          color: AppColors.primaryColor,
        ),
        const SizedBox(height: 24),
        const Text(
          'Optional Information',
          style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 8),
        const Text(
          'Tell us more about yourself',
          style: TextStyle(fontSize: 16, color: AppColors.textSecondary),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 32),

        // Profile Image
        Center(
          child: Column(
            children: [
              GestureDetector(
                onTap: _selectImage,
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
                                      ? MemoryImage(_webImage!) as ImageProvider
                                      : FileImage(_profileImage!),
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
                onPressed: _selectImage,
                child: const Text('Choose Profile Picture'),
              ),
            ],
          ),
        ),

        const SizedBox(height: 24),

        // Bio field
        FormInput(
          error: "",
          controller: _bioController,
          labelText: 'Bio (Optional)',
          prefixIcon: Icons.description_outlined,
        ),

        const SizedBox(height: 40),

        // Submit button
        AuthButton(
          text: 'COMPLETE PROFILE',
          isLoading: _isLoading,
          onPressed: _submitProfile,
        ),

        const SizedBox(height: 16),

        // Skip button
        TextButton(
          onPressed: _submitProfile,
          child: const Text('SKIP AND CONTINUE'),
        ),
      ],
    );
  }
}
