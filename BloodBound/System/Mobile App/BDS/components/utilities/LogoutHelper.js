import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';

import React from 'react';
import { useDispatch } from 'react-redux';

import { logout } from '../../actions/auth';

export default function LogoutHelper(props) {
	const dispatch = useDispatch();

	React.useEffect(() => dispatch(logout()), []);

	return (
		<View style={styles.container}>
			<StatusBar backgroundColor='pink'/>
            {/* Add code here. */}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'flex-end',
		alignItems: 'center',
        backgroundColor: 'pink'
	}
});
