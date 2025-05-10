import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:senior_project/components/common/error_state.dart';
import 'package:senior_project/components/questions/answer_input.dart';
import 'package:senior_project/components/questions/answer_item.dart';
import 'package:senior_project/components/questions/no_answers_state.dart';
import 'package:senior_project/components/questions/question_card.dart';
import 'package:senior_project/functions/questions/question_api.dart';
import 'package:senior_project/modules/answer.dart';
import 'package:senior_project/modules/question.dart';
import 'package:senior_project/providers/user_provider.dart';

class QuestionDetailsPage extends StatefulWidget {
  final Question question;

  const QuestionDetailsPage({Key? key, required this.question})
    : super(key: key);

  @override
  State<QuestionDetailsPage> createState() => QuestionDetailsPageState();
}

class QuestionDetailsPageState extends State<QuestionDetailsPage> {
  List<Answer> answers = [];
  bool isLoading = true;
  String? errorMessage;
  final TextEditingController answerController = TextEditingController();
  bool isSubmitting = false;
  // Add state to track upvoting status
  bool isUpvoting = false;

  @override
  void initState() {
    super.initState();
    loadAnswers();
  }

  @override
  void dispose() {
    answerController.dispose();
    super.dispose();
  }

  Future<void> loadAnswers() async {
    setState(() {
      isLoading = true;
      errorMessage = null;
    });

    try {
      final answersData = await getAnswersForQuestion(
        widget.question.questionId,
      );

      setState(() {
        answers =
            answersData
                .map<Answer?>((answer) {
                  try {
                    return Answer.fromJson(answer as Map<String, dynamic>);
                  } catch (e) {
                    print('Error parsing answer: $e');
                    return null;
                  }
                })
                .whereType<Answer>()
                .toList();
        isLoading = false;
      });
    } catch (e) {
      setState(() {
        errorMessage = "Could not load answers: ${e.toString()}";
        isLoading = false;
      });
    }
  }

  Future<void> submitAnswer() async {
    final content = answerController.text.trim();
    if (content.isEmpty) return;

    setState(() {
      isSubmitting = true;
    });

    try {
      await answerQuestion(widget.question.questionId, content);
      answerController.clear();
      await loadAnswers();
    } catch (e) {
      print('Failed to submit answer: ${e.toString()}');
    } finally {
      setState(() {
        isSubmitting = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final user = Provider.of<UserProvider>(context).currentUser;

    return Scaffold(
      appBar: AppBar(title: const Text('Question Details'), elevation: 0),
      body: Column(
        children: [
          Expanded(
            child: SingleChildScrollView(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  QuestionCard(
                    question: widget.question,
                    onUpvote: handleUpvote,
                    onViewDetails: (_) {},
                    // Pass the upvoting state to the QuestionCard
                    isUpvoting: isUpvoting,
                  ),

                  const Divider(height: 32, thickness: 1),

                  const Padding(
                    padding: EdgeInsets.symmetric(horizontal: 16),
                    child: Text(
                      'Answers',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),

                  const SizedBox(height: 8),

                  isLoading
                      ? const Center(child: CircularProgressIndicator())
                      : errorMessage != null
                      ? ErrorState(
                        errorMessage: errorMessage!,
                        onRetry: loadAnswers,
                        title: 'Error loading answers',
                      )
                      : answers.isEmpty
                      ? const NoAnswersState()
                      : buildAnswersList(),
                ],
              ),
            ),
          ),

          if (user != null)
            AnswerInput(
              controller: answerController,
              isSubmitting: isSubmitting,
              onSubmit: submitAnswer,
            ),
        ],
      ),
    );
  }

  void handleUpvote(Question question) async {
    // Set the upvoting state to true before starting
    setState(() {
      isUpvoting = true;
    });

    try {
      if (question.hasUpvoted) {
        await removeUpvoteFromQuestion(question.questionId);
        setState(() {
          widget.question.upvoteCount--;
          widget.question.hasUpvoted = false;
        });
      } else {
        await upvoteQuestion(question.questionId);
        setState(() {
          widget.question.upvoteCount++;
          widget.question.hasUpvoted = true;
        });
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to upvote: ${e.toString()}')),
      );
    } finally {
      // Reset the upvoting state when done
      setState(() {
        isUpvoting = false;
      });
    }
  }

  Widget buildAnswersList() {
    return ListView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: answers.length,
      itemBuilder: (context, index) {
        final answer = answers[index];
        return AnswerItem(answer: answer);
      },
    );
  }
}
