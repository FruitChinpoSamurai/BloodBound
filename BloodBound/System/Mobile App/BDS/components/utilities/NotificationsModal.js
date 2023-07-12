import { FlatList, Modal, Pressable, StyleSheet, View, TouchableOpacity, TouchableWithoutFeedback, Text } from 'react-native';
import Notification from './Notification';

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getPostsById } from '../../actions/posts';
import { getNotificationsById, markAsRead } from '../../actions/notifs';

export default function NotifiCationsModal(props) {
	const { notifications } = useSelector((state) => state.user);
    const notifs = useSelector((state) => state.notifs);

    const postIDs = notifs.map(notif => notif.associatedPost);
    const posts = useSelector((state) => postIDs.map(id => state.posts[id]).filter(post => post != null));

    const dispatch = useDispatch();

    React.useEffect(() => notifications && dispatch(getNotificationsById(notifications)), []);

    React.useEffect(() => (notifs.length > 0) && props.setNewNotifications(notifs.filter(notif => !notif.read).length > 0), [notifs]);
    
    React.useEffect(() => (notifs.length > 0) && dispatch(getPostsById(postIDs)), [notifs]);

    React.useEffect(() => {
        if (props.modalVisible) {
            const unread = notifs.filter(notif => !notif.read).map(notif => notif._id);
            if (unread.length > 0) {
                dispatch(markAsRead(unread)).then(() => props.setNewNotifications(false))
            }
        }
    }, [notifs, props.modalVisible])

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
                        <Pressable style={styles.headerArea}>
                            <Text style={styles.headerText}>Clear</Text>
                        </Pressable>
                        <View style={{marginTop: 30}}>
                            <FlatList
                                data={notifs}
                                renderItem={({ item }) => 
                                    <Notification
                                        key={item.key}
                                        notif={item}
                                        failSafeModal={props.setModalVisible}
                                        fulfillPost={props.fulfillPost}
                                        post={posts.filter(post => post._id == item.associatedPost)?.[0]}
                                    /> 
                                }
                                keyExtractor={item => item._id}
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </TouchableOpacity> 
        </Modal>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
        backgroundColor: 'pink'
	},
    centeredView: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        backgroundColor: '#00000080'
    },
    modalView: {
        marginTop: 60,
        margin: 15,
        backgroundColor: "white",
        borderRadius: 10,
        padding: 15,
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
    headerArea: {
        position: 'absolute',
        width: '25%',
        top: 15,
        left: 20,
        backgroundColor: 'red',
        borderRadius: 5
    },
    headerText: {
        fontSize: 16,
        textAlign: 'center',
        paddingBottom: 3,
        color: 'white'
    },
});
