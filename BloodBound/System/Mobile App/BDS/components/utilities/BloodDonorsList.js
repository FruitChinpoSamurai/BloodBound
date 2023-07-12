import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';

import EnlargeImage from './EnlargeImage'

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { updateOtherUser } from '../../actions/otherUsers';

const defaultUpdates = { isVerified: false, setIneligibleBy: null };

export default function BloodDonorsList(props) {
    const [touched, setTouched] = React.useState(false);
    const [modalVisible, setModalVisible] = React.useState(false);

    const [updates, setUpdates] = React.useState(defaultUpdates);

    const { username } = useSelector((state) => state.user);

    const dispatch = useDispatch();

    React.useEffect(() => {
        if (updates.isVerified) {
            dispatch(updateOtherUser(props.user._id, { isVerified: updates.isVerified, setIneligibleBy: updates.setIneligibleBy }))
            .then(() => props.ticket == 'manage' && setUpdates(defaultUpdates));
        }
    }, [updates]);

    const accept = () => {
        setUpdates({ isVerified: true, setIneligibleBy: null });
    }

    const reject = () => {
        setUpdates({ isVerified: true, setIneligibleBy: username });
    }

	return (
        <Pressable style={[{ backgroundColor: touched ? '#F7A7A7' : '#FF8E8E'}, styles.post]} onPress={() => setTouched(!touched)}>
            <Text style={styles.heading}>Name: {props.user.firstName} {props.user.middleName || ''} {props.user.lastName}</Text>
            {   touched ?
                    <View style={styles.separator}>
                        <Text style={styles.details}>Username: {props.user.username}</Text>
                        <Text style={styles.details}>User Type: {props.user.userType}</Text>
                        <Text style={styles.details}>E-mail: {props.user.email  || "No email provided"}</Text>
                        <Text style={styles.details}>Phone Number: {props.user.phoneNumber  || "No phone number provided"}</Text>
                        {
                            props.ticket == 'manage' ?
                                <View>
                                    <Text style={styles.details}>{`Verified (yes/no): ${props.user.isVerified ? 'yes': 'no'}`}</Text>
                                    <Text style={styles.details}>{`Eligible (yes/no): ${props.user.setIneligibleBy == null ? 'yes': 'no'}`}</Text>
                                </View>
                                : <></>
                        }
                        <Text></Text>
                        <View style={{flexDirection: 'row'}}>                        
                            {
                                props.user.verificationDocs.map((item, index) =>
                                    <Pressable onPress={() => setModalVisible(true)} key={index}>                      
                                        <Image
                                            key={`${index} smol`}
                                            style={{width: 300, height: 300, resizeMode: 'contain'}}
                                            source={{uri: item}}
                                        />
                                        <EnlargeImage
                                            key={`${index} large`}
                                            image={item}
                                            modalVisible={modalVisible}
                                            setModalVisible={setModalVisible}
                                        />
                                    </Pressable>
                                )
                            }
                        </View>
                        <Pressable style={styles.submitButton} onPress={() => accept()}>
                            {
                                props.ticket == 'manage' ?
                                    <Text style={styles.buttonText}>Set Eligible</Text> : <Text style={styles.buttonText}>Accept</Text>
                            }
                        </Pressable>
                        <Pressable style={styles.submitButton} onPress={() => reject()}>
                            {
                                props.ticket == 'manage' ?
                                    <Text style={styles.buttonText}>Set Ineligible</Text> : <Text style={styles.buttonText}>Reject</Text>
                            }
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
