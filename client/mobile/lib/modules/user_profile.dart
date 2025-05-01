class UserProfile {
  String? userId;
  String? username;
  String? email;
  bool? isStudent;
  String? bio;
  String? profilePicture;
  DateTime? createdAt;
  String? campusName;
  String? majorName;
  String? universityName;

  UserProfile({
    this.userId,
    this.username,
    this.email,
    this.isStudent,
    this.bio,
    this.profilePicture,
    this.createdAt,
    this.campusName,
    this.majorName,
    this.universityName,
  });

  factory UserProfile.fromJson(Map<String, dynamic> json) {
    return UserProfile(
      userId: json['userId']?.toString() ?? json['userid']?.toString(),
      username: json['username'],
      email: json['email'],
      isStudent: json['isStudent'] ?? json['isstudent'],
      bio: json['bio'],
      profilePicture: json['profilePicture'] ?? json['profilepicture'],
      createdAt:
          json['created_at'] != null
              ? DateTime.parse(json['created_at'])
              : null,
      campusName: json['campusName'] ?? json['campusname'],
      majorName: json['majorName'] ?? json['majorname'],
      universityName: json['universityName'] ?? json['universityname'],
    );
  }
}
