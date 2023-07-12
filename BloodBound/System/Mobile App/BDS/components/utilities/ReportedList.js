import { Pressable, StyleSheet, Text, View } from 'react-native';

import ProfileModal from './ProfileModal';

import React from 'react';
import { useDispatch } from 'react-redux';

import { updateReport } from '../../actions/reports';

export default function ReportedList(props) {
    const [touched, setTouched] = React.useState(false);
    const [modalAccuserVisible, setModalAccuserVisible] = React.useState(false);
    const [modalAccusedVisible, setModalAccusedVisible] = React.useState(false);

    const dispatch = useDispatch();

    const rescindReport = () => dispatch(updateReport(props.report._id, { isActive: false }));

	const deleteReport = () => dispatch(updateReport(props.report._id, { show: false }));

	return (
        <Pressable style={[{ backgroundColor: touched ? '#F7A7A7' : '#FF8E8E'}, styles.post]} onPress={() => setTouched(!touched)}>
            <Text style={styles.heading}>{props.report.snitch} reporting {props.report.culprit}</Text>
            {   touched ?
                    <View style={styles.separator}>
                        <Text style={styles.details}>
                            <Text>Accuser: </Text>
                            <Text style={styles.profileText} onPress={() => setModalAccuserVisible(true)}>{props.report.snitch}</Text>
                        </Text>
                        <Text style={styles.details}>
                            <Text>Accused: </Text>
                            <Text style={styles.profileText} onPress={() => setModalAccusedVisible(true)}>{props.report.culprit}</Text>
                        </Text>
                        <Text style={styles.details}>Reason: {props.report.reason}</Text>
                        <Text></Text>
                        <Text style={styles.details}>Explanation: {props.report.body}</Text>
                        <Pressable style={styles.button} onPress={() => rescindReport()}>
                            <Text style={styles.buttonText}>Rescind</Text>
                        </Pressable>
                        <Pressable style={styles.button} onPress={() => deleteReport()}>
                            <Text style={styles.buttonText}>Delete</Text>
                        </Pressable>
                    </View>
                    : <></>
            }
            <ProfileModal username={props.report.snitch} modalVisible={modalAccuserVisible} setModalVisible={setModalAccuserVisible} />
			<ProfileModal username={props.report.culprit} modalVisible={modalAccusedVisible} setModalVisible={setModalAccusedVisible} />
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
    button: {
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
