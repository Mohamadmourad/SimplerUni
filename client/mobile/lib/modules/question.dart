import 'dart:convert';

class Question {
  String questionId;
  String title;
  String content;
  List<String> tags;
  String userId;
  String universityId;
  String username;
  String? profilePicture;
  int upvoteCount;
  int answerCount;
  bool hasUpvoted;
  DateTime createdAt;

  Question({
    required this.questionId,
    required this.title,
    required this.content,
    required this.tags,
    required this.userId,
    required this.universityId,
    required this.username,
    this.profilePicture,
    required this.upvoteCount,
    required this.answerCount,
    required this.hasUpvoted,
    required this.createdAt,
  });

  factory Question.fromJson(Map<String, dynamic> json) {
    List<String> parseTags(dynamic tagsData) {
      if (tagsData == null) return [];

      if (tagsData is List) {
        return tagsData.map((tag) => tag.toString()).toList();
      }

      if (tagsData is String) {
        String cleanTagString = tagsData
            .replaceAll('{', '')
            .replaceAll('}', '')
            .replaceAll('"', '');

        if (tagsData.startsWith('[') && tagsData.endsWith(']')) {
          try {
            List<dynamic> parsed = jsonDecode(tagsData);
            return parsed
                .map((tag) => tag.toString().replaceAll('"', ''))
                .toList();
          } catch (_) {
          }
        }

        return cleanTagString
            .split(',')
            .map((tag) => tag.trim())
            .where((tag) => tag.isNotEmpty)
            .toList();
      }

      return [];
    }

    return Question(
      questionId: json['questionid'] ?? json['questionId'] ?? '',
      title: json['title'] ?? '',
      content: json['content'] ?? '',
      tags: parseTags(json['tags']),
      userId: json['userid'] ?? json['userId'] ?? '',
      universityId: json['universityid'] ?? json['universityId'] ?? '',
      username: json['username'] ?? 'Unknown',
      profilePicture: json['profilepicture'] ?? json['profilePicture'],
      upvoteCount: int.tryParse(json['upvotecount']?.toString() ?? '0') ?? 0,
      answerCount: int.tryParse(json['answercount']?.toString() ?? '0') ?? 0,
      hasUpvoted: json['hasupvoted'] == true,
      createdAt:
          json['created_at'] != null
              ? DateTime.parse(json['created_at'])
              : DateTime.now(),
    );
  }
}
