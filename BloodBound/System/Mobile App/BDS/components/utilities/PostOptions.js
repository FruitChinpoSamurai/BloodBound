import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import ReportUser from './ReportUser';

import React from 'react';
import { useDispatch, useSelector } from "react-redux";

import { createNotification } from "../../actions/user";

export default function PostOptions(props) {
    const [modalVisible, setModalVisible] = React.useState(false);

    //Since the chat screen is hidden from the Drawer, and passing the navigation prop
    //doesn't work for some reason, use this to open up the chat screen.
    const navigation = useNavigation();

    const navigateToChat = () => {
        props.setModalVisible(!props.modalVisible);
        if(props.failSafeModal != undefined) {
            props.failSafeModal(false)
        }
        navigation.jumpTo('Chat', { username: props.post.username, id: props.post._id });
    }

    const [notify, setNotify] = React.useState(false);

	const user = useSelector((state) => state.user);

	const dispatch = useDispatch();

	React.useEffect(() => notify && 
		dispatch(createNotification({ 
			usernames: [user.username], 
			associatedPost: props.post._id, 
			text: `Reminder for a donation.`, 
			givenByPoster: false, 
			timeCreated: new Date(new Date().getTime() + 3600 * 1000/2) 
		}))
		.then(() => alert('Reminder set!'))
		.then(() => setNotify(false)), [notify]);

	const notifyLater = () => {
		setNotify(true);
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
                        {
                            user.userType != 'Admin' && user.userType != 'Customer_Support' &&
                            <Pressable style={styles.button} onPress={() => props.onFulfill()}>
                                <Text style={styles.textStyle}>Fulfill</Text>
                            </Pressable>
                        }
                        {
                            user.username != props.post.username &&
                            <>
                                {
                                    user.userType != 'Customer_Support' &&
                                    <>
                                        <Pressable style={styles.button} onPress={() => navigateToChat()}>
                                            <Text style={styles.textStyle}>Contact</Text>
                                        </Pressable>
                                        <Pressable style={styles.button} onPress={() => notifyLater()}>
                                            <Text style={styles.textStyle}>Remind</Text>
                                        </Pressable>
                                    </>
                                }
                                <Pressable style={styles.button} onPress={() => setModalVisible(true)}>
                                    <Text style={styles.textStyle}>Report</Text>
                                </Pressable>
                            </>
                        }
                    </View>
                </TouchableWithoutFeedback>
                <ReportUser
                    username={props.post.username}
                    modalVisible={modalVisible}
                    setModalVisible={setModalVisible}
                />
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
    button: {
        width: 75,
        borderRadius: 5,
        padding: 5,
        elevation: 2,
        backgroundColor: "red",
        marginHorizontal: 5
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    }
  });
