import 'package:flutter/material.dart';
import 'package:senior_project/components/questions/question_card.dart';
import 'package:senior_project/modules/question.dart';

class QuestionsList extends StatelessWidget {
  final List<Question> questions;
  final Function(Question) onUpvote;
  final Function(Question) onViewDetails;
  final Future<void> Function() onRefresh;
  final Map<String, bool> upvotingQuestions;

  const QuestionsList({
    Key? key,
    required this.questions,
    required this.onUpvote,
    required this.onViewDetails,
    required this.onRefresh,
    required this.upvotingQuestions,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return RefreshIndicator(
      onRefresh: onRefresh,
      child: ListView.builder(
        itemCount: questions.length,
        itemBuilder: (context, index) {
          final question = questions[index];
          final isUpvoting = upvotingQuestions[question.questionId] ?? false;

          return QuestionCard(
            question: question,
            onUpvote: onUpvote,
            onViewDetails: onViewDetails,
            isUpvoting: isUpvoting,
          );
        },
      ),
    );
  }
}
