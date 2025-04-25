import 'package:flutter/material.dart';
import 'package:senior_project/components/common/error_state.dart';
import 'package:senior_project/components/news/empty_news_state.dart';
import 'package:senior_project/components/news/news_list.dart';
import 'package:senior_project/functions/news/news_api.dart';
import 'package:senior_project/modules/news.dart';

class NewsPage extends StatefulWidget {
  const NewsPage({Key? key}) : super(key: key);

  @override
  State<NewsPage> createState() => NewsPageState();
}

class NewsPageState extends State<NewsPage> {
  List<News> newsList = [];
  bool isLoading = true;
  String? errorMessage;

  @override
  void initState() {
    super.initState();
    loadNews();
  }

  Future<void> loadNews() async {
    setState(() {
      isLoading = true;
      errorMessage = null;
    });

    try {
      final fetchedNews = await getNews();
      setState(() {
        newsList = fetchedNews;
        isLoading = false;
      });
    } catch (e) {
      setState(() {
        errorMessage = e.toString();
        isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('University News'), elevation: 0),
      body:
          isLoading
              ? const Center(child: CircularProgressIndicator())
              : errorMessage != null
              ? ErrorState(
                errorMessage: errorMessage!,
                onRetry: loadNews,
                title: 'Error loading news',
              )
              : newsList.isEmpty
              ? EmptyNewsState(onRefresh: loadNews)
              : NewsList(newsList: newsList, onRefresh: loadNews),
    );
  }
}
