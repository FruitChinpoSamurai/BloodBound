import { Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View, TextInput, Pressable } from 'react-native';

import React from 'react';

import * as api from '../../api';

export default function RegainDetails(props) {
    const [firstField, setFirstField] = React.useState('');
    const [secondField, setSecondField] = React.useState('');

    const [submit, setSubmit] = React.useState(false);

    React.useEffect(() => {
        let isComponentMounted = true;
        if (submit) {
            api.forgot({ email: firstField, phoneNumber: secondField })
            .then(res => {
                if (isComponentMounted) {
                    alert('The details have been sent to the specified email/ phone number.');
                    setFirstField("");
                    setSecondField("");
                    props.setModalVisible(false);
                }
            })
            .catch(error => console.log(error))
            .then(() => setSubmit(false));
        }

        return () => {
            isComponentMounted = false;
        }
    }, [submit])

    const onSubmit = () => {
        setSubmit(true);
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
                                    <Text style={styles.headerText}>Enter either your email address or phone number.</Text>
                                    <Text style={[styles.headerText, {marginBottom: 10}]}>Your username and password will be sent to them in a few minutes.</Text>
                                </View>
                                <TextInput
                                    style={styles.input}
                                    onChangeText={setFirstField}
                                    value={firstField}
                                    placeholder={props.firstField}
                                />
                                <TextInput
                                    style={styles.input}
                                    onChangeText={setSecondField}
                                    value={secondField}
                                    placeholder={props.secondField}
                                />
                                <Pressable style={styles.submitButton} onPress={() => onSubmit()}>
                                    <Text style={styles.buttonText}>Submit</Text>
                                </Pressable>
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
