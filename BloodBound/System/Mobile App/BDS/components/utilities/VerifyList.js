import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';

import EnlargeImage from './EnlargeImage'

import React from 'react';
import { useDispatch } from 'react-redux';

import { deleteOtherUser, updateOtherUser } from '../../actions/otherUsers';

const defaultUpdates = { id: '', isVerified: false };

export default function VerifyList(props) {
    const [touched, setTouched] = React.useState(false);
    const [modalVisible, setModalVisible] = React.useState(false);

    const [updates, setUpdates] = React.useState(defaultUpdates);
    const [deleteUser, setDeleteUser] = React.useState('');

    const dispatch = useDispatch();

    React.useEffect(() => {
        if (updates._id != '' && updates.isVerified) {
            dispatch(updateOtherUser(updates.id, { isVerified: updates.isVerified }))
            .then(() => setUpdates(defaultUpdates));
        }
    }, [updates]);

    React.useEffect(() => deleteUser != '' && dispatch(deleteOtherUser(deleteUser)).then(() => setDeleteUser('')), [deleteUser]);

    const accept = () => {
        setUpdates({ id: props.user._id, isVerified: true });
    }

    const reject = () => {
        setDeleteUser(props.user._id);
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
                        <Text></Text>
                        <View style={{flexDirection: 'row'}}>                        
                            {
                                props.user.verificationDocs.map((item, index) =>
                                    <Pressable onPress={() => setModalVisible(true)} key={index}>                      
                                        <Image
                                            style={{width: 300, height: 300, resizeMode: 'contain'}}
                                            source={{uri: item}}
                                        />
                                        <EnlargeImage
                                            image={item}
                                            modalVisible={modalVisible}
                                            setModalVisible={setModalVisible}
                                        />
                                    </Pressable>
                                )
                            }
                        </View>
                        <Pressable style={styles.submitButton} onPress={() => accept()}>
                            <Text style={styles.buttonText}>Accept</Text>
                        </Pressable>
                        <Pressable style={styles.submitButton} onPress={() => reject()}>
                            <Text style={styles.buttonText}>Reject</Text>
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
