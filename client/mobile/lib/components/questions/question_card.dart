import 'package:flutter/material.dart';
import 'package:senior_project/modules/question.dart';
import 'package:senior_project/theme/app_theme.dart';
import 'package:senior_project/utils/time_utils.dart';
import 'package:go_router/go_router.dart';

class QuestionCard extends StatelessWidget {
  final Question question;
  final Function(Question) onUpvote;
  final Function(Question) onViewDetails;
  final bool isUpvoting;

  const QuestionCard({
    Key? key,
    required this.question,
    required this.onUpvote,
    required this.onViewDetails,
    this.isUpvoting = false,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => onViewDetails(question),
      child: Card(
        margin: const EdgeInsets.all(16),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              GestureDetector(
                onTap: () {
                  if (question.userId != null) {
                    context.push('/profile/${question.userId}');
                  }
                },
                child: Row(
                  children: [
                    CircleAvatar(
                      backgroundColor: AppColors.primaryColor,
                      backgroundImage:
                          question.profilePicture != null
                              ? NetworkImage(question.profilePicture!)
                              : null,
                      child:
                          question.profilePicture == null
                              ? Text(
                                question.username.isNotEmpty
                                    ? question.username[0].toUpperCase()
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
                          Text(
                            question.username,
                            style: const TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 16,
                            ),
                          ),
                          Text(
                            TimeAgoUtil.format(question.createdAt),
                            style: TextStyle(
                              fontSize: 12,
                              color: Colors.grey[600],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              Text(
                question.title,
                style: const TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 12),
              Text(question.content, style: const TextStyle(fontSize: 16)),
              const SizedBox(height: 16),
              if (question.tags.isNotEmpty)
                SizedBox(
                  height: 32,
                  child: ListView(
                    scrollDirection: Axis.horizontal,
                    children:
                        question.tags
                            .map(
                              (tag) => Container(
                                margin: const EdgeInsets.only(right: 8),
                                child: Chip(
                                  label: Text(
                                    tag,
                                    style: const TextStyle(fontSize: 10),
                                  ),
                                  padding: const EdgeInsets.all(4),
                                  labelPadding: const EdgeInsets.symmetric(
                                    horizontal: 4,
                                  ),
                                  backgroundColor: AppColors.cardColor,
                                  materialTapTargetSize:
                                      MaterialTapTargetSize.shrinkWrap,
                                ),
                              ),
                            )
                            .toList(),
                  ),
                ),
              const SizedBox(height: 12),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 6,
                    ),
                    decoration: BoxDecoration(
                      color: AppColors.cardColor,
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(Icons.question_answer, size: 16),
                        const SizedBox(width: 4),
                        Text(
                          '${question.answerCount} answers',
                          style: const TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Row(
                    children: [
                      Text(
                        '${question.upvoteCount}',
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 14,
                        ),
                      ),
                      isUpvoting
                          ? const SizedBox(
                            width: 20,
                            height: 20,
                            child: CircularProgressIndicator(
                              strokeWidth: 2,
                              valueColor: AlwaysStoppedAnimation<Color>(
                                Colors.purple,
                              ),
                            ),
                          )
                          : IconButton(
                            icon: Icon(
                              question.hasUpvoted
                                  ? Icons.arrow_upward
                                  : Icons.arrow_upward_outlined,
                              color:
                                  question.hasUpvoted
                                      ? Colors.purple
                                      : Colors.grey,
                            ),
                            onPressed: () => onUpvote(question),
                          ),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
