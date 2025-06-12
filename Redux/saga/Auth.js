import { call, put, takeLatest, fork } from 'redux-saga/effects';
import * as actions from '../action/auth';
// import * as actions from '../action/components'
import * as api from '../../API/auth';
import * as Keychain from 'react-native-keychain';
import { navigate } from '../../utils/rootNavigation';
// import EncryptedStorage from 'react-native-encrypted-storage';


function* MatchOtpSaga(payload) {
  try {
    yield put(actions.setloading(true));
    const response = yield call(api.matchotp, payload.email, payload.otp);

    if (response.status === 200) {
      if (!response.data || typeof response.data !== 'object') {
        yield put(
          actions.matchotpfail({
            error: [
              'Unexpected error occurred',
              'Response format is invalid or empty.',
            ],
          }),
        );
      } else if (response.data.errorText) {
        yield put(
          actions.matchotpfail({
            error: [
              response.data.errorText,
              response.data.errorDetail,
            ],
          }),
        );
      } else {
        yield put(
          actions.matchotpsuccessful(response.data, [
            'OTP matched successfully',
            'now signup',
          ]),
        );
      }
    } else {
      yield put(
        actions.matchotpfail({
          error: [
            `Unexpected response status: ${response.status}`,
            'please try again',
          ],
        }),
      );
    }
    yield put(actions.setloading(false));
  } catch (error) {
    yield put(actions.setloading(false));

    yield put(
      actions.matchotpfail({
        error: ['An error occurred', error.message || 'Unknown error'],
      }),
    );
  }
}

function* MatchUsernameSaga(payload) {
  try {
    yield put(actions.setloading(true));
    const response = yield call(api.matchusername, payload.username);

    if (response.status === 200) {
      if (!response.data || typeof response.data !== 'object') {
        yield put(
          actions.matchusernamefail({
            error: [
              'Unexpected error occurred',
              'Response format is invalid or empty.',
            ],
          }),
        );
      } else if (response.data.errorText) {
        yield put(
          actions.matchusernamefail({
            error: [
              response.data.errorText,
              response.data.errorDetail,
            ],
          }),
        );
      } else {
        yield put(
          actions.matchusernamesuccessful(response.data, [
            'username matched successfully',
            'now enter otp',
          ]),
        );
      }
    } else {
      yield put(
        actions.matchusernamefail({
          error: [
            `Unexpected response status: ${response.status}`,
            'please try again',
          ],
        }),
      );
    }
    yield put(actions.setloading(false));
  } catch (error) {
    yield put(actions.setloading(false));

    yield put(
      actions.matchusernamefail({
        error: ['An error occurred', error.message || 'Unknown error'],
      }),
    );
  }
}



function* VerifyEmailSaga(payload) {
  try { 
    yield put(actions.setloading(true));
    const response = yield call(api.verifyemail, payload.email);

    if (response.status === 200) {
      if (!response.data || typeof response.data !== 'object') {
        yield put(
          actions.verifyemailfail({
            error: [
              'Unexpected error occurred',
              'Response format is invalid or empty.',
            ],
          }),
        );
      } else if (response.data.errorText) {
        yield put(
          actions.verifyemailfail({
            error: [
              response.data.errorText,
              response.data.errorDetail,
            ],
          }),
        );
      } else {
        yield put(
          actions.verifyemailsuccessful(response.data, [
            'Email verified successfully',
            'now enter otp',
          ]),
        );
      }
    } else {
      yield put(
        actions.verifyemailfail({
          error: [
            `Unexpected response status: ${response.status}`,
            'please try again',
          ],
        }),
      );
    }
    yield put(actions.setloading(false));
  } catch (error) {
    yield put(actions.setloading(false));

    yield put(
      actions.verifyemailfail({
        error: ['An error occurred', error.message || 'Unknown error'],
      }),
    );
  }
}


