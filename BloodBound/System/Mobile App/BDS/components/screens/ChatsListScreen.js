import { StatusBar } from 'expo-status-bar';
import { FlatList, Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import ChatsList from '../utilities/ChatsList';

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { getChatsbyId, updateChat } from '../../actions/chats';

export default function ChatListScreen(props) {
    const [updates, setUpdates] = React.useState({ visible: true, index: -1 });
    
    const user = useSelector((state) => state.user);

    const allChats = [ ...user.userChatsWithUser, ...user.userChatsWithSupport, ...user.supportChatsWithUser ];
    const chats = useSelector(
        (state) => 
        allChats
        .map((id) => state.chats[id])
        .filter(chat => chat != null) //don't want them to be null at the start
    );    

    const dispatch = useDispatch();

    React.useEffect(() => (allChats.length > 0) && dispatch(getChatsbyId(allChats, user)), []);

    React.useEffect(() => {
        const { index , visible } = updates;
        if (updates.index != -1) {
            dispatch(updateChat(chats[index]._id, { visible }, user));
            setUpdates({ visible: true, index: -1 });
        }
    }, [updates]);

    const resolve = (index) => {
        setUpdates({ visible: false, index })
    }

    const unresolve = (index) => {
        setUpdates({ visible: true, index })
    }

	let listViewRef;
	const upButtonHandler = () => {
		listViewRef.scrollToOffset({ offset: 0, animated: true });
	};

	return (
        <View style={styles.container}>
            <StatusBar backgroundColor='pink'/>
			<View style={styles.feed}>
				<FlatList 
					data={chats}
					renderItem={({ item }) => 
						<ChatsList 
							key={item.key}
							chat={item}
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
