import { Pressable, StyleSheet, Text, View } from 'react-native';

import React from 'react';

import { parseDate } from '../../utils/utils';

export default function RequestsCreatedList(props) {
    const [touched, setTouched] = React.useState(false);

	return (
        <Pressable style={[{ backgroundColor: touched ? '#F7A7A7' : '#FF8E8E'}, styles.post]} onPress={() => setTouched(!touched)} >
            <Text style={styles.heading}>Blood Types: {props.post.bloodTypes.join(',')}, Donation Type: {props.post.donationType}, required at {props.post.location} by {parseDate(props.post.requiredBy)}</Text>
            {   touched ?
                    <View style={styles.separator}>
                        <Text style={styles.details}>Date Created: {parseDate(props.post.date)}</Text>
                        <Text style={styles.details}>Details: {props.post.body}</Text>
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
    }
});
