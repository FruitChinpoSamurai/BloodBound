import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';

import PostOptions from './PostOptions';
import ProfileModal from './ProfileModal';

import { parseDate } from '../../utils/utils';

export default function Post(props) {
    const [touched, setTouched] = React.useState(false);
    const [postModalVisible, setPostModalVisible] = React.useState(false);
    const [profileModalVisible, setProfileModalVisible] = React.useState(false);

	return (
        <>
            <Pressable style={[{ backgroundColor: touched ? '#F7A7A7' : '#FF8E8E'}, styles.post]} onPress={() => setTouched(!touched)} onLongPress={() => setPostModalVisible(true)}>
                <Text style={styles.heading}>{`${props.notif?.text} (${parseDate(props.notif?.timeCreated)})`}</Text>
                {   
                    touched && props.post ?
                        //The post component wasn't getting rendered for whatever reason. Props would also vanish when it was used. Weird.
                        <View style={styles.separator}>
                            <Text style={styles.details}>
                                <Text>{props.post.bloodTypes.join(',')} {props.post.donationType} required at {props.post.location} by {parseDate(props.post.requiredBy)}</Text>
                            </Text>
                            <Text style={styles.details}>
                                <Text>Posted By: </Text>
                                <Text style={styles.linkText} onPress={() => setProfileModalVisible(true)}>{props.post.username}</Text>
                            </Text>
                            <Text style={styles.details}>Date Created: {parseDate(props.post.date)}</Text>
                            <Text style={styles.details}>Details: {props.post.body}</Text>
                        </View>
                        : <></>
                }
            </Pressable>
            <PostOptions
                modalVisible={postModalVisible}
                setModalVisible={setPostModalVisible}
                postedBy={props.postedBy}
                post={props.post}
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
    details: {
        textAlign: 'left',
        paddingHorizontal: 7.5
    },
    heading: {
        textAlign: 'left'
    },
    post: {
		alignSelf:'stretch',
        marginLeft: 5,
        marginRight: 5,
        borderRadius: 5,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginVertical: 5
	},
    separator: {
        marginTop: 5
    },
    linkText: {
        color: 'red'
    },
});
