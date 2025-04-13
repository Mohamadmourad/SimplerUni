import 'package:flutter/material.dart';
import 'package:senior_project/components/auth_button.dart';
import 'package:senior_project/components/custom_dropdown.dart';
import 'package:senior_project/functions/auth/complete_profile.dart';
import 'package:senior_project/theme/app_theme.dart';
import 'package:go_router/go_router.dart';
import 'package:shared_preferences/shared_preferences.dart';

class CompleteProfile extends StatefulWidget {
  final String email;

  const CompleteProfile({super.key, required this.email});

  @override
  State<CompleteProfile> createState() => _CompleteProfileState();
}

class _CompleteProfileState extends State<CompleteProfile> {
  final formKey = GlobalKey<FormState>();
  bool isLoading = false;
  bool isLoadingData = true;
  String? errorMessage;

  List<Map<String, dynamic>> majors = [];
  List<Map<String, dynamic>> campuses = [];

  String? selectedMajorId;
  String? selectedCampusId;

  @override
  void initState() {
    super.initState();
    loadData();
  }

  Future<void> loadData() async {
    setState(() {
      isLoadingData = true;
      errorMessage = null;
    });

    try {
      final SharedPreferences prefs = await SharedPreferences.getInstance();
      final authToken = prefs.getString('authToken') ?? '';

      if (authToken.isEmpty) {
        setState(() {
          errorMessage = "No authentication token found. Please login again.";
          isLoadingData = false;
        });
        return;
      }

      try {
        final fetchedMajors = await fetchMajors();
        final fetchedCampuses = await fetchCampuses();

        if (mounted) {
          setState(() {
            majors = fetchedMajors;
            campuses = fetchedCampuses;

            if (majors.isNotEmpty) {
              selectedMajorId =
                  majors[0]['majorid'] ?? majors[0]['id']?.toString();
            }

            if (campuses.isNotEmpty) {
              selectedCampusId =
                  campuses[0]['campusid'] ?? campuses[0]['id']?.toString();
            }

            isLoadingData = false;
          });
        }
      } catch (e) {
        if (mounted) {
          setState(() {
            errorMessage = "Failed to load data: ${e.toString()}";
            isLoadingData = false;
          });
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Failed to load data: ${e.toString()}')),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          errorMessage = "Failed to load data: ${e.toString()}";
          isLoadingData = false;
        });
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to load data: ${e.toString()}')),
        );
      }
    }
  }

  void navigateToOptionalInfo() {
    if (!formKey.currentState!.validate()) {
      return;
    }

    if (selectedMajorId == null || selectedCampusId == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select a major and campus')),
      );
      return;
    }

    context.push(
      '/optional-profile-info',
      extra: {
        'email': widget.email,
        'majorId': selectedMajorId,
        'campusId': selectedCampusId,
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    if (isLoadingData) {
      return Scaffold(
        appBar: AppBar(title: const Text('Complete Profile')),
        body: const Center(child: CircularProgressIndicator()),
      );
    }

    if (errorMessage != null) {
      return Scaffold(
        appBar: AppBar(title: const Text('Complete Profile')),
        body: Center(
          child: Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  errorMessage!,
                  style: const TextStyle(color: Colors.red),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 16),
                ElevatedButton(
                  onPressed: () => context.go('/login'),
                  child: const Text('Return to Login'),
                ),
              ],
            ),
          ),
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(title: const Text('Complete Profile')),
      body: SafeArea(
        child: Form(
          key: formKey,
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const Icon(
                  Icons.school,
                  size: 64,
                  color: AppColors.primaryColor,
                ),
                const SizedBox(height: 24),
                const Text(
                  'Complete Your Profile',
                  style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 8),
                Text(
                  'Welcome to SimplerUni, ${widget.email}!',
                  style: const TextStyle(
                    fontSize: 16,
                    color: AppColors.textSecondary,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 32),

                if (errorMessage != null)
                  Padding(
                    padding: const EdgeInsets.only(bottom: 16.0),
                    child: Text(
                      errorMessage!,
                      style: const TextStyle(color: Colors.red),
                      textAlign: TextAlign.center,
                    ),
                  ),

                const Text(
                  'Major*',
                  style: TextStyle(fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 8),
                CustomDropdown<String>(
                  value: selectedMajorId,
                  hint: 'Select your major',
                  prefixIcon: Icons.school,
                  items:
                      majors.map((major) {
                        String id =
                            (major['majorid'] ?? major['id'])?.toString() ?? '';
                        return DropdownMenuItem<String>(
                          value: id,
                          child: Text(
                            major['majorname'] ?? major['name'] ?? '',
                          ),
                        );
                      }).toList(),
                  onChanged: (value) {
                    setState(() {
                      selectedMajorId = value;
                    });
                  },
                  validator: (value) {
                    if (value == null) {
                      return 'Please select your major';
                    }
                    return null;
                  },
                ),

                const SizedBox(height: 24),

                const Text(
                  'Campus*',
                  style: TextStyle(fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 8),
                CustomDropdown<String>(
                  value: selectedCampusId,
                  hint: 'Select your campus',
                  prefixIcon: Icons.location_on,
                  items:
                      campuses.map((campus) {
                        String id =
                            (campus['campusid'] ?? campus['id'])?.toString() ??
                            '';
                        return DropdownMenuItem<String>(
                          value: id,
                          child: Text(
                            campus['campusname'] ?? campus['name'] ?? '',
                          ),
                        );
                      }).toList(),
                  onChanged: (value) {
                    setState(() {
                      selectedCampusId = value;
                    });
                  },
                  validator: (value) {
                    if (value == null) {
                      return 'Please select your campus';
                    }
                    return null;
                  },
                ),

                const SizedBox(height: 40),

                AuthButton(
                  text: 'NEXT',
                  isLoading: isLoading,
                  onPressed: navigateToOptionalInfo,
                ),

                const SizedBox(height: 16),

                const Text(
                  'You\'ll be able to add optional information in the next step',
                  style: TextStyle(
                    color: AppColors.textSecondary,
                    fontSize: 14,
                  ),
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
