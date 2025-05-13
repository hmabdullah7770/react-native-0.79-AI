import { createStore, applyMiddleware } from 'redux';
import rootReducer from '../reducers/index';
import authrootSaga from '../saga/auth';
import staterootSaga from '../saga/states'
import createSagaMiddleware from 'redux-saga';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(authrootSaga);
sagaMiddleware.run(staterootSaga);
export default store;
