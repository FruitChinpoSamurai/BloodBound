import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import thunk from 'redux-thunk'
import { persistReducer, persistStore } from "redux-persist";

import AsyncStorage from '@react-native-async-storage/async-storage';
import hardSet from 'redux-persist/lib/stateReconciler/hardSet';

import newsfeed from './newsfeed';
import user from './user';
import auth from './auth';
import chats from './chats';
import chatMessages from './chatMessages';
import emergencyPosts from './emergencyPosts';
import posts from './posts';
import reports from './reports';
import otherUsers from './otherUsers';
import notifs from './notifs';

const rootPersistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['auth']
}

const authPersistConfig = {
    key: 'auth',
    storage: AsyncStorage,
    hardSet,
}

const rootReducer = combineReducers({
    newsfeed,
    user,
    chats,
    chatMessages,
    emergencyPosts,
    posts,
    reports,
    otherUsers,
    notifs,
    auth: persistReducer(authPersistConfig, auth)
});

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

export default () => {
    let store = createStore(persistedReducer, compose(applyMiddleware(thunk)));
    let persistor = persistStore(store);
    return { store, persistor };
}