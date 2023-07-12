import { Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View, TextInput, Pressable } from 'react-native';

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { updateUser } from '../../actions/user';

import * as api from '../../api';

export default function EditAccountDetailsAndPassword(props) {
    const [firstField, setFirstField] = React.useState('');
    const [secondField, setSecondField] = React.useState('');

    const user = useSelector((state) => state.user);

    const dispatch = useDispatch();

    const onSubmit = () => {
        console.log('Submitted');
        if (props.details) {
            const updates = {}
            if (firstField != '' && firstField != user.email) {
                updates.firstField = firstField
            }
            if (secondField != '' && secondField != user.phoneNumber) {
                updates.secondField = secondField
            }
            if (!updates.firstField && !updates.secondField) {
                return;
            }
            dispatch(updateUser(user._id, updates));
            setFirstField('');
            setSecondField('');
            props.setModalVisible(false);
        } else {
            api.updateUser(user._id, {password: secondField, oldPassword: firstField}).then(res => {
                console.log('done')
                setFirstField('');
                setSecondField('');
                props.setModalVisible(false);
                console.log(res.data.errorMessage);
                // setPassworderror(res.data.errorMessage || '')
            }) //add a case for when the password fails verification
            .catch(error => console.log(error))
        }
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
