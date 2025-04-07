import 'package:shared_preferences/shared_preferences.dart';
import 'package:senior_project/functions/callApi.dart';

Future<bool> verify_otp(String enteredOtp) async {
  final SharedPreferences prefs = await SharedPreferences.getInstance();
  final token = prefs.getString('authToken');
  
  if (token == null) {
    print('No auth token found.');
    return false;
  }
  
  final requestBody = '{"authToken": "$token", "enteredOtp": "$enteredOtp"}';
  
  final response = await makeApiCall(
    'POST',
    requestBody,
    'user/verifyotp',
    token,
  );

  if (response['statusCode'] == 200) {
    print('OTP verified successfully.');
    return true;
  } else {
    print('Error: ${response['statusCode']}, ${response['error']}');
    return false;
  }
}