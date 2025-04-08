class User {
  String? userId;
  String? username;
  String? email;
  String? password;
  bool? isEmailVerified;
  int? emailOtp;
  String? emailOtpExpire;
  String? passwordResetToken;
  bool? isStudent;
  String? bio;
  String? profilePicture;
  String? startingUniYear;
  DateTime? createdAt;

  User({
    this.userId,
    this.username,
    this.email,
    this.password,
    this.isEmailVerified = false,
    this.emailOtp,
    this.emailOtpExpire,
    this.passwordResetToken,
    this.isStudent = false,
    this.bio,
    this.profilePicture,
    this.startingUniYear,
    this.createdAt,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      userId: json['userId'],
      username: json['username'],
      email: json['email'],
      isEmailVerified: json['isEmailVerified'] ?? false,
      isStudent: json['isStudent'] ?? false,
      bio: json['bio'],
      profilePicture: json['profilePicture'],
      startingUniYear: json['startingUniYear'],
      createdAt:
          json['createdAt'] != null ? DateTime.parse(json['createdAt']) : null,
    );
  }

  @override
  String toString() {
    return 'User(userId: $userId, username: $username, email: $email, isEmailVerified: $isEmailVerified, isStudent: $isStudent)';
  }
}
