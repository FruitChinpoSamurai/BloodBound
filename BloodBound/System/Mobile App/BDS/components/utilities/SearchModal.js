import { Modal, Pressable, StyleSheet, View, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import React from 'react';

export default function SearchModal(props) {
    const [searchTerm, setSearchTerm] = React.useState('');

    const onSubmit = () => {
        props.setSearchParams((params) => ({ ...params, filters: searchTerm, page: 1, limit: 10 }));
        setSearchTerm('');
        props.setModalVisible(false);
    }

	return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={props.modalVisible}
            onRequestClose={() => {
                props.setModalVisible(!props.modalVisible);
            }}
        >
            <TouchableOpacity 
                style={styles.centeredView} 
                activeOpacity={1} 
                onPressOut={() => props.setModalVisible(!props.modalVisible)}
            >
                <TouchableWithoutFeedback>
                    <View style={styles.modalView}>
                        <TextInput
                            style={styles.input}
                            onChangeText={setSearchTerm}
                            value={searchTerm}
                            placeholder="Search"
                        />
                        <Pressable style={styles.submitButton} onPress={() => onSubmit()}>
                            <Text style={styles.buttonText}>Find</Text>
                        </Pressable>
                    </View>
                </TouchableWithoutFeedback>
            </TouchableOpacity> 
        </Modal>
	);
}

const styles = StyleSheet.create({
    submitButton: {
		alignSelf: 'center',
		height: 40,
		width: 60,
		backgroundColor: 'red',
        borderRadius: 5,
	},
    buttonText: {
		fontSize: 16,
		textAlign: 'center',
        color: 'white',
        paddingTop: 8
	},
	container: {
		flex: 1,
        backgroundColor: 'pink'
	},
    input: {
        height: 40,
        width: 250,
        margin: 6,
        borderWidth: 1,
        padding: 10,
        backgroundColor: 'white'
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#00000080'
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 10,
        padding: 15,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        flexDirection: 'row'
    }
});
