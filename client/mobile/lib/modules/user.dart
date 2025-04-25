class User {
  String? userId;
  String? username;
  String? email;
  bool? isEmailVerified;
  bool? isStudent;
  String? bio;
  String? profilePicture;
  String? startingUniYear;
  DateTime? createdAt;
  String? universityId;
  String? campusId;
  String? majorId;

  User({
    this.userId,
    this.username,
    this.email,
    this.isEmailVerified,
    this.isStudent,
    this.bio,
    this.profilePicture,
    this.startingUniYear,
    this.createdAt,
    this.universityId,
    this.campusId,
    this.majorId,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      userId: json['userId']?.toString() ?? json['userid']?.toString(),
      username: json['username'],
      email: json['email'],
      isEmailVerified: json['isEmailVerified'] ?? json['isemailverified'],
      isStudent: json['isStudent'] ?? json['isstudent'],
      bio: json['bio'],
      profilePicture: json['profilePicture'] ?? json['profilepicture'],
      startingUniYear: json['startingUniYear'] ?? json['startinguniyear'],
      createdAt:
          json['created_at'] != null
              ? DateTime.parse(json['created_at'])
              : null,
      universityId: json['universityid']?.toString(),
      campusId: json['campusid']?.toString(),
      majorId: json['majorid']?.toString(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'userId': userId,
      'username': username,
      'email': email,
      'isEmailVerified': isEmailVerified,
      'isStudent': isStudent,
      'bio': bio,
      'profilePicture': profilePicture,
      'startingUniYear': startingUniYear,
      'created_at': createdAt?.toIso8601String(),
      'universityId': universityId,
      'campusId': campusId,
      'majorId': majorId,
    };
  }

  @override
  String toString() {
    return 'User(userId: $userId, username: $username, email: $email, isEmailVerified: $isEmailVerified, universityId: $universityId)';
  }
}
