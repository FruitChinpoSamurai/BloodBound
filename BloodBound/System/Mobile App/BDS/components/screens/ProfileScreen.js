import { StatusBar } from 'expo-status-bar';
import { Image, Modal, Pressable, StyleSheet, View, Text } from 'react-native';

import EditAccountDetailsAndPassword from '../utilities/EditAccountDetailsAndPassword';

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setForDelete } from '../../actions/user';
import { logout } from '../../actions/auth';

export default function ProfileScreen(props) {
	const [modalDetailsVisible, setModalDetailsVisible] = React.useState(false);
	const [modalPasswordVisible, setModalPasswordVisible] = React.useState(false);

	const user = useSelector((state) => state.user);

	const dispatch = useDispatch();

	const deleteAccount = () => dispatch(setForDelete(user._id)).then(() => dispatch(logout()));

	return (
		<View style={styles.container}>
			<StatusBar backgroundColor='pink'/>
            <View style={styles.profileImageContainer}>
				<Image style={styles.profileImage} source={{ uri: 'https://icon-library.com/images/generic-profile-icon/generic-profile-icon-23.jpg' }}/>
			</View>
			<View style={styles.detailsContainer}>
				<Text style={styles.details}>Username: {user.username}</Text>
				<Text style={styles.details}>Full Name: {user.firstName} {user.middleName || ''} {user.lastName}</Text>
				<Text style={styles.details}>E-mail: {user.email || 'None'}</Text>
				<Text style={styles.details}>Phone Number: {user.phoneNumber || 'None'}</Text>
				<Text style={styles.details}>Blood Type: {user.bloodType}</Text>
			</View>
			<View style={styles.buttonsContainer}>
				<Pressable style={[styles.button, {backgroundColor: 'orange'}]} onPress={() => setModalDetailsVisible(true)} >
					<Text style={styles.buttonText}>Edit Account Details</Text>
				</Pressable>
				<Pressable style={[styles.button, {backgroundColor: 'green'}]} onPress={() => setModalPasswordVisible(true)} >
					<Text style={styles.buttonText}>Change Password</Text>
				</Pressable>
				<Pressable style={[styles.button, {backgroundColor: 'violet'}]} onPress={() => deleteAccount()}>
					<Text style={styles.buttonText}>Delete Account</Text>
				</Pressable>
			</View>
			{ modalDetailsVisible && <EditAccountDetailsAndPassword details={true} firstField='New E-mail' secondField='New Phone Number' modalVisible={modalDetailsVisible} setModalVisible={setModalDetailsVisible} /> }
			{ modalPasswordVisible && <EditAccountDetailsAndPassword details={false} firstField='Current Password' secondField='New Password' modalVisible={modalPasswordVisible} setModalVisible={setModalPasswordVisible} /> }
		</View>
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
		width: 325,
		height: 325,
		resizeMode: 'contain'
	},
	profileImageContainer: {
		marginVertical: 15,
		alignSelf: 'center'
	}
});
