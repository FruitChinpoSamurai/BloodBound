import { Image, Modal, StyleSheet, View, Text, TouchableOpacity, TouchableWithoutFeedback, Pressable } from 'react-native';

import ReportUser from './ReportUser';

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getOtherUser } from '../../actions/otherUsers';

import { getUsers } from '../../utils/utils';

const defaultUser = { username: '', firstName: '', middleName: '', lastName: '', bloodType: '' };

export default function ProfileModal(props) {
    const [modalReport, setModalReport] = React.useState(false);

    const otherUsers = useSelector((state) => state.otherUsers);
    const arr = getUsers(otherUsers, ({ username }) => username == props.username);
    const user = arr.length > 0 ? arr[0] : defaultUser;

    const { username } = useSelector((state) => state.user);

    const dispatch = useDispatch();

    React.useEffect(() => dispatch(getOtherUser(props.username)), []);

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
                        <View>
                            <View style={styles.profileImageContainer}>
                                <Image style={styles.profileImage} source={{ uri: 'https://icon-library.com/images/generic-profile-icon/generic-profile-icon-23.jpg' }}/>
                            </View>
                            <View style={styles.detailsContainer}>
                                <Text style={styles.details}>Username: {user.username}</Text>
                                <Text style={styles.details}>Full Name: {user.firstName} {user.middleName || ''} {user.lastName}</Text>
                                <Text style={styles.details}>Blood Type: {user.bloodType}</Text>
                            </View>
                            {
                                username != props.username && <Pressable style={styles.reportButton} onPress={() => setModalReport(!modalReport)}>
                                    <Text style={styles.textStyle}>Report</Text>
                                </Pressable>
                            }
                        </View>
                    </View>
                </TouchableWithoutFeedback>
                {
                    username != props.username && <ReportUser
                        username={props.username}
                        modalVisible={modalReport}
                        setModalVisible={setModalReport}
                    />
                }
            </TouchableOpacity> 
        </Modal>
	);
}

const styles = StyleSheet.create({
	button: {
		height: 50,
		justifyContent: 'center'
	},
	buttonsContainer: {
		position: 'absolute',
		bottom: 0,
		width: '100%'
	},
	buttonText: {
		fontSize: 16,
		textAlign:'center',
	},
	container: {
		flex: 1,
        backgroundColor: 'pink'
	},
	details: {
		fontSize: 16,
		marginVertical: 5
	},
	detailsContainer: {
		alignSelf: 'flex-start',
		marginHorizontal: 15
	},
	profileImage: {
		width: 300,
		height: 300,
		resizeMode: 'contain'
	},
	profileImageContainer: {
		marginVertical: 15,
		alignSelf: 'center'
	},
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
    reportButton: {
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
    }
});
