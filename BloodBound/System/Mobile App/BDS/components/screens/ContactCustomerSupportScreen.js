import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';

import React, { useEffect } from 'react';
import { useDispatch } from "react-redux";

import { getSupport } from '../../actions/otherUsers';

export default function ContactCustomerSupportScreen(props) {
	const [username, setUsername] = React.useState('');

    const dispatch = useDispatch();

	const isFocused = useIsFocused();

	const navigation = useNavigation();

    useEffect(() => isFocused && dispatch(getSupport()).then((uName) => setUsername(uName)), [isFocused]);

	useEffect(() => {
		if (username != '') {
			navigation.jumpTo('Chat', { username });
			setUsername('');
		}
	}, [username]);

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
