import 'react-native-gesture-handler';
// Do not change the position of the above import.
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import reducers from './reducers';

import { View } from 'react-native';

import App from './App';

const { store, persistor } = reducers();

export default function index() {
    return (
        <Provider store={store}>
            <PersistGate loading={<View/>} persistor={persistor}>
                <App/>
            </PersistGate>
        </Provider>
    );
}