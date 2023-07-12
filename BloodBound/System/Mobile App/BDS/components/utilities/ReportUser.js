import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View, ScrollView, TextInput, Pressable } from 'react-native';

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { createReport } from '../../actions/user';

export default function ReportUser(props) {
    const [chosenReason, setChosenReason] = React.useState("Please select a reason");
    const reasons = [{id: "Abuse", title: "Abuse"}, {id: "Harassment", title: "Harassment"}, {id: "Suspicious Activity", title: "Suspicious Activity"}, {id: "Spam", title: "Spam"}];
    const [body, setBody] = React.useState("");

    const { username } = useSelector((state) => state.user);

    const dispatch = useDispatch();

    const reportPost = (report) => {
        console.log(report);
		dispatch(createReport(report));
    }

	const onSubmit = () => {
		console.log(chosenReason)
		if (!chosenReason || chosenReason == 'Please select a reason') {
			alert('Please select a reason');
			return;
		}
		if (!body) {
			alert('Please add an explanation');
			return;
		}
		reportPost({ reason: chosenReason, body, culprit: props.username, snitch: username });
		props.setModalVisible(false);
	}

    const Item = ({ item, onPress, backgroundColor, textColor }) => (
        <TouchableOpacity onPress={onPress} style={[styles.item, backgroundColor]}>
            <Text style={[styles.title, textColor]}>{item.title}</Text>
        </TouchableOpacity>
    );

    const renderReason = ({ item }) => {
        const backgroundColor = item.id === chosenReason ? "#6e3b6e" : "#f9c2ff";
        const color = item.id === chosenReason ? 'white' : 'black';
        return (
            <Item
                item={item}
                onPress={() => setChosenReason(item.id)}
                backgroundColor={{ backgroundColor }}
                textColor={{ color }}
            />
        );
    };

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
                        <ScrollView>
                            <View>
                                <Text style={styles.header}>Please justify the report.</Text>
                                <FlatList
                                    data={reasons}
                                    renderItem={renderReason}
                                    keyExtractor={(item) => item.id}
                                    extraData={chosenReason}
                                    horizontal={true}
                                />
                                <TextInput
                                    style={styles.input}
                                    maxLength={512}
                                    multiline
                                    numberOfLines={10}
                                    onChangeText={setBody}
                                    value={body}
                                    placeholder="Please enter details here"
                                />
                                <Pressable style={styles.submitButton} onPress={() => onSubmit()}>
                                    <Text style={styles.buttonText}>Submit</Text>
                                </Pressable>
                            </View>
                        </ScrollView>
                    </View>
                </TouchableWithoutFeedback>
            </TouchableOpacity> 
        </Modal>
	);
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#00000080'
    },
    header: {
        fontSize: 16,
        marginBottom: 15
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
    },
    item: {
        padding: 5,
        marginVertical: 5,
        borderWidth: 2,
    },
    title: {
        fontSize: 16,
    },
    input: {
        marginTop: 5,
        borderWidth: 1,
        padding: 10,
        backgroundColor: 'white',
		textAlignVertical: 'top'
    },
    submitButton: {
		alignSelf: 'center',
		height: 50,
		width: '100%',
		backgroundColor: 'red',
        borderRadius: 5,
        marginTop: 15
	},
    buttonText: {
		top:15,
		fontSize: 16,
		alignSelf:'center'
	},
    dateSeparator: {
        marginTop: 15
    }
  });
