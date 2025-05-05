import 'dart:convert';
import 'package:http/http.dart' as http;

Future<Map<String, dynamic>> makeApiCall(
  String type,
  String? requestBody,
  String? urlParam,
  String? authToken,
) async {
  const String baseUrl = 'https://api.simpleruni.com';
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
        response = await http.post(
          url,
          headers: headers,
          body:
              requestBody != null ? jsonEncode(json.decode(requestBody)) : null,
        );
        break;
      case 'UPDATE':
        response = await http.put(
          url,
          headers: headers,
          body:
              requestBody != null ? jsonEncode(json.decode(requestBody)) : null,
        );
        break;
      case 'DELETE':
        response = await http.delete(url, headers: headers);
        break;
      case 'GET':
      default:
        response = await http.get(url, headers: headers);
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
        // Try to parse as JSON first in case it's a JSON string
        final decoded = jsonDecode(response.body);
        return {
          'statusCode': response.statusCode,
          'body': decoded,
          'error': null,
        };
      } catch (e) {
        // If not JSON, return as plain text (likely just an auth token)
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
  } catch (e) {
    return {'statusCode': 500, 'body': null, 'error': 'Request failed: $e'};
  }
}
