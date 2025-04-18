import 'package:flutter/material.dart';
import 'package:senior_project/components/news/news_card.dart';
import 'package:senior_project/modules/news.dart';
import 'package:senior_project/screens/news/news_detail_page.dart';

class NewsList extends StatelessWidget {
  final List<News> newsList;
  final Future<void> Function() onRefresh;

  const NewsList({Key? key, required this.newsList, required this.onRefresh})
    : super(key: key);

  @override
  Widget build(BuildContext context) {
    return RefreshIndicator(
      onRefresh: onRefresh,
      child: ListView.builder(
        padding: const EdgeInsets.only(top: 16, bottom: 24),
        itemCount: newsList.length,
        itemBuilder: (context, index) {
          return NewsCard(
            news: newsList[index],
            onTap: () => _navigateToNewsDetail(context, newsList[index]),
          );
        },
      ),
    );
  }

  void _navigateToNewsDetail(BuildContext context, News news) {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => NewsDetailPage(news: news)),
    );
  }
}
