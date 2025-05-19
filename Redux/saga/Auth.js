import { call, put, takeLatest, fork } from 'redux-saga/effects';
import * as actions from '../action/auth';
// import * as actions from '../action/components'
import * as api from '../../API/auth';
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
    const response = yield call(api.login, payload.username, payload.password); //,payload.username

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
      } else if (response.data.message) {
        console.log('Login failed with message:', response.data.message);
        yield put(
          actions.loginfail({
            error: [
              response.data.result.message,
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
      console.log('Unexpected status code:', response.status);
      yield put(
        actions.loginfail({
          error: [
            `Unexpected response status: ${response.status}`,
            'please try again',
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

function* ChangepinSaga(payload) {
  yield put(actions.setloading(true));
  try {
    const response = yield call(
      api.changepin,
      payload.name,
      payload.oldpassword,
      payload.newpassword,
    );

    console.log('Response data:', response.data);
    console.log('Response status:', response.status);

    if (response.status === 200) {
      if (!response.data || typeof response.data !== 'object') {
        yield put(
          actions.changepinfails({
            error: [
              'Unexpected error occurred',
              'Response format is invalid or empty.',
            ],
          }),
        );
      } else if (response.data.result.errorText) {
        console.log('error :', response.data.errorText);
        yield put(
          actions.changepinfails({
            error: [
              response.data.result.errorText,
              response.data.result.errorDetail,
            ],
          }),
        );
      } else {
        yield put(
          actions.changepinsuccessful(
            response.data,
            ['Your pin is successfully changed', 'now login with new pin'],
            navigate('Login'),
          ),
        );
      }
    } else {
      yield put(
        actions.changepinfails({
          error: `Unexpected response status: ${response.status}`,
        }),
      );
    }
    yield put(actions.setloading(false));
  } catch (error) {
    yield put(actions.setloading(false));

    yield put(
      actions.changepinfails({
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
      yield put(
        actions.logoutsuccessful([
          'logged out Successful',
          'You are logged out',
          // EncryptedStorage.clear('azure_token')
        ]),
      );
    } 
    else if(response.status === 401  &&  response.error ==="invalid token"){
      
      console.log('invalid token', response);
      yield put(
        actions.loginfail({
        error: "invalid token", 
              }),

   
            );
   
    }



    else if(response.status === 401  &&  response.error ==="jwt expired"){
      
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
          error: `Unexpected response status: ${response.status}`,
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


export function* watchAuthSaga() {
  yield takeLatest('AZURE_LOGIN_REQUEST', AzureLoginSaga);
  yield takeLatest('LOGIN_REQUEST', LoginSaga);
  yield takeLatest('CHANGE_PIN_REQUEST', ChangepinSaga);
  yield takeLatest('LOG_OUT_REQUEST', LogoutSaga);
  yield takeLatest('SIGNUP_REQUEST', SignUpSaga);
  yield takeLatest('MATCH_USERNAME_REQUEST', MatchUsernameSaga);
  yield takeLatest('MATCH_OTP_REQUEST', MatchOtpSaga);
  yield takeLatest('VERIFY_EMAIL_REQUEST', VerifyEmailSaga);

}

export default function* authrootSaga() {
  yield watchAuthSaga();
}
