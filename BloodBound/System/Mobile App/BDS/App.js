import 'react-native-gesture-handler';
// Do not change the position of the above import.
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet } from 'react-native';


import LogInScreen from './components/screens/LogInScreen';
import Home from './components/screens/Home';
import SignUpScreen from './components/screens/SignUpScreen';
import DrawerNavigationHelper from './components/utilities/DrawerNavigationHelper';

const Stack = createNativeStackNavigator();

export default function App() {
	return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{
                headerStyle: {
                    backgroundColor: 'red',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}
            >
                <Stack.Screen name="Home" component={Home} options={{headerShown: false}} />
                <Stack.Screen name="LogInScreen" component={LogInScreen} options={{headerShown: false}} />
                <Stack.Screen name="SignUpScreen" component={SignUpScreen} options={{headerShown: false}} />
                <Stack.Screen name="DrawerNavigationHelper" component={DrawerNavigationHelper} options={{headerShown: false}} />
            </Stack.Navigator>
        </NavigationContainer>
	);
}

const styles = StyleSheet.create({
	logo: {
		height: '5%',
		width: '5%',
		resizeMode: 'contain'
	}
});