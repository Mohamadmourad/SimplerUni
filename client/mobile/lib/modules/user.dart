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

  String? get getUserId => userId;
  String? get getUsername => username;
  String? get getEmail => email;
  String? get getPassword => password;
  bool? get getIsEmailVerified => isEmailVerified;
  int? get getEmailOtp => emailOtp;
  String? get getEmailOtpExpire => emailOtpExpire;
  String? get getPasswordResetToken => passwordResetToken;
  bool? get getIsStudent => isStudent;
  String? get getBio => bio;
  String? get getProfilePicture => profilePicture;
  String? get getStartingUniYear => startingUniYear;
  DateTime? get getCreatedAt => createdAt;

  set setUserId(String? value) => userId = value;
  set setUsername(String? value) => username = value;
  set setEmail(String? value) => email = value;
  set setPassword(String? value) => password = value;
  set setIsEmailVerified(bool? value) => isEmailVerified = value;
  set setEmailOtp(int? value) => emailOtp = value;
  set setEmailOtpExpire(String? value) => emailOtpExpire = value;
  set setPasswordResetToken(String? value) => passwordResetToken = value;
  set setIsStudent(bool? value) => isStudent = value;
  set setBio(String? value) => bio = value;
  set setProfilePicture(String? value) => profilePicture = value;
  set setStartingUniYear(String? value) => startingUniYear = value;
  set setCreatedAt(DateTime? value) => createdAt = value;

  @override
  String toString() {
    return 'User(userId: $userId, username: $username, email: $email, isEmailVerified: $isEmailVerified, isStudent: $isStudent)';
  }

  bool isVerified() {
    return isEmailVerified == true;
  }

  bool isUserStudent() {
    return isStudent == true;
  }
}
