import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

export default function Message(props) {
	return (
        <>
            {
                props.viewer == props.author ? 
                (
                    <View style={[styles.post, {alignSelf: 'flex-end', right: 15, backgroundColor: '#E0EDCA'}]}>
                        <Text style={styles.textAlign}>{props.message}</Text>
                        <Text style={[styles.dateAlign, {fontSize: 10, color: 'grey'}]}>{props.date}</Text>
                    </View>
                ) :
                (
                    <View style={[styles.post, {alignSelf: 'flex-start', left: 15, backgroundColor: '#FF8E8E'}]}>
                        <Text style={styles.textAlign}>{props.message}</Text>
                        <Text style={[styles.dateAlign, {fontSize: 10, color: 'grey'}]}>{props.date}</Text>
                    </View>
                )
            }
        </>
	);
}

const styles = StyleSheet.create({
    textAlign: {
        textAlign: 'left'
    },
    dateAlign: {
        textAlign: 'right'
    },
    post: {
        maxWidth: 250,
        borderRadius: 5,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginVertical: 5,
	}
});
