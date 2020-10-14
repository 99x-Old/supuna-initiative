import { applyMiddleware, createStore } from 'redux';
import rootReducer from 'reducers/index';

const thunkMiddleware = require('redux-thunk').default;

const store = createStore(rootReducer, applyMiddleware(thunkMiddleware)
    && window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
export default store;
