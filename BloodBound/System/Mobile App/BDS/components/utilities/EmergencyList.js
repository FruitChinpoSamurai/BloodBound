import { Pressable, StyleSheet, Text, View } from 'react-native';

import { parseDate } from '../../utils/utils';

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { updateEmergencyPost } from '../../actions/emergencyPosts';

export default function EmergencyList(props) {
    const [touched, setTouched] = React.useState(false);
    const [inactive, setInactive] = React.useState(false);

    const dispatch = useDispatch();

    React.useEffect(() => inactive && dispatch(updateEmergencyPost(props.ePost._id, { isActive: false })).then(() => setInactive(false)), [inactive]);

	return (
        <Pressable style={[{ backgroundColor: touched ? '#F7A7A7' : '#FF8E8E'}, styles.post]} onPress={() => setTouched(!touched)}>
            <Text style={styles.heading}>Date Created: {parseDate(props.ePost.created)}</Text>
            {   touched ?
                    <View style={styles.separator}>
                        <Text style={styles.details}>Location: {props.ePost.locations}</Text>
                        <Text style={styles.details}>Blood Types: {props.ePost.bloodTypes.join(',')}</Text>
                        <Text></Text>
                        <Text style={styles.details}>{props.ePost.body}</Text>
                        <Pressable style={styles.submitButton} onPress={() => setInactive(true)}>
                            <Text style={styles.buttonText}>Inactivate</Text>
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