function* SignUpSaga(payload) {
  try {
    yield put(actions.setloading(true));
    const response = yield call(api.signup, 
      payload.username, 
      payload.password,
      payload.email,
      payload.otp,
      // payload.phone,
      payload.avatar,
      payload.storelink,
      payload.whatsapp,
      payload.facebook,
      payload.instagram,
    );

    if (response.status === 200) {
      if (!response.data || typeof response.data !== 'object') {
        yield put(
          actions.signupfail({
            error: [
              'Unexpected error occurred',
              'Response format is invalid or empty.',
            ],
          }),
        );
      } else if (response.data.errorText) {
        yield put(
          actions.signupfail({
            error: [
              response.data.errorText,
              response.data.errorDetail,
             
            ],
          }),
        );
      } else {
        yield put(
          actions.signupsuccessful(response.data, [
            'signup Successful',
            'now login',
          ]),
        );
      }
    } else {
      yield put(
        actions.signupfail({
          error: [
            `Unexpected response status: ${response.status}`,
            'please try again',
          ],
        }),
      );
    }
    yield put(actions.setloading(false));
  } catch (error) {
    yield put(actions.setloading(false));

    yield put(
      actions.signupfail({
        error: ['An error occurred', error.message || 'Unknown error'],
      }),
    );
  }
}




function* AzureLoginSaga(payload) {
  try {
    yield put(actions.setloading(true));
    console.log('saga azure hits', payload.azurename)
    const response = yield call(api.azurelogin, payload.azurename);
    console.log('saga azure hits call', payload.azurename)
    if (response.status === 200) {
      if (!response.data || typeof response.data !== 'object') {
        yield put(
          actions.azureloginfail({
            error: [
              'Unexpected error occurred',
              'Response format is invalid or empty.',
            ],
          }),
        );
      } else if (response.data.result.errorText) {
        yield put(
          actions.azureloginfail({
            error: [
              response.data.result.errorText,
              response.data.result.errorDetail,
              // response.data.result.errorText.includes('Reset PIN')
              //   ? navigate('Change')
              //   : null,
            ],
          }),
        );
      } else {
        yield put(

          actions.azureloginsuccessful(response.data, [

            'Login Successful',
            'you get access',
          ]),
        );
      }
    } else {
      yield put(
        actions.azureloginfail({
          error: [
            `Unexpected response status: ${response.status}`,
            'please try again',
          ],
        }),
      );
    }
    yield put(actions.setloading(false));
  } catch (error) {
    yield put(actions.setloading(false));

    yield put(
      actions.azureloginfail({
        error: ['An error occurred', error.message || 'Unknown error'],
      }),
    );
  }
}









function* LoginSaga(payload) {
  try {
    console.log('LoginSaga started with payload:', payload);
    yield put(actions.setloading(true));
    const response = yield call(api.login, payload.username, payload.password,payload.email); //,payload.username

    console.log('Making API call with credentials...');
    if (response.status === 200) {
      console.log('Invalid response data format:', response.data);
      if (!response.data || typeof response.data !== 'object') {
        yield put(
          actions.loginfail({
            error: [
              'Unexpected error occurred',
              'Response format is invalid or empty.',
            ],
          }),
        );
      } else if (response.data.error) {
        console.log('Login failed with message:', response.data.error);
        yield put(
          actions.loginfail({
            error: [
              response.data.error,
              // response.data.result.errorDetail,
              // response.data.result.errorText.includes('Reset PIN')
              //   ? navigate('Change')
              //   : null,
            ],
          }),
        );
      } else {
        console.log('Login successful, data:', response.data);
        yield put(
          actions.loginsuccessful(response.data, [
            'Login Successful',
            'you get access',
          ]),
        );
      }
    } else {
      console.log('Unexpected status code:', response.status ,"error:",response.data.error);
      yield put(
        actions.loginfail({
          error: [
            `Unexpected response status: ${response.status}`,
            `${response.data.error} please try again,`
          ],
        }),
      );
    }
    yield put(actions.setloading(false));
  } catch (error) {
    console.log('LoginSaga error:', error);
    yield put(actions.setloading(false));

    yield put(
      actions.loginfail({
        error: ['An error occurred', error.message || 'Unknown error'],
      }),
    );
  }
}



