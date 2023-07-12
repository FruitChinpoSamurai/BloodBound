import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Image, TextInput, Pressable, StyleSheet, Text, View } from 'react-native';

import RegainDetails from '../utilities/RegainDetails';
import VerifyAccount from '../utilities/VerifyAccount';

import * as api from '../../api';

import { useDispatch } from 'react-redux';

import { setToken } from '../../actions/auth';

export default function LogInScreen(props) {
    const [username, onUsernameChange] = React.useState('');
    const [password, onPasswordChange] = React.useState('');

    const [login, setLogin] = React.useState(false);

    const [modalVisible, setModalVisible] = React.useState(false);

    const [id, setId] = React.useState("");
    const [modalVerify, setModalVerify] = React.useState(false);
    // const [error, setError] = React.useState("");

    const dispatch = useDispatch();

    const cleanUp = () => {
        onUsernameChange('');
        onPasswordChange('');
    }

    React.useEffect(() => {
        let isComponentMounted = true;
        
        if (login) {
            console.log('wpoi')
            api.login({ username, password }).then((res) => {
                if (isComponentMounted) {
                    cleanUp();
                    if (res.data.errorMessage) {
                        alert(res.data.errorMessage);
                        console.log(res.data.errorMessage);
                        return;
                    }
                    if (res.data.message == "Verify") {
                        alert("verify pls");
                        console.log("verify pls");
                        setId(res.data.id);
                        setModalVerify(true);
                        return; 
                    }
                    console.log('Login successful') //redirect to App.js
                    setLogin(false);
                    dispatch(setToken(res.data.token));
                }
            })
            .catch(error => console.log('Error: ', error))
            .then(() => setLogin(false));
        }

        return () => {
            isComponentMounted = false;
        }
    }, [login])

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor='pink'/>
            <Image style={styles.logo} source={require('../../assets/Logo.png')}/>
            <View style={styles.logInForm}>
                    <Text style={{left: 12}}>Please enter your account details to login.</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={onUsernameChange}
                        value={username}
                        placeholder="Username"
                    />
                    <TextInput
                        style={styles.input}
                        onChangeText={onPasswordChange}
                        value={password}
                        placeholder="Password"
                        secureTextEntry={true}
                    />
                    <Text style={styles.regainText} onPress={() => setModalVisible(true)}>Forgot your password or username?</Text>
            </View>
            <View style={styles.bottomButtons}>
                {/* Pass AccountType of user after successful login. */}
                <Pressable style={styles.submitButton} onPress={() => setLogin(true)}>
                    <Text style={styles.buttonText}>Submit</Text>
                </Pressable>
            </View>
            <RegainDetails
                firstField='Email'
                secondField='Phone Number'
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
            />
            {
                id != "" && <VerifyAccount
                    modalVisible={modalVerify}
                    setModalVisible={setModalVerify}
                    id = {id}
                />
            }
        </View>
    );
}

const styles = StyleSheet.create({
	backgroundImage: {
		height: '100%',
		width: '100%',
	},
    backIcon: {
		position: 'absolute',
		height: 100,
		width: 100,
		top: 5,
        left: 5,
        overlayColor: 'black'
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
		alignItems: 'center',
        backgroundColor: 'pink'
	},
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        backgroundColor: 'white'
    },
    logInForm: {
        flex: 1,
        top: '50%',
        alignSelf: 'stretch'
	},
    logo: {
		position: 'absolute',
		height: '40%',
		width: '40%',
		top: 40,
		resizeMode: 'contain'
	},
	submitButton: {
		alignSelf: 'center',
		height: 50,
		width: '100%',
		backgroundColor: 'red'
	},
    regainText: {
        alignSelf: 'center',
        fontSize: 11,
        color: 'red',
        marginTop: 5
    }
});
