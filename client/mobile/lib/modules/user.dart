class User {
  String? userId;
  String? username;
  String? email;
  String? password;
  bool? isEmailVerified;
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
    this.isStudent = false,
    this.bio,
    this.profilePicture,
    this.startingUniYear,
    this.createdAt,
  });

  @override
  String toString() {
    return 'User(userId: $userId, username: $username, email: $email, isEmailVerified: $isEmailVerified, isStudent: $isStudent)';
  }

}
