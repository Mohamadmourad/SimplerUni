class Answer {
  String answerId;
  String questionId;
  String userId;
  String content;
  String username;
  String? profilePicture;
  bool isStudent;
  DateTime createdAt;

  Answer({
    required this.answerId,
    required this.questionId,
    required this.userId,
    required this.content,
    required this.username,
    this.profilePicture,
    required this.isStudent,
    required this.createdAt,
  });

  factory Answer.fromJson(Map<String, dynamic> json) {
    return Answer(
      answerId: json['answerid'] ?? json['answerId'] ?? '',
      questionId: json['questionid'] ?? json['questionId'] ?? '',
      userId: json['userid'] ?? json['userId'] ?? '',
      content: json['content'] ?? '',
      username: json['username'] ?? 'Unknown',
      profilePicture: json['profilepicture'] ?? json['profilePicture'],
      isStudent: json['isstudent'] == true || json['isStudent'] == true,
      createdAt:
          json['created_at'] != null
              ? DateTime.parse(json['created_at'])
              : DateTime.now(),
    );
  }
}
