import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:connectivity_plus/connectivity_plus.dart';

const Duration apiTimeout = Duration(seconds: 15);

Future<Map<String, dynamic>> makeApiCall(
  String type,
  String? requestBody,
  String? urlParam,
  String? authToken,
) async {
  final connectivityResult = await Connectivity().checkConnectivity();
  if (connectivityResult == ConnectivityResult.none) {
    return {
      'statusCode': 503,
      'body': null,
      'error':
          'No internet connection. Please check your internet connection and try again.',
    };
  }

  const String baseUrl = 'http://localhost:5000';
  Uri url = Uri.parse('$baseUrl/$urlParam');

  Map<String, String> headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  if (authToken != null) {
    headers['Authorization'] = authToken;
  }

  try {
    http.Response response;

    switch (type.toUpperCase()) {
      case 'POST':
        response = await http
            .post(
              url,
              headers: headers,
              body:
                  requestBody != null
                      ? jsonEncode(json.decode(requestBody))
                      : null,
            )
            .timeout(apiTimeout);
        break;
      case 'UPDATE':
        response = await http
            .put(
              url,
              headers: headers,
              body:
                  requestBody != null
                      ? jsonEncode(json.decode(requestBody))
                      : null,
            )
            .timeout(apiTimeout);
        break;
      case 'DELETE':
        response = await http.delete(url, headers: headers).timeout(apiTimeout);
        break;
      case 'GET':
      default:
        response = await http.get(url, headers: headers).timeout(apiTimeout);
        break;
    }

    if (response.statusCode == 200) {
      return {
        'statusCode': response.statusCode,
        'body': jsonDecode(response.body),
        'error': null,
      };
    } else if (response.statusCode == 201) {
      try {
        final decoded = jsonDecode(response.body);
        return {
          'statusCode': response.statusCode,
          'body': decoded,
          'error': null,
        };
      } catch (e) {
        return {
          'statusCode': response.statusCode,
          'body': response.body,
          'error': null,
        };
      }
    } else {
      return {
        'statusCode': response.statusCode,
        'body': response.body.isNotEmpty ? response.body : null,
        'error': response.body,
      };
    }
  } on SocketException {
    return {
      'statusCode': 503,
      'body': null,
      'error':
          'Server not reachable. Please check your internet connection and try again.',
    };
  } on TimeoutException {
    return {
      'statusCode': 504,
      'body': null,
      'error': 'Request timed out. Please try again later.',
    };
  } catch (e) {
    return {'statusCode': 500, 'body': null, 'error': 'Request failed: $e'};
  }
}
