import { Pressable, StyleSheet, Text, View } from 'react-native';

import React from 'react';
import { useDispatch } from 'react-redux';

import { deleteOtherUser, updateOtherUser } from '../../actions/otherUsers';

const defaultUpdates = { _id: '', decision: '' };

export default function DeletionsList(props) {
    const [touched, setTouched] = React.useState(false);
    const [updates, setUpdates] = React.useState(defaultUpdates);

    const dispatch = useDispatch();

    const contactApi = () => {
        if (updates.decision == 'accept') {
            return dispatch(deleteOtherUser(updates._id));
        } else {
            return dispatch(updateOtherUser(updates._id, { isDeleted: false }));
        }
    }

    React.useEffect(() => {
        if (updates._id != '' && updates.decision != '') {
            contactApi();
        }
    }, [updates])

    const accept = () => {
        setUpdates({ _id: props.user._id, decision: 'accept' });
    }

    const reject = () => {
        setUpdates({  _id: props.user._id, decision: 'reject' });
    }

	return (
        <Pressable style={[{ backgroundColor: touched ? '#F7A7A7' : '#FF8E8E'}, styles.post]} onPress={() => setTouched(!touched)}>
            <Text style={styles.heading}>Name: {props.user.firstName} {props.user.middleName || ''} {props.user.lastName}</Text>
            {   touched ?
                    <View style={styles.separator}>
                        <Text style={styles.details}>Username: {props.user.username}</Text>
                        <Text style={styles.details}>User Type: {props.user.userType}</Text>
                        <Text style={styles.details}>E-mail: {props.user.email || 'No email address given'}</Text>
                        <Text style={styles.details}>Phone Number: {props.user.phoneNumber || 'No phone number given'}</Text>
                        <Pressable style={styles.submitButton} onPress={() => accept()}>
                            <Text style={styles.buttonText}>Delete</Text>
                        </Pressable>
                        <Pressable style={styles.submitButton} onPress={() => reject()}>
                            <Text style={styles.buttonText}>Restore</Text>
                        </Pressable>
                    </View>
                    : <></>
            }
        </Pressable>
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
