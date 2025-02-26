import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    final GoRouter router = GoRouter(
      initialLocation: '/',
      routes: [
        GoRoute(
          path: '/',
          builder: (context, state) => const HomeScreen(),
        ),
        // GoRoute(
        //   path: '/second',
        //   builder: (context, state) => const SecondScreen(),
        // ),
      ],
    );

    return MaterialApp.router(
      routerConfig: router,
    );
  }
}

