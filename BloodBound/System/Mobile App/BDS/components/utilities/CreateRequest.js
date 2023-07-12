import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View, ScrollView, TextInput, Pressable } from 'react-native';
import React from 'react';

export default function CreateRequest(props) {
    const [chosenDonationType, setChosenDonationType] = React.useState("Blood");
    const donationTypes = [{id: "Blood", title: "Blood"}, {id: "Plasma", title: "Plasma"}];
    const [chosenBloodTypes, setChosenBloodTypes] = React.useState([]);
    const bloodTypes = [{id: "O+", title: "O+"}, {id: "O-", title: "O-"}, {id: "A+", title: "A+"}, {id: "A-", title: "A-"}, {id: "B+", title: "B+"}, {id: "B-", title: "B-"}, {id: "AB+", title: "AB+"}, {id: "AB-", title: "AB-"}];
    const [location, setLocation] = React.useState("");
    const [day, setDay] = React.useState("");
    const [month, setMonth] = React.useState("");
    const [year, setYear] = React.useState("");
    const [hour, setHour] = React.useState("");
    const [minute, setMinute] = React.useState("");
    const [chosenTimeType, setChosenTimeType] = React.useState("AM");
    const [requiredBy, setRequiredBy] = React.useState(new Date(0));
    const timeTypes = [{id: "AM", title: "AM"}, {id: "PM", title: "PM"}];
    const [message, setMessage] = React.useState("");

    const Item = ({ item, onPress, backgroundColor, textColor }) => (
        <TouchableOpacity onPress={onPress} style={[styles.item, backgroundColor]}>
            <Text style={[styles.title, textColor]}>{item.title}</Text>
        </TouchableOpacity>
    );

    const renderDonation = ({ item }) => {
        const backgroundColor = item.id === chosenDonationType ? "#6e3b6e" : "#f9c2ff";
        const color = item.id === chosenDonationType ? 'white' : 'black';
        return (
            <Item
                item={item}
                onPress={() => setChosenDonationType(item.id)}
                backgroundColor={{ backgroundColor }}
                textColor={{ color }}
            />
        );
    };

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

    const renderTime = ({ item }) => {
        const backgroundColor = item.id === chosenTimeType ? "#6e3b6e" : "#f9c2ff";
        const color = item.id === chosenTimeType ? 'white' : 'black';
        return (
            <Item
                item={item}
                onPress={() => setChosenTimeType(item.id)}
                backgroundColor={{ backgroundColor }}
                textColor={{ color }}
            />
        );
    };

    const cleanUp = () => {
		setChosenBloodTypes([]);
        setLocation('');
        setDay('');
        setMonth('');
        setYear('');
        setHour('');
        setMinute('');
		setRequiredBy(new Date(0));
		setMessage("");
	}

	React.useEffect(() => !props.show && cleanUp(), [props.show]);

	React.useEffect(() => { //must be used because the update to requiredBy is async, so we submit once it is done
		let isComponentMounted = true;
		if (isComponentMounted) {
			if (+requiredBy > +(new Date(0)) ) { //if it is not in the default state
                console.log('i submit');
				props.onSubmit({
					bloodTypes: chosenBloodTypes,
					donationType: chosenDonationType,
					location,
					requiredBy,
					body: message,
					locationCoords: { type: 'Point', coordinates: [0, 0] },
				});
				props.setModalVisible(false);
			}
		}
		return () => {
			isComponentMounted = false;
		}
	}, [requiredBy])

	const onSubmit = () => {
        console.log(chosenBloodTypes)
		if (chosenBloodTypes.length == 0) {
			alert("Please add blood type(s).");
			return;
		}
		if (chosenDonationType == "Please select donation type") {
			alert("Please add donation type.");
			return;
		}
		if (!location) {
			alert("Please add location.");
			return;
		}
		if (!message) {
			alert("Please add message.");
			return;
		}
		if (!validateDate()) {
			alert("Please enter a correct date.");
			return;
		}
	};

	const padTime = (val) => {
		console.log(val, 'padding')
		if (val.length == 1) {
			return '0' + val;
		}
		return val;
	}

	const validateDate = () => {
        console.log('heeehh')
		try {
			let hour_new = String(Number(hour) % 12);

			if (Number(hour) > 12 || Number(hour) < 1) {
				return false;
			}
			if (chosenTimeType == 'PM') {
				hour_new = String(Number(hour_new) + 12)
			}
      
			const stringified = [year, month, day].map((thing) => padTime(thing)).join('-') + 'T' + [hour_new, minute].map(thing => padTime(thing)).join(':');
			console.log(stringified)
			const parsed = Date.parse(stringified);
			if (isNaN(parsed)) {
				return false;
			}
			const parsedDate = new Date(parsed);

			if ( +parsedDate - (+(new Date())) <= 0 ) { //this is lower than the current time value
				return false;
			}
			setRequiredBy(parsedDate);
			return true;
		} catch (error) {
			console.log(error)
			return false;
		}
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
                        <ScrollView>
                            <View>
                                <Text style={styles.header}>Please enter the details to required to create a donation request.</Text>
                                <FlatList
                                    data={donationTypes}
                                    renderItem={renderDonation}
                                    keyExtractor={(item) => item.id}
                                    extraData={chosenDonationType}
                                    horizontal={true}
                                />
                                <FlatList
                                    data={bloodTypes}
                                    renderItem={renderBlood}
                                    keyExtractor={(item) => item.id}
                                    extraData={chosenBloodTypes}
                                    horizontal={true}
                                />
                                <TextInput
                                    style={styles.input}
                                    onChangeText={setLocation}
                                    value={location}
                                    placeholder="Location"
                                />
                                <Text style={styles.dateSeparator}>Required By (Date and Time):</Text>
                                <TextInput
                                    style={styles.input}
                                    onChangeText={setDay}
                                    value={day}
                                    placeholder="Day"
                                />
                                <TextInput
                                    style={styles.input}
                                    onChangeText={setMonth}
                                    value={month}
                                    placeholder="Month"
                                />
                                <TextInput
                                    style={styles.input}
                                    onChangeText={setYear}
                                    value={year}
                                    placeholder="Year"
                                />
                                <TextInput
                                    style={styles.input}
                                    onChangeText={setHour}
                                    value={hour}
                                    placeholder="Hour"
                                />
                                <TextInput
                                    style={styles.input}
                                    onChangeText={setMinute}
                                    value={minute}
                                    placeholder="Minute"
                                />
                                <FlatList
                                    data={timeTypes}
                                    renderItem={renderTime}
                                    keyExtractor={(item) => item.id}
                                    extraData={chosenTimeType}
                                    horizontal={true}
                                />
                                <TextInput
                                    style={[styles.input, {marginTop: 10}]}
                                    onChangeText={setMessage}
                                    value={message}
                                    placeholder="Message"
                                />
                                <Pressable style={styles.submitButton} onPress={() => onSubmit()}>
                                    <Text style={styles.buttonText}>Create</Text>
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
        height: 40,
        borderWidth: 1,
        padding: 10,
        backgroundColor: 'white'
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