function* ChangepasswordSaga(payload) {
  
  yield put(actions.setloading(true));
  try {
    const response = yield call(
      api.changepassword,
      payload.oldpassword,
      payload.newpassword,
    );

    console.log('Response data:', response.data);
    console.log('Response status:', response.status);

    if (response.status === 200) {
      if (!response.data || typeof response.data !== 'object') {
        yield put(
          actions.changepasswordfails({
            error: [
              'Unexpected error occurred',
              'Response format is invalid or empty.',
            ],
          }),
        );
      } else if (response.data.error) {
        console.log('error :', response.data.error);
        console.log('error without data:', response.data.error);
        yield put(
          actions.changepasswordfails({
            error: [
              response.data.error,
             
            ],
          }),
        );
      } else {
        console.log(`response` ,response.data)

        yield put(
          
          actions.changepasswordsuccessful(
            response.data,
            // ['Your pin is successfully changed', 'now login with new pin'],
            // navigate('Login'),
          ),
        );
      }
    } else {
      yield put(
        actions.changepasswordfails({
          error: [
            `Unexpected response status: ${response.status}`,
            `${response.data.error} please try again,`
          ],
        }),
      );
    }
    yield put(actions.setloading(false));
  } catch (error) {
    yield put(actions.setloading(false));

    yield put(
      actions.changepasswordfails({
        error: ['An error occurred', error.message || 'Unknown error'],
      }),
    );
  }
}


function* LogoutSaga() {
  yield put(actions.setloading(true));
  
  try {
    const response = yield call(api.logout);

    if (response.status === 200) {
     // Should be - CORRECT
yield call([Keychain, 'resetGenericPassword'], { service: 'accessToken' });
yield call([Keychain, 'resetGenericPassword'], { service: 'refreshToken' });
yield call([Keychain, 'resetGenericPassword'], { service: 'userId' });
      yield put(
        actions.logoutsuccessful([
          response.data.message,
          'You are logged out',
          // EncryptedStorage.clear('azure_token')
        ]),
      );

            // Clear store after successful logout
      yield put(actions.clearstore());
    } 
    else if(response.status === 401  &&  response.data.error ==="invalid token"){
      
      console.log('invalid token', response);
      yield put(
        actions.loginfail({
        error: "invalid token", 
              }),

   
            );
   
    }

    else if(response.status === 401  &&  response.data.error ==="jwt expired"){
      
      console.log('jwt expired', response);
      yield put(
        actions.loginfail({
        error: "jwt expired", 
              }),

   //refreshtoken 
            );
   
    }
    
    else {
      yield put(
        actions.logoutfails({
          error: `Unexpected response status: ${response.status}  ${response.data.error}`,
        }),
      );
    }
    yield put(actions.setloading(false));
  } catch (error) {
    yield put(actions.setloading(false));

    yield put(
      actions.logoutfails({
        error: ['An error occurred', error.message || 'Unknown error'],
      }),
    );
  }
}


function* ForgetpasswordSaga() {

  yield put(actions.setloading(true));
  try {
    const response = yield call(api.forgetpassword);

    if (response.status === 200) {
      console.log('Response data:', response.data);
      yield put(
        actions.forgetpasswordsuccessful([
          response.data,
          'Please check your email',
        ]),
      );
    } else {
      yield put(
        actions.forgetpasswordfails({
          error: `Unexpected response status: ${response.status}`,
        }),
      );
    }
    yield put(actions.setloading(false));
  } catch (error) {
    yield put(actions.setloading(false));

    yield put(
      actions.forgetpasswordfails({
        error: ['An error occurred', error.message || 'Unknown error'],
      }),
    );
  }


}

function* ResetpasswordSaga() {

  yield put(actions.setloading(true));
  try {
    const response = yield call(api.resetpassword, payload.email, payload.otp, payload.newpassword);

    if (response.status === 200) {
      console.log('Response data:', response.data);
      yield put(
        actions.resetpasswordsuccessful([
          response.data,
          'Please check your email',
        ]),
      );
    } else {
      yield put(
        console.log('Response status:', response.status, 'error',response.data.error),
        actions.resetpasswordfails({
          error: `Unexpected response status: ${response.status}`,
        }),
      );
    }
    yield put(actions.setloading(false));
  } catch (error) {
    yield put(actions.setloading(false));

    yield put(
      actions.resetpasswordfails({
        error: ['An error occurred', error.message || 'Unknown error'],
      }),
    );
  }

}

