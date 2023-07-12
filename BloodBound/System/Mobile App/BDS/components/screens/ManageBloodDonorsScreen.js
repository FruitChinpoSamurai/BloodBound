import { StatusBar } from 'expo-status-bar';
import { FlatList, Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import BloodDonorsList from '../utilities/BloodDonorsList';

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getUsersById } from '../../actions/otherUsers';

export default function ManageBloodDonorsScreen(props) {
	const { accountsCreated } = useSelector((state) => state.user);

    const users = useSelector((state) => accountsCreated.map(id => state.otherUsers[id]).filter(user => user != null));

    const requiredIDs = useSelector((state) => accountsCreated.filter(id => state.otherUsers[id] == null));

    const dispatch = useDispatch();

    React.useEffect(() => dispatch(getUsersById(requiredIDs)), [accountsCreated]);

	let listViewRef;
	const upButtonHandler = () => {
		listViewRef.scrollToOffset({ offset: 0, animated: true });
	};

	return (
        <View style={styles.container}>
            <StatusBar backgroundColor='pink'/>
			<View style={styles.feed}>
				<FlatList 
					data={users}
					renderItem={({ item }) => 
						<BloodDonorsList 
							key={item.key}
							user={item}
							ticket={'manage'}
						/> 
					}
					keyExtractor={item => item._id}
					ref={(ref) => {
						listViewRef = ref;
					}}
				/>
			</View>
			<TouchableOpacity activeOpacity={0.5} onPress={upButtonHandler} style={[styles.scrollViewButton, {bottom: 25}]}>
				<Image source={{ uri: 'https://raw.githubusercontent.com/AboutReact/sampleresource/master/arrow_up.png' }} style={styles.upAddButtonImageStyle} />
			</TouchableOpacity>
        </View>
	);
}

const styles = StyleSheet.create({
	buttonText: {
		top:15,
		fontSize: 16,
		alignSelf:'center'
	},
	container: {
		flex: 1,
		justifyContent: 'flex-start',
		alignItems: 'center',
        backgroundColor: 'pink'
	},
	feed: {
		width: '100%',
		marginVertical: 15 
	},
	topButton: {
		position: 'absolute',
		bottom: 15,
		right: 15
	},
	topButtonText: {
		alignSelf: 'center'
	},
	scrollViewButton: {
		position: 'absolute',
		width: 50,
		height: 50,
		alignItems: 'center',
		justifyContent: 'center',
		right: 25,
	},
	upAddButtonImageStyle: {
		resizeMode: 'contain',
		width: 30,
		height: 30,
	},
});
