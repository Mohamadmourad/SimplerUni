import 'package:intl/intl.dart';

class News {
  final String newsId;
  final String title;
  final String content;
  final String? imageUrl;
  final DateTime createdAt;
  final String universityId;

  News({
    required this.newsId,
    required this.title,
    required this.content,
    this.imageUrl,
    required this.createdAt,
    required this.universityId,
  });

  factory News.fromJson(Map<String, dynamic> json) {
    return News(
      newsId: json['newsid'],
      title: json['title'],
      content: json['content'],
      imageUrl: json['imageurl'],
      createdAt: DateTime.parse(json['created_at']),
      universityId: json['universityid'],
    );
  }

  String get formattedDate {
    final formatter = DateFormat('MMM dd, yyyy');
    return formatter.format(createdAt);
  }
}
