import { call, put, takeLatest, fork } from 'redux-saga/effects';
import * as actions from '../action/categoury';
// import * as actions from '../action/components'
import * as api from '../../API/categoury';

// import EncryptedStorage from 'react-native-encrypted-storage';


function* CategourySaga(payload) {
  try {
    yield put(actions.setloading(true));
    const response = yield call(api.getcategourydata, payload.categoury);

    if (response && response.status === 200) {
      if (!response.data || typeof response.data !== 'object') {
        yield put(
          actions.categouryfails({
            error: [
              'Unexpected error occurred',
              'Response format is invalid or empty.',
            ],
          }),
        );
      } else if (response.data.error) {
        yield put(
          actions.categouryfails({
            error: [
              response.data.errorText,
              response.data.errorDetail,
            ],
          }),
        );
      } else {
        console.log('Response data in saga:', response.data);
        yield put(
          actions.categourysuccessful(response.data),
        );
      }
    } else {
      yield put(
        actions.categouryfails({
          error: [
            `Unexpected response status: ${response ? response.status : 'no response'}`,
            'please try again',
          ],
        }),
      );
    }
    yield put(actions.setloading(false));
  } catch (error) {
    yield put(actions.setloading(false));

    yield put(
      actions.categouryfails({
        error: ['An error occurred', error.message || 'Unknown error'],
      }),
    );
  }
}

function* CategourynameSaga() {
  try {
    yield put(actions.setloading(true));
     console.log('Making API call...');
    const response = yield call(api.getcategourynameslist);
     console.log('API Response:', response);
    if (response.status === 200) {
      if (!response.data || typeof response.data !== 'object') {
        yield put(
          actions.categourynamerequestfails({
            error: [
              'Unexpected error occurred',
              'Response format is invalid or empty.',
            ],
          }),
        );
      } else if (response.data.error) {
        yield put(
          actions.categourynamerequestfails({
            error: [
              response.data.errorText,
              response.data.errorDetail,
            ],
          }),
        );
      } else {
        yield put(
          actions.categourynamerequestsuccessful(response.data, [
            'data sucessfully fetched',
          ]),
        );
      }
    } else {
      yield put(
        actions.categourynamerequestfails({
          error: [
            `Unexpected response status: ${response.status}`,
            'please try again',
          ],
        }),
      );
    }
    yield put(actions.setloading(false));
  } catch (error) {
    console.error('API Error:', error);
    yield put(actions.setloading(false));

    yield put(
      actions.categourynamerequestfails({
        error: ['An error occurred', error.message || 'Unknown error'],
      }),
    );
  }
}




export function* watchCategourySaga() {
  yield takeLatest('CATEGOURY_REQUEST', CategourySaga);
  yield takeLatest('CATEGOURY_NAME_REQUEST', CategourynameSaga);


}

export default function* categouryrootSaga() {
  yield watchCategourySaga();
}
