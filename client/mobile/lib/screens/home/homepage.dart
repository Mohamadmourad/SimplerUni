import 'package:flutter/material.dart';
import 'package:google_nav_bar/google_nav_bar.dart';
import '../../theme/app_theme.dart';
import '../chats/chats_page.dart';
import '../clubs/clubs_page.dart';
import '../news/news_page.dart';
import '../profile/profile_page.dart';
import '../questions/questions_page.dart';

class Homepage extends StatefulWidget {
  const Homepage({super.key});

  @override
  State<Homepage> createState() => HomepageState();
}

class HomepageState extends State<Homepage> {
  int selectedIndex = 0;

  static final List<Widget> pages = [
    const ChatsPage(),
    const QuestionsPage(),
    const ClubsPage(),
    const NewsPage(),
    const ProfilePage(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: pages[selectedIndex],
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: AppColors.cardColor,
          boxShadow: [
            BoxShadow(blurRadius: 20, color: Colors.black.withOpacity(0.1)),
          ],
        ),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 15.0, vertical: 8),
            child: GNav(
              rippleColor: AppColors.primaryColor.withOpacity(0.2),
              hoverColor: AppColors.primaryColor.withOpacity(0.1),
              gap: 8,
              activeColor: Colors.white,
              iconSize: 24,
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
              duration: const Duration(milliseconds: 400),
              tabBackgroundColor: AppColors.primaryColor,
              color: AppColors.textSecondary,
              tabs: const [
                GButton(icon: Icons.chat_bubble_outline, text: 'Chats'),
                GButton(icon: Icons.question_answer_outlined, text: 'Q/A'),
                GButton(icon: Icons.groups_outlined, text: 'Clubs'),
                GButton(icon: Icons.newspaper_outlined, text: 'News'),
                GButton(icon: Icons.person_outline, text: 'Profile'),
              ],
              selectedIndex: selectedIndex,
              onTabChange: (index) {
                setState(() {
                  selectedIndex = index;
                });
              },
            ),
          ),
        ),
      ),
    );
  }
}