function* ResendOtpSaga() {
  yield put(actions.setloading(true));
  try {
    const response = yield call(api.resendotp, payload.email);

    if (response.status === 200) {
      console.log('Response data:', response.data);
      yield put(
        actions.resendotpsuccessful([
          response.data,
          'OTP sent successfully',
        ]),
      );
    } else {
      yield put(
        actions.resendotpfails({
          error: `Unexpected response status: ${response.status}`,
        }),
      );
    }
    yield put(actions.setloading(false));
  } catch (error) {
    yield put(actions.setloading(false));

    yield put(
      actions.resendotpfails({
        error: ['An error occurred', error.message || 'Unknown error'],
      }),
    );
  }
}


function* ChangeAvatarSaga() {
  yield put(actions.setloading(true));
  try {
    const response = yield call(api.changeavatar, payload.avatar);

    if (response.status === 200) {
      console.log('Response data:', response.data);
      yield put(
        actions.changeavatarsuccessful([
          response.data,
          'Avatar changed successfully',
        ]),
      );
    } else {
      console.log('Response status:', response.status);
      yield put(
        actions.changeavatarfails({
          error: `Unexpected response status: ${response.status} ${response.data.error}`,
        }),
      );
    }
    yield put(actions.setloading(false));
  } catch (error) {
    yield put(actions.setloading(false));

    yield put(
      actions.changeavatarfails({
        error: ['An error occurred', error.message || 'Unknown error'],
      }),
    );
  }
}

function* TokenCheckSaga() {
  try {
    yield put(actions.setloading(true));
    // Attempt to retrieve the access token from Keychain
    const credentials = yield call([Keychain, 'getGenericPassword'], { service: 'accessToken' });

    if (credentials && credentials.password) {
      // If token found, you might want to call an API to validate it and get user data
      // For now, we'll assume finding the token means authenticated, but fetching user data is better practice
      // const userResponse = yield call(api.getUserData, credentials.password); // You need to implement getUserData API

      // Assuming finding token means authenticated and maybe user data is stored elsewhere or not needed immediately in state
      // If user data is needed, you'd fetch it here and pass to the success action
      yield put(actions.tokenchecksuccessful(
        credentials.password ,
         
        // or userResponse.data if you fetch user data
        
      ));
    } else {
      // No token found, dispatch a failure or clear state
      yield put(actions.tokencheckfail()); // Create this action
    }
  } catch (error) {
    console.error('TokenCheckSaga error:', error);
    yield put(actions.tokencheckfail(error.message || 'Unknown error')); // Create this action
  } finally {
    yield put(actions.setloading(false));
  }
}

export function* watchAuthSaga() {
  yield takeLatest('AZURE_LOGIN_REQUEST', AzureLoginSaga);
  yield takeLatest('TOKEN_CHECK_REQUEST', TokenCheckSaga);
  yield takeLatest('LOGIN_REQUEST', LoginSaga);
  yield takeLatest('CHANGE_PASSWORD_REQUEST', ChangepasswordSaga);
  yield takeLatest('LOG_OUT_REQUEST', LogoutSaga);
  yield takeLatest('SIGNUP_REQUEST', SignUpSaga);
  yield takeLatest('MATCH_USERNAME_REQUEST', MatchUsernameSaga);
  yield takeLatest('MATCH_OTP_REQUEST', MatchOtpSaga);
  yield takeLatest('VERIFY_EMAIL_REQUEST', VerifyEmailSaga);
  yield takeLatest('FORGET_PASSWORD_REQUEST', ForgetpasswordSaga);
  yield takeLatest('RESET_PASSWORD_REQUEST', ResetpasswordSaga);
  yield takeLatest('RESEND_OTP_REQUEST', ResendOtpSaga);
  yield takeLatest('CHANGE_AVATAR_REQUEST', ChangeAvatarSaga);

}

export default function* authrootSaga() {
  yield watchAuthSaga();
}
