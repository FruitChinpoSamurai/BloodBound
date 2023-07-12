import { StatusBar } from 'expo-status-bar';
import { Image, ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';

import decode from 'jwt-decode';

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getUser } from '../../actions/user';
import { logout } from '../../actions/auth';

export default function Home(props) {
	const token = useSelector((state) => state.auth.token);
	
	const { userType } = useSelector((state) => state.user);
	// console.log('got', userType, token)

	const dispatch = useDispatch();

	React.useEffect(() => token && dispatch(getUser(decode(token).username)), [token]);
	
	React.useEffect(() => token && userType && props.navigation.navigate('DrawerNavigationHelper'), [token, userType]);

	const nullifyToken = () => dispatch(logout());

	React.useEffect(() => {
        let isComponentMounted = true;

		if (token) {
			const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
			const time = decode(token).exp * 1000 - (new Date().getTime());
			console.log(time / 1000);
			delay(time < 0 ? 0 : time)
			.then(() => {
				console.log('time do be up tho')
				if (isComponentMounted) {
					console.log('removal')
					nullifyToken()
				} else {
					console.log('already logged out')
				}
			})
			.catch(error => console.log(error));
		}

        return () => {
            console.log('i am unmount');
            isComponentMounted = false;
        }
    }, [token])

	return (
		<View style={styles.container}>
			<StatusBar backgroundColor='pink'/>
			<ImageBackground style={styles.backgroundImage} source={require('../../assets/backgroundImage.jpg')}/>
			<Image style={styles.logo} source={require('../../assets/Logo.png')}/>
			<View style={styles.bottomButtons}>
				<Pressable style={styles.logInButton} onPress={() => props.navigation.navigate('LogInScreen')}>
					<Text style={styles.buttonText}>Log In</Text>
				</Pressable>
				<Pressable style={styles.signUpButton} onPress={() => props.navigation.navigate('SignUpScreen')}>
					<Text style={styles.buttonText}>Sign Up</Text>
				</Pressable>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	backgroundImage: {
		height: '100%',
		width: '100%',
	},
	bottomButtons: {
		position: 'absolute',
		alignSelf: 'center',
		width: '100%'
	},
	buttonText: {
		top:15,
		fontSize: 16,
		alignSelf:'center'
	},
	container: {
		flex: 1,
		justifyContent: 'flex-end',
		alignItems: 'center'
	},
	logInButton: {
		alignSelf: 'center',
		height: 50,
		width: '100%',
		backgroundColor: 'pink'
	},
	logo: {
		position: 'absolute',
		height: '80%',
		width: '80%',
		top: 70,
		resizeMode: 'contain'
	},
	signUpButton: {
		alignSelf: 'center',
		height: 50,
		width: '100%',
		backgroundColor: 'red'
	},
});
