import 'package:flutter/material.dart';
import 'package:senior_project/modules/answer.dart';
import 'package:senior_project/theme/app_theme.dart';
import 'package:senior_project/utils/time_utils.dart';

class AnswerItem extends StatefulWidget {
  final Answer answer;

  const AnswerItem({Key? key, required this.answer}) : super(key: key);

  @override
  State<AnswerItem> createState() => _AnswerItemState();
}

class _AnswerItemState extends State<AnswerItem> {
  bool isExpanded = false;
  static const int maxCharactersShown = 150;
  static const int maxLines = 3; 

  bool get isLongAnswer {
    if (widget.answer.content.length > maxCharactersShown) return true;

    final lineBreaks = '\n'.allMatches(widget.answer.content).length;
    return lineBreaks >= maxLines;
  }

  String get truncatedText {
    final lines = widget.answer.content.split('\n');
    if (lines.length > maxLines) {
      return lines.take(maxLines).join('\n') + '...';
    }

    return widget.answer.content.length > maxCharactersShown
        ? '${widget.answer.content.substring(0, maxCharactersShown)}...'
        : widget.answer.content;
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                CircleAvatar(
                  backgroundColor:
                      widget.answer.isStudent
                          ? AppColors.primaryColor
                          : Colors.orange,
                  backgroundImage:
                      widget.answer.profilePicture != null
                          ? NetworkImage(widget.answer.profilePicture!)
                          : null,
                  child:
                      widget.answer.profilePicture == null
                          ? Text(
                            widget.answer.username.isNotEmpty
                                ? widget.answer.username[0].toUpperCase()
                                : '?',
                            style: const TextStyle(color: Colors.white),
                          )
                          : null,
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Text(
                            widget.answer.username,
                            style: const TextStyle(fontWeight: FontWeight.bold),
                          ),
                          if (!widget.answer.isStudent)
                            Container(
                              margin: const EdgeInsets.only(left: 8),
                              padding: const EdgeInsets.symmetric(
                                horizontal: 6,
                                vertical: 2,
                              ),
                              decoration: BoxDecoration(
                                color: Colors.orange,
                                borderRadius: BorderRadius.circular(10),
                              ),
                              child: const Text(
                                'Instructor',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 10,
                                ),
                              ),
                            ),
                        ],
                      ),
                      Text(
                        TimeAgoUtil.format(widget.answer.createdAt),
                        style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),

            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(isExpanded ? widget.answer.content : truncatedText),

                if (isLongAnswer)
                  Padding(
                    padding: const EdgeInsets.only(top: 8.0),
                    child: GestureDetector(
                      onTap: () {
                        setState(() {
                          isExpanded = !isExpanded;
                        });
                      },
                      child: Text(
                        isExpanded ? 'Show less' : 'Show more',
                        style: TextStyle(
                          color: AppColors.primaryColor,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
