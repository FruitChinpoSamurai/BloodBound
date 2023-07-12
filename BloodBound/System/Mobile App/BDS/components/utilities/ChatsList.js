import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { updateChat } from '../../actions/chats';

export default function ChatsList(props) {
    const [updates, setUpdates] = React.useState({ visible: true, set: false });

    const navigation = useNavigation();

    const chat = useSelector((state) => state.chats[props.chat._id]);

    const user = useSelector((state) => state.user);

    const dispatch = useDispatch();

    useEffect(() => {
        const { set , visible } = updates;
        if (set) {
            dispatch(updateChat(props.chat._id, { visible }, user));
            setUpdates({ visible: true, set: false });
        }
    }, [updates]);

    const resolve = () => {
        setUpdates({ visible: false, set: true })
    }

    const unresolve = () => {
        setUpdates({ visible: true, set: true })
    }

	return (
        <Pressable style={styles.detail} onPress={() => navigation.jumpTo('Chat', { chat_id: props.chat._id, username: props.chat.username1 + props.chat.username2 })}>
                <Text style={styles.heading}>Chat with {props.chat.username1 + props.chat.username2}</Text>
                {
                    user.userType == 'Customer_Support' &&
                        <>
                            {
                                chat.visible ?
                                    <Pressable style={[styles.markButton, {backgroundColor: 'green'}]} onPress={() => resolve()}>
                                        <Text style={styles.markText}>Mark as Resolved</Text>
                                    </Pressable>
                                    :
                                    <Pressable style={[styles.markButton, {backgroundColor: 'red'}]} onPress={() => unresolve()}>
                                        <Text style={styles.markText}>Mark as Unresolved</Text>
                                    </Pressable>
                            }
                        </>
                }
        </Pressable>
	);
}

const styles = StyleSheet.create({
    heading: {
        textAlign: 'left'
    },
    detail: {
		alignSelf:'stretch',
        marginLeft: 15,
        marginRight: 15,
        borderRadius: 5,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginVertical: 5,
        backgroundColor: '#FF8E8E'
	},
    markButton: {
        width: 125,
        height: 30,
        borderRadius: 5,
        position: 'absolute',
        right: 5,
        marginVertical: 4.5
    },
    markText: {
        color: 'white',
        textAlign: 'center',
        paddingTop: 5
    }
});
