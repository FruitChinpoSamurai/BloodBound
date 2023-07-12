import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';

import ProfileModal from './ProfileModal';
import ReportUser from './ReportUser';

import { parseDate } from '../../utils/utils';

export default function RequestsFulfilledList(props) {
    const [touched, setTouched] = React.useState(false);
    const [modalProfileVisible, setModalProfileVisible] = React.useState(false);
    const [modalReportVisible, setModalReportVisible] = React.useState(false);

	return (
        <Pressable style={[{ backgroundColor: touched ? '#F7A7A7' : '#FF8E8E'}, styles.post]} onPress={() => setTouched(!touched)} >
            <Text style={styles.heading}>Blood Types: {props.post.bloodTypes.join(',')}, Donation Type: {props.post.donationType}, required at {props.post.location} by {parseDate(props.post.requiredBy)}</Text>
            {   touched ?
                    <View style={styles.separator}>
                        <Text style={styles.details}>
                            <Text>Posted By: </Text><Text style={styles.profileText} onPress={() => setModalProfileVisible(true)} >{props.post.username}</Text>
                        </Text>
                        <Text style={styles.details}>Date Created: {parseDate(props.post.date)}</Text>
                        <Text style={styles.details}>Details: {props.post.body}</Text>
                        <Pressable style={styles.submitButton} onPress={() => setModalReportVisible(true)} >
                            <Text style={styles.buttonText}>Report</Text>
                        </Pressable>
                    </View>
                    : <></>
            }
            <ProfileModal username={props.post.username} modalVisible={modalProfileVisible} setModalVisible={setModalProfileVisible} />
            <ReportUser username={props.post.username} modalVisible={modalReportVisible} setModalVisible={setModalReportVisible} />
        </Pressable>
	);
}

const styles = StyleSheet.create({
    profileText: {
        color: 'red'
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
    },
    submitButton: {
		height: 40,
		width: '100%',
		backgroundColor: 'red',
        borderRadius: 5,
        marginTop: 15,
	},
    buttonText: {
        top: 8,
		fontSize: 16,
        textAlign: 'center'
	}
});
