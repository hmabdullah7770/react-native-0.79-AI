
// current
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../reducer/index'; // or reducer if you have only one
import authrootSaga from '../saga/Auth';

import categouryrootSaga from '../saga/Categoury';
import profilerootSaga from '../saga/Profile';
import bannerootSaga from '../saga/Banner';
import createSagaMiddleware from 'redux-saga';





const sagaMiddleware = createSagaMiddleware()

const store = configureStore({
  reducer: rootReducer, // or just reducer: yourReducer if you only have one
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware(
      {
       // Disable the problematic middleware in development
      immutableCheck: {
        warnAfter: 128, // Increase threshold to 128ms
        // Or disable completely: ignoredActions: ['persist/PERSIST']
      },
      serializableCheck: {
        warnAfter: 128, // Increase threshold for serializable check too
        // Ignore saga actions if needed
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }
    ).concat(sagaMiddleware), // Correct middleware setup
});// Create the Redux store


sagaMiddleware.run(authrootSaga);
// sagaMiddleware.run(staterootSaga);
sagaMiddleware.run(profilerootSaga);
sagaMiddleware.run(categouryrootSaga);
sagaMiddleware.run(bannerootSaga);


// Add this line
import { setStore } from '../../utils/store';
setStore(store);

export default store;





// import { createStore, applyMiddleware } from 'redux';
// import rootReducer from '../reducers/index';
// import authrootSaga from '../saga/Auth';
// import staterootSaga from '../saga/states'
// import createSagaMiddleware from 'redux-saga';

// const sagaMiddleware = createSagaMiddleware();
// const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));

// sagaMiddleware.run(authrootSaga);
// sagaMiddleware.run(staterootSaga);
// export default store;
