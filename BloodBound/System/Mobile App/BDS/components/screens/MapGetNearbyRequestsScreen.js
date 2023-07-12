import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';

export default function MapGetNearbyRequestsScreen(props) {
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
