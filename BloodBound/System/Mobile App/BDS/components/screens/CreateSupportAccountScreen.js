import { StatusBar } from 'expo-status-bar';
import { TextInput, Pressable, StyleSheet, Text, View, FlatList, TouchableOpacity, ScrollView, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { assistiveSignUp } from '../../actions/user';

export default function CreateSupportAccountScreen(props) {
	const [chosenBloodType, setChosenBloodType] = React.useState("");
    const BloodTypes = [{id: "O+", title: "O+"}, {id: "O-", title: "O-"}, {id: "A+", title: "A+"}, {id: "A-", title: "A-"}, {id: "B+", title: "B+"}, {id: "B-", title: "B-"}, {id: "AB+", title: "AB+"}, {id: "AB-", title: "AB-"}];
    const [username, setUsername] = React.useState("");
    const [firstName, setFirstName] = React.useState("");
    const [middleName, setMiddleName] = React.useState("");
    const [lastName, setLastName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [phoneNumber, setPhoneNumber] = React.useState("");
    const [cnic, setCnic] = React.useState("");
    const [cnicPhoto, setCnicPhoto] = React.useState("");
    const [livePhoto, setLivePhoto] = React.useState("");

    const [submit, setSubmit] = React.useState(false);

    const { accountsCreated } = useSelector((state) => state.user);

    const dispatch = useDispatch();

    // This function is used to check for gallery and storage permission and let user choose images from gallery.
    let openImagePickerAsync = async (photoType) => {
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            alert("Permission to access camera roll is required!");
            return;
        }
        let pickerResult = await ImagePicker.launchImageLibraryAsync({ base64: true, mediaTypes: ImagePicker.MediaTypeOptions.Images });
        if (pickerResult.cancelled === true) {
            return;
        }
        let { base64 } = pickerResult;
        base64 = 'data:image/jpeg;base64,' + base64;
        if (photoType === 'cnic') {
            setCnicPhoto(base64);
        } else if (photoType === 'selfie') {
            setLivePhoto(base64);
        } else {}
    }

    const Item = ({ item, onPress, backgroundColor, textColor }) => (
        <TouchableOpacity onPress={onPress} style={[styles.item, backgroundColor]}>
            <Text style={[styles.title, textColor]}>{item.title}</Text>
        </TouchableOpacity>
    );

    const renderBlood = ({ item }) => {
        const backgroundColor = item.id === chosenBloodType ? "#6e3b6e" : "#f9c2ff";
        const color = item.id === chosenBloodType ? 'white' : 'black';
        return (
            <Item
                item={item}
                onPress={() => setChosenBloodType(item.id)}
                backgroundColor={{ backgroundColor }}
                textColor={{ color }}
            />
        );
    };

    React.useEffect(() => {
        let isComponentMounted = true;

        if (submit) {
            const { user, allowed } = convertUser();
            if (allowed) {
                dispatch(assistiveSignUp(user, accountsCreated))
                .then(res => {
                    if (isComponentMounted) {
                        cleanUp();
                        if (res.data?.errorMessage?.other){
                            alert(res.data.errorMessage.other);
                        } else if (res.data?.errorMessage) {
                            console.log(res.data.errorMessage)
                            // setErrorMessages({ ...errorMessages, ...res.data.errorMessage });
                        } else {
                            alert("Account created!");
                            // props.onHide();
                            // props.setId(res.data._id);
                            // props.setModalVerify(true);
                        }
                    }
                })
                .catch(error => console.log(error))
                .then(() => setSubmit(false))
            } else {
                setSubmit(false);
            }
        }

        return () => {
            isComponentMounted = false;
        }
    }, [submit])

    const convertUser = () => {
        const retVal = {allowed: false}
        if (username == "") {
            alert("Please choose a username.")
            return retVal;
        }
        if (firstName == "") {
            alert("Please enter your first name.")
            return retVal;
        }
        if (lastName == "") {
            alert("Please enter your last name.")
            return retVal;
        }
        if (email == "" && phoneNumber == "") {
            alert("Please enter at least an email or a phone number (or both).")
            return retVal;
        }
        if (chosenBloodType == "") {
            alert("Please select your blood type.")
            return retVal;
        }
        if (cnic == "") {
            alert("Please enter your cnic number.")
            return retVal;
        }
        if (isNaN(Number(cnic))) {
            alert("Please enter a proper cnic number.")
            return retVal;
        }
        if (cnicPhoto == "") {
            alert("Please upload a photo of your cnic.")
            return retVal;
        }
        if (livePhoto == "") {
            alert("Please upload a live photo.")
            return retVal;
        }
        const user = { username, firstName, middleName, lastName, userType: 'Customer_Support', email: (email != "" ? email: null), phoneNumber: (phoneNumber != "" ? phoneNumber : null), bloodType: chosenBloodType, cnic, cnicPhoto, livePhoto };
        return { allowed: true, user }
    }

    const onSubmit = () => {
        if (!submit) {
            console.log('submit');
            setSubmit(true);
        }
        console.log("Submitted")
    }

    const cleanUp = () => {
        setUsername('');
        setEmail('');
        setPhoneNumber('');
        setCnicPhoto('');
        setCnic('');
        setLivePhoto('');
        setFirstName('');
        setLastName('');
        setMiddleName('');
    }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor='pink'/>
            <ScrollView>
                <View style={styles.logInForm}>
                        <Text style={{left: 12}}>Please enter the details necessary to create a new Support account.</Text>
                        <FlatList
                            data={BloodTypes}
                            renderItem={renderBlood}
                            keyExtractor={(item) => item.id}
                            extraData={chosenBloodType}
                            horizontal={true}
                        />
                        <TextInput
                            style={styles.input}
                            onChangeText={setUsername}
                            value={username}
                            placeholder="Username"
                        />
                        <TextInput
                            style={styles.input}
                            onChangeText={setFirstName}
                            value={firstName}
                            placeholder="First Name"
                        />
                        <TextInput
                            style={styles.input}
                            onChangeText={setMiddleName}
                            value={middleName}
                            placeholder="Middle Name"
                        />
                        <TextInput
                            style={styles.input}
                            onChangeText={setLastName}
                            value={lastName}
                            placeholder="Last Name"
                        />
                        <TextInput
                            style={styles.input}
                            onChangeText={setEmail}
                            value={email}
                            placeholder="Email"
                        />
                        <TextInput
                            style={styles.input}
                            onChangeText={setPhoneNumber}
                            value={phoneNumber}
                            placeholder="Phone Number"
                            keyboardType='numeric'
                        />
                        <TextInput
                            style={styles.input}
                            onChangeText={setCnic}
                            value={cnic}
                            placeholder="CNIC"
                            keyboardType='numeric'
                        />
                        <Pressable style={[styles.uploadButton, { backgroundColor: '#FF0083'}]} onPress={() => openImagePickerAsync('cnic')}>
                            {
                                cnicPhoto !== '' && <Image source={{uri: cnicPhoto}} style={styles.thumbnail} />
                            }
                            <Text style={styles.buttonText}>Upload Photo of CNIC</Text>
                        </Pressable>
                        <Pressable style={[styles.uploadButton, { backgroundColor: '#FF00DD'}]} onPress={() => openImagePickerAsync('selfie')}>
                            {
                                livePhoto !== '' && <Image source={{uri: livePhoto}} style={styles.thumbnail} />
                            }
                            <Text style={styles.buttonText}>Upload Passport Photo of Support Person</Text>
                        </Pressable>
                        {/* The non-functioning Pressables below are for padding. DO NOT REMOVE. */}
                        <Pressable style={styles.submitButton}/>
                </View>
            </ScrollView>
            <View style={styles.bottomButtons}>
                <Pressable style={styles.submitButton} onPress={() => onSubmit()}>
                    <Text style={styles.buttonText}>Submit</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
	backgroundImage: {
		height: '100%',
		width: '100%',
	},
    backIcon: {
		position: 'absolute',
		height: 100,
		width: 100,
		top: 5,
        left: 5,
        overlayColor: 'black'
	},
	bottomButtons: {
		position: 'absolute',
		alignSelf: 'center',
		width: '100%'
	},
	buttonText: {
		top:15,
		fontSize: 16,
		alignSelf:'center'
	},
	container: {
		flex: 1,
		justifyContent: 'flex-end',
		alignItems: 'center',
        backgroundColor: 'pink'
	},
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        backgroundColor: 'white'
    },
    logInForm: {
        flex: 1,
		top: 5,
        alignSelf: 'stretch'
	},
    logo: {
		position: 'absolute',
		height: '40%',
		width: '40%',
		top: 40,
		resizeMode: 'contain'
	},
	submitButton: {
		alignSelf: 'center',
		height: 50,
		width: '100%',
		backgroundColor: 'red'
	},
    item: {
        padding: 20,
        marginVertical: 5,
        borderWidth: 2
    },
    title: {
        fontSize: 16,
    },
    thumbnail: {
        top: '25%',
        left: 5,
        width: 25,
        height: 25,
        // resizeMode: 'contain',
        position: 'absolute'
    },
    uploadButton: {
		alignSelf: 'center',
		height: 50,
		width: '100%'
    },
});
