import 'package:flutter/material.dart';
import 'package:senior_project/theme/app_theme.dart';

class NewQuestionDialog extends StatefulWidget {
  final Function(String, String, List<String>) onSubmit;

  const NewQuestionDialog({Key? key, required this.onSubmit}) : super(key: key);

  @override
  State<NewQuestionDialog> createState() => _NewQuestionDialogState();
}

class _NewQuestionDialogState extends State<NewQuestionDialog> {
  final titleController = TextEditingController();
  final bodyController = TextEditingController();
  final tagsController = TextEditingController();

  String titleError = '';
  String bodyError = '';
  String tagsError = '';

  static const int maxTitleLength = 100;
  static const int maxBodyLength = 500;

  int effectiveBodyLength = 0;

  @override
  void initState() {
    super.initState();
    updateEffectiveLength();
    bodyController.addListener(updateEffectiveLength);
  }

  void updateEffectiveLength() {
    final text = bodyController.text;
    final newlineCount = '\n'.allMatches(text).length;
    final regularCharacters = text.length - newlineCount;

    effectiveBodyLength = regularCharacters + (newlineCount * 3);

    setState(() {
      if (effectiveBodyLength > maxBodyLength) {
        bodyError = 'Question is too long. Please make it shorter.';
      } else if (bodyError == 'Question is too long. Please make it shorter.') {
        bodyError = '';
      }
    });
  }

  @override
  void dispose() {
    titleController.dispose();
    bodyController.dispose();
    tagsController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('Ask a Question'),
      content: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 400),
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              TextField(
                controller: titleController,
                decoration: InputDecoration(
                  labelText: 'Question Title',
                  hintText: 'What\'s your question?',
                  errorText: titleError.isNotEmpty ? titleError : null,
                  border: const OutlineInputBorder(),
                  focusedBorder: OutlineInputBorder(
                    borderSide: BorderSide(
                      color: AppColors.primaryColor,
                      width: 2,
                    ),
                  ),
                  labelStyle: TextStyle(color: AppColors.primaryColor),
                ),
                maxLength: maxTitleLength,
                onChanged: (value) {
                  if (titleError.isNotEmpty) {
                    setState(() => titleError = '');
                  }
                },
              ),
              const SizedBox(height: 16),
              TextField(
                controller: bodyController,
                decoration: InputDecoration(
                  labelText: 'Question Details',
                  hintText: 'Add details to your question',
                  errorText: bodyError.isNotEmpty ? bodyError : null,
                  border: const OutlineInputBorder(),
                  focusedBorder: OutlineInputBorder(
                    borderSide: BorderSide(
                      color: AppColors.primaryColor,
                      width: 2,
                    ),
                  ),
                  labelStyle: TextStyle(color: AppColors.primaryColor),
                  alignLabelWithHint: true,
                  counterText: '$effectiveBodyLength/$maxBodyLength',
                ),
                maxLines: 5,
                textAlign: TextAlign.left,
                textAlignVertical: TextAlignVertical.top,
                onChanged: (value) {
                  if (bodyError.isNotEmpty &&
                      bodyError !=
                          'Question is too long. Please make it shorter.') {
                    setState(() => bodyError = '');
                  }
                },
              ),
              const SizedBox(height: 16),
              TextField(
                controller: tagsController,
                decoration: InputDecoration(
                  labelText: 'Tags (comma separated)',
                  hintText: 'e.g., cs101, programming, exams',
                  errorText: tagsError.isNotEmpty ? tagsError : null,
                  border: const OutlineInputBorder(),
                  focusedBorder: OutlineInputBorder(
                    borderSide: BorderSide(
                      color: AppColors.primaryColor,
                      width: 2,
                    ),
                  ),
                  labelStyle: TextStyle(color: AppColors.primaryColor),
                ),
                onChanged: (value) {
                  if (tagsError.isNotEmpty) {
                    setState(() => tagsError = '');
                  }
                },
              ),
            ],
          ),
        ),
      ),
      actions: [
        TextButton(
          onPressed: () {
            Navigator.of(context).pop();
          },
          child: const Text('Cancel'),
        ),
        ElevatedButton(
          onPressed: () async {
            bool isValid = true;

            if (titleController.text.isEmpty) {
              setState(() => titleError = 'Please enter a title');
              isValid = false;
            }

            if (bodyController.text.isEmpty) {
              setState(() => bodyError = 'Please enter question details');
              isValid = false;
            } else if (effectiveBodyLength > maxBodyLength) {
              setState(
                () =>
                    bodyError = 'Question is too long. Please make it shorter.',
              );
              isValid = false;
            }

            if (tagsController.text.isEmpty) {
              setState(() => tagsError = 'Please enter at least one tag');
              isValid = false;
            }

            if (!isValid) return;

            Navigator.of(context).pop();
            widget.onSubmit(
              titleController.text,
              bodyController.text,
              tagsController.text
                  .split(',')
                  .map((tag) => tag.trim())
                  .where((tag) => tag.isNotEmpty)
                  .toList(),
            );
          },
          style: ElevatedButton.styleFrom(
            backgroundColor: AppColors.primaryColor,
          ),
          child: const Text('Post'),
        ),
      ],
    );
  }
}
