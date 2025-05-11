import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:senior_project/components/questions/empty_state.dart';
import 'package:senior_project/components/common/error_state.dart';
import 'package:senior_project/components/questions/filter_options.dart';
import 'package:senior_project/components/questions/new_question_dialog.dart';
import 'package:senior_project/components/questions/questions_list.dart';
import 'package:senior_project/functions/questions/question_api.dart';
import 'package:senior_project/modules/question.dart';
import 'package:senior_project/providers/user_provider.dart';
import 'package:senior_project/theme/app_theme.dart';
import 'package:senior_project/screens/questions/question_details_page.dart';

class QuestionsPage extends StatefulWidget {
  const QuestionsPage({Key? key}) : super(key: key);

  @override
  State<QuestionsPage> createState() => QuestionsPageState();
}

class QuestionsPageState extends State<QuestionsPage> {
  bool isLoading = false;
  String currentFilter = 'recent';
  List<Question> questions = [];
  String? errorMessage;
  Map<String, bool> upvotingQuestions = {};

  @override
  void initState() {
    super.initState();
    loadQuestions();
    loadUserInfo();
  }

  void loadUserInfo() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final userProvider = Provider.of<UserProvider>(context, listen: false);
      final user = userProvider.currentUser;

      if (user != null) {
        print('User in Questions Page: ${user.username}');
      } else {
        print('No user logged in - Questions Page');
      }
    });
  }

  Future<void> loadQuestions() async {
    setState(() {
      isLoading = true;
      errorMessage = null;
    });

    try {
      final questionsData = await getQuestions(currentFilter);

      setState(() {
        questions =
            questionsData
                .map<Question>(
                  (q) => Question.fromJson(q as Map<String, dynamic>),
                )
                .toList();
        isLoading = false;
      });
    } catch (e) {
      setState(() {
        errorMessage = e.toString();
        isLoading = false;
      });
    }
  }

  Future<void> refreshQuestions() async {
    await loadQuestions();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Questions'),
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            tooltip: 'Add Question',
            onPressed: () {
              showNewQuestionDialog(context);
            },
          ),
          IconButton(
            icon: const Icon(Icons.filter_list),
            tooltip: 'Filter Questions',
            onPressed: () {
              showModalBottomSheet(
                context: context,
                builder: (context) {
                  return FilterOptions(
                    onFilterSelected: (filter) {
                      setState(() {
                        currentFilter = filter;
                      });
                      loadQuestions();
                    },
                  );
                },
              );
            },
          ),
        ],
      ),
      body:
          isLoading
              ? const Center(child: CircularProgressIndicator())
              : errorMessage != null
              ? ErrorState(
                errorMessage: errorMessage!,
                onRetry: loadQuestions,
                title: 'Error loading questions',
              )
              : questions.isEmpty
              ? EmptyState(onAddQuestion: () => showNewQuestionDialog(context))
              : QuestionsList(
                questions: questions,
                onUpvote: handleUpvote,
                onViewDetails: viewQuestionDetails,
                onRefresh: refreshQuestions,
                upvotingQuestions: upvotingQuestions,
              ),
    );
  }

  void showFilterOptions(BuildContext context) {
    showModalBottomSheet(
      context: context,
      builder:
          (context) => FilterOptions(
            onFilterSelected: (filter) {
              setState(() {
                currentFilter = filter;
              });
              loadQuestions();
            },
          ),
    );
  }

  void showNewQuestionDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => NewQuestionDialog(onSubmit: submitQuestion),
    );
  }

  Future<void> submitQuestion(
    String title,
    String content,
    List<String> tags,
  ) async {
    setState(() {
      isLoading = true;
    });

    try {
      await addQuestion(title, content, tags);
      await loadQuestions();
    } catch (e) {
      setState(() {
        errorMessage = e.toString();
        isLoading = false;
      });
    }
  }

  Future<void> handleUpvote(Question question) async {
    setState(() {
      upvotingQuestions[question.questionId] = true;
    });

    try {
      if (question.hasUpvoted) {
        await removeUpvoteFromQuestion(question.questionId);
        setState(() {
          question.upvoteCount--;
          question.hasUpvoted = false;
        });
      } else {
        await upvoteQuestion(question.questionId);
        setState(() {
          question.upvoteCount++;
          question.hasUpvoted = true;
        });
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to process upvote: ${e.toString()}')),
      );
    } finally {
      setState(() {
        upvotingQuestions[question.questionId] = false;
      });
    }
  }

  void viewQuestionDetails(Question question) {
    Navigator.of(context)
        .push(
          MaterialPageRoute(
            builder: (context) => QuestionDetailsPage(question: question),
          ),
        )
        .then((_) {
          loadQuestions();
        });
  }
}
