import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';

import ChatMessagesDisplay from '../utilities/ChatMessagesDisplay';

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { addMessage, createChat, getChat, removeChat } from '../../actions/chats';

export default function ChatScreen(props) {
	let { chat_id, username, id } = props.route.params;

    const [_id, set_Id] = React.useState(null);
    const [resolve, setResolve] = React.useState(false);
	const [message, setMessage] = React.useState('');
    const [messageBox, setMessageBox] = React.useState('');

	const [inputBarFlag, setInputBarFlag] = React.useState(false);
    
    const user = useSelector((state) => state.user);
    
    const chat = useSelector((state) => (chat_id && state.chats[chat_id]) || (_id && state.chats[_id]) || { _id: chat_id, chatMessages: [] });
    
    const navigation = useNavigation();

    const dispatch = useDispatch();

    const isFocused = useIsFocused();

    const setStuff = () => {
        navigation.setParams({ chat_id: null, username: '', id: null });
        set_Id(null);
        setResolve(false);
        setMessage('');
        setMessageBox('');
    }

    React.useEffect(() => setStuff(), [isFocused]); 
    //the use state vars are not reset when the chat screen changes, 
    //maybe because the stack screen thingy is not really 're-rendered'.
    //even useEffects to set the _id var (present in the web-app)
    //failed, so this is the solution I came up with to reduce the dependency on it
    //when the chat_id is available

    const getFilters = () => {
        let filters = {};
        if (!chat._id) {
            filters = { usernames: [username, user.username], associatedPost: id };
        } else { //either the _id was provided in props, or the chat window needs to be refreshed when opened.
            filters = { _id: chat._id };
        }
        return filters;
    }

    React.useEffect(() => isFocused && dispatch(getChat(getFilters(), user)).then((_id1) => set_Id(_id1)), [isFocused]);

    React.useEffect(() => {
        if (resolve) {
            navigation.jumpTo('Newsfeed');
            dispatch(removeChat(chat._id));
        }
    }, [resolve])

    const onResolve = () => {
        setResolve(true);
    }

    const sendMessage = () => {
        const chatMessage = { body: message, author: user.username, date: new Date() };
        if (chat._id) {
            return dispatch(addMessage(chat._id, chatMessage))
            .then((errorMessage) => errorMessage != null ? onResolve() : null); //resolve if there is an error message
        } else {
            const chatInfo = { username1: username, username2: user.username, associatedPost: id };
            return dispatch(createChat(chatInfo, chatMessage, user))
            .then((_id1) => set_Id(_id1));
        }
    }

    React.useEffect(() => message != '' && sendMessage().then(() => setMessageBox('')).then(() => setMessage('')), [message]);

    const onSubmit = () => {
        setMessage(messageBox);
    }

	return (
        <View style={styles.container}>
            <StatusBar backgroundColor='pink'/>
			<View style={[styles.feed, inputBarFlag ? {marginBottom: 95} : {marginBottom: 65}]}>
				<ChatMessagesDisplay receiver={username} sender={user.username} chat={chat}/>
			</View>
			<TextInput
				style={[styles.input, inputBarFlag ? {} : {height: 40}]}
				onChangeText={setMessageBox}
				value={messageBox}
				placeholder="Message"
				multiline = {true}
				numberOfLines={3}
				onFocus={() => setInputBarFlag(true)}
				onEndEditing={() => setInputBarFlag(false)}
			/>
			<Pressable style={styles.button} onPress={() => onSubmit()}>
				<Text style={styles.buttonText}>Send</Text>
			</Pressable>
        </View>
	);
}

const styles = StyleSheet.create({
	button: {
		backgroundColor: 'red',
		position: 'absolute',
		bottom: 12,
		right: 15,
		borderRadius: 6
	},
	buttonText: {
		paddingVertical: 10,
		paddingHorizontal: 15,
		color: 'white'
	},
	container: {
		flex: 1,
        backgroundColor: '#610519'
	},
	feed: {
		backgroundColor: 'pink'
	},
	input: {
		width: '75%',
        margin: 12,
        borderWidth: 1,
        padding: 10,
        backgroundColor: 'white',
		position: 'absolute',
		bottom: 0,
		borderRadius: 6,
		textAlignVertical: 'top'
    }
});
