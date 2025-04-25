import 'package:flutter/material.dart';
import 'package:senior_project/functions/questions/question_api.dart';
import 'package:senior_project/modules/question.dart';
import 'package:senior_project/theme/app_theme.dart';

class UpvoteButton extends StatelessWidget {
  final Question question;
  final VoidCallback onUpvoteChanged;

  const UpvoteButton({
    Key? key,
    required this.question,
    required this.onUpvoteChanged,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        IconButton(
          icon: Icon(
            Icons.arrow_upward,
            color: question.hasUpvoted ? AppColors.primaryColor : null,
          ),
          onPressed: handleUpvote,
        ),
        Text('${question.upvoteCount}'),
      ],
    );
  }

  void handleUpvote() async {
    try {
      if (question.hasUpvoted) {
        await removeUpvoteFromQuestion(question.questionId);
        question.upvoteCount--;
        question.hasUpvoted = false;
      } else {
        await upvoteQuestion(question.questionId);
        question.upvoteCount++;
        question.hasUpvoted = true;
      }
      onUpvoteChanged();
    } catch (e) {
      print('Failed to process upvote: ${e.toString()}');
    }
  }
}
