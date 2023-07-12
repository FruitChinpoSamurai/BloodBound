import { Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View, TextInput, Pressable } from 'react-native';

import React from 'react';

import * as api from '../../api';

export default function VerifyAccount(props) {
    const [firstField, setFirstField] = React.useState('');
    const [secondField, setSecondField] = React.useState('');
    const [submit, setSubmit] = React.useState(false);
    const [code, setCode] = React.useState(false);

    React.useEffect(() => {
        let isComponentMounted = true;
        if (submit && code != "") {
            api.verifyCode(props.id, { code })
            .then(res => {
                if (isComponentMounted) {
                    let alertString = "";
                    if (res.data?.message == "OK") {
                        alertString += "Your verification code has been accepted."
                        if (res.data.canLogin) {
                            alertString += " You may now login."
                        }
                    } else {
                        alertString += "Incorrect verification code."
                    }
                    alert(alertString);
                }
            })
            .catch(error => console.log(error))
            .then(() => {
                setCode(""); 
                setSubmit(false);
            });
        }

        return () => {
            isComponentMounted = false;
        }
    }, [submit, code])

    const onSubmit = (option) => {
        setSubmit(true);
        setCode(option + (option == "E-" ? firstField : secondField));
    }

    const onResend = (option) => {
        api.resendCode(props.id, { option })
        .then(() => alert('Code resent!'))
        .catch(error => console.log(error))
    }

	return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={props.modalVisible}
            onRequestClose={() => {
                props.setModalVisible(!props.modalVisible);
            }}
        >
            <TouchableOpacity 
                style={styles.centeredView} 
                activeOpacity={1} 
                onPressOut={() => props.setModalVisible(!props.modalVisible)}
            >
                <TouchableWithoutFeedback>
                    <View style={styles.modalView}>
                            <View style={styles.form}>
                                <View>
                                    <Text style={styles.headerText}>A code has sent been sent to your provided email and/or phone number.</Text>
                                    <Text style={[styles.headerText, {marginBottom: 10}]}>Please enter the code(s) below:</Text>
                                </View>
                                <View>
                                <Text style={styles.headerText}>Email:</Text>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={(e) => setFirstField(e.slice(2))}
                                        value={'E-' + firstField}
                                        placeholder={props.firstField}
                                    />
                                    <Pressable style={styles.submitButton} onPress={() => onSubmit("E-")}>
                                        <Text style={styles.buttonText}>Submit</Text>
                                    </Pressable>
                                    <Pressable style={styles.submitButton} onPress={() => onResend("E")}>
                                        <Text style={styles.buttonText}>Resend</Text>
                                    </Pressable>
                                </View>
                                <View>
                                <Text style={styles.headerText}>Phone Number:</Text>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={(e) => setSecondField(e.slice(2))}
                                        value={'P-' + secondField}
                                        placeholder={props.secondField}
                                    />
                                    <Pressable style={styles.submitButton} onPress={() => onSubmit("P-")}>
                                        <Text style={styles.buttonText}>Submit</Text>
                                    </Pressable>
                                    <Pressable style={styles.submitButton} onPress={() => onResend("P")}>
                                        <Text style={styles.buttonText}>Resend</Text>
                                    </Pressable>
                                </View>
                            </View>
                    </View>
                </TouchableWithoutFeedback>
            </TouchableOpacity> 
        </Modal>
	);
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#00000080'
    },
    header: {
        fontSize: 16,
        marginBottom: 15
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 10,
        padding: 15,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        flexDirection: 'row'
    },
    item: {
        padding: 5,
        marginVertical: 5,
        borderWidth: 2,
    },
    input: {
        height: 40,
        borderWidth: 1,
        padding: 10,
        backgroundColor: 'white',
        marginVertical: 5
    },
    form: {
        alignItems: 'stretch'
    },
    submitButton: {
		alignSelf: 'center',
		height: 50,
		width: '100%',
		backgroundColor: 'red',
        borderRadius: 5,
        marginTop: 15
	},
    buttonText: {
		top:15,
		fontSize: 16,
		alignSelf:'center'
	},
  });
