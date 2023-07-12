import { StatusBar } from 'expo-status-bar';
import { TextInput, Pressable, StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { createEmergencyPost } from '../../actions/emergencyPosts';

export default function CreateEmergencyHighlight(props) {
	const [chosenBloodTypes, setChosenBloodTypes] = React.useState([]);
    const BloodTypes = [{id: "O+", title: "O+"}, {id: "O-", title: "O-"}, {id: "A+", title: "A+"}, {id: "A-", title: "A-"}, {id: "B+", title: "B+"}, {id: "B-", title: "B-"}, {id: "AB+", title: "AB+"}, {id: "AB-", title: "AB-"}];
    const [locations, setLocations] = React.useState("");
    const [body, setBody] = React.useState("");
	const [submitted, setSubmitted] = React.useState(false);

	const user = useSelector((state) => state.user);

	const dispatch = useDispatch();

	const onSubmit = () => {
		if (chosenBloodTypes.length == 0) {
			alert("Please add blood type(s).");
			return;
		}
		if (!locations) {
			alert("Please add location(s).");
			return;
		}
		if (!body) {
			alert("Please add a message.");
			return;
		}
		setSubmitted(true);
	}

	const cleanUp = () => {
		setSubmitted(false);
		setChosenBloodTypes([]);
		setLocations('');
		setBody('');
		alert('done')
	}

    const Item = ({ item, onPress, backgroundColor, textColor }) => (
        <TouchableOpacity onPress={onPress} style={[styles.item, backgroundColor]}>
            <Text style={[styles.title, textColor]}>{item.title}</Text>
        </TouchableOpacity>
    );

	const onCheckboxCheck = (item) => {
		const index = chosenBloodTypes.indexOf(item);
		if (index !== -1) {
			chosenBloodTypes.splice(index, 1);
			setChosenBloodTypes([...chosenBloodTypes]);
		} else {
			chosenBloodTypes.push(item);
			setChosenBloodTypes([...chosenBloodTypes]);
		}
	};

    const renderBlood = ({ item }) => {
        const backgroundColor = chosenBloodTypes.includes(item.id) ? "#6e3b6e" : "#f9c2ff";
        const color = chosenBloodTypes.includes(item.id) ? 'white' : 'black';
        return (
            <Item
                item={item}
                onPress={() => onCheckboxCheck(item.id)}
                backgroundColor={{ backgroundColor }}
                textColor={{ color }}
            />
        );
    };

	React.useEffect(() => submitted && dispatch(createEmergencyPost({
		username: user.username,
		created: new Date(),
		bloodTypes: chosenBloodTypes,
		locations,
		body,
		locationCoords: { type: 'Point', coordinates: [0, 0] },
	}, user)).then(() => cleanUp()), [submitted]);

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor='pink'/>
			<View>
					<FlatList
						data={BloodTypes}
						renderItem={renderBlood}
						keyExtractor={(item) => item.id}
						extraData={chosenBloodTypes}
						horizontal={true}
					/>
					<TextInput
						style={[styles.input, {height: 40}]}
						onChangeText={setLocations}
						value={locations}
						placeholder="Locations"
					/>
					<TextInput
						style={styles.input}
      					maxLength={512}
						multiline
						numberOfLines={10}
						onChangeText={setBody}
						value={body}
						placeholder="Type out message for the emergency banner"
					/>
			</View>
            <View style={styles.bottomButtons}>
                <Pressable style={styles.submitButton} onPress={() => onSubmit()}>
                    <Text style={styles.buttonText}>Submit</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
	bottomButtons: {
		position: 'absolute',
		width: '100%',
		bottom: 0
	},
	buttonText: {
		top:15,
		fontSize: 16,
		alignSelf:'center'
	},
	container: {
		flex: 1,
        backgroundColor: 'pink'
	},
    input: {
        margin: 12,
        borderWidth: 1,
        padding: 10,
        backgroundColor: 'white',
		textAlignVertical: 'top'
    },
	submitButton: {
		alignSelf: 'center',
		height: 50,
		width: '100%',
		backgroundColor: 'red'
	},
    item: {
		marginTop: 15,
        padding: 5,
        borderWidth: 2,
		height: 35,
    },
    title: {
        fontSize: 16,
    }
});
