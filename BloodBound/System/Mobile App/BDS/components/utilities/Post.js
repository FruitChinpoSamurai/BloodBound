import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';

import PostOptions from './PostOptions';
import ProfileModal from './ProfileModal';

import { parseDate } from '../../utils/utils';

export default function Post(props) {
    const [touched, setTouched] = React.useState(false);
    const [modalVisible, setModalVisible] = React.useState(false);
    const [profileModalVisible, setProfileModalVisible] = React.useState(false);

	return (
        <>
            <Pressable style={[{ backgroundColor: touched ? '#F7A7A7' : '#FF8E8E'}, styles.post]} onPress={() => setTouched(!touched)} onLongPress={() => setModalVisible(true)}>
                <Text style={styles.heading}>{props.post.bloodTypes.join(',')} {props.post.donationType} required at {props.post.location} by {parseDate(props.post.requiredBy)}</Text>
                {   
                    touched ?
                        <View style={styles.separator}>
                            <Text style={styles.profileText} onPress={() => setProfileModalVisible(true)} >Posted By: {props.post.username}</Text>
                            <Text style={styles.details}>Date Created: {parseDate(props.post.date)}</Text>
                            <Text style={styles.details}>Details: {props.post.body}</Text>
                        </View>
                        : <></>
                }
            </Pressable>
            <PostOptions
                onFulfill={() => props.onFulfill(props.post)}
                post={props.post}
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                failSafeModal={props.failSafeModal}
            />
            <ProfileModal
                modalVisible={profileModalVisible}
                setModalVisible={setProfileModalVisible}
                username={props.post.username}
            />
        </>
	);
}

const styles = StyleSheet.create({
    profileText: {
        color: 'red',
        textAlign: 'left',
        paddingHorizontal: 7.5
    },
    details: {
        textAlign: 'left',
        paddingHorizontal: 7.5
    },
    heading: {
        textAlign: 'left'
    },
    post: {
		alignSelf:'stretch',
        marginLeft: 15,
        marginRight: 15,
        borderRadius: 5,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginVertical: 5
	},
    separator: {
        marginTop: 5
    }
});
