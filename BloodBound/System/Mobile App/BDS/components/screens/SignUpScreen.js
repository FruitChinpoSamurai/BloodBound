import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { TextInput, Pressable, StyleSheet, Text, View, FlatList, TouchableOpacity, ScrollView, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import VerifyAccount from '../utilities/VerifyAccount';

import * as api from '../../api';

export default function SignUpScreen(props) {
    const [modalVisible, setModalVisible] = React.useState(false);
    const [chosenAccountType, setChosenAccountType] = React.useState('Blood_Requester');
    const [userTypeChosen, setUserTypeChosen] = React.useState(false);
    const AccountTypes = [{id: "Blood_Requester", title: "Blood Requester"}, {id: "Blood_Donor", title: "Blood Donor"}, {id: "NGO_Worker", title: "NGO Worker"}, {id: "MI_Worker", title: "Medical Institution Worker"}];
    const [chosenBloodType, setChosenBloodType] = React.useState("");
    const BloodTypes = [{id: "O+", title: "O+"}, {id: "O-", title: "O-"}, {id: "A+", title: "A+"}, {id: "A-", title: "A-"}, {id: "B+", title: "B+"}, {id: "B-", title: "B-"}, {id: "AB+", title: "AB+"}, {id: "AB-", title: "AB-"}];
    //for all account types
    const [username, setUsername] = React.useState("");
    const [firstName, setFirstName] = React.useState("");
    const [middleName, setMiddleName] = React.useState("");
    const [lastName, setLastName] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [confirmedpassword, setConfirmedpassword] = React.useState("");
    //either or both email or phonenumber can be taken
    const [email, setEmail] = React.useState("");
    const [phoneNumber, setPhoneNumber] = React.useState("");
    const [cnic, setCnic] = React.useState("");
    const [cnicPhoto, setCnicPhoto] = React.useState("");
    const [livePhoto, setLivePhoto] = React.useState("");
    //manadatory for type = NGO/MIW 
    const [verificationDocs, setVerificationDocs] = React.useState([""]);
    const [docCounter, setDocCounter] = React.useState([""]);

    const [submit, setSubmit] = React.useState(false);

    const [id, setId] = React.useState("");
    const [modalVerify, setModalVerify] = React.useState(false);

    const uploadFile = (base64, index) => {
        setVerificationDocs([...verificationDocs.slice(0, index), base64, ...verificationDocs.slice(index + 1)]);
    }

    // This function is used to check for gallery and storage permission and let user choose images from gallery.
    let openImagePickerAsync = async (photoType, index) => {
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
        } else {
            uploadFile(base64, index);
        }
    }

    const Item = ({ item, onPress, backgroundColor, textColor }) => (
        <TouchableOpacity onPress={onPress} style={[styles.item, backgroundColor]}>
            <Text style={[styles.title, textColor]}>{item.title}</Text>
        </TouchableOpacity>
    );

    const renderAccount = ({ item }) => {
        const backgroundColor = item.id === chosenAccountType ? "#6e3b6e" : "#f9c2ff";
        const color = item.id === chosenAccountType ? 'white' : 'black';
        return (
            <Item
                item={item}
                onPress={() => {setChosenAccountType(item.id); setUserTypeChosen(true);}}
                backgroundColor={{ backgroundColor }}
                textColor={{ color }}
            />
        );
    };

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

    const onPlus = () => {
        if (docCounter.length < 5) {
            setDocCounter([...docCounter, 1]);
            setVerificationDocs([...verificationDocs, ""]);
        }
    }

    const onMinus = () => {
        const length = docCounter.length;
        if (length > 1) {
            setDocCounter([...docCounter.slice(0, length - 1)]);
            setVerificationDocs([...verificationDocs.slice(0, length - 1)]);
        }
    }

    const DocCounter = () => (
        <View>
            <Pressable style={styles.submitButton} onPress={() => onPlus()}>
                <Text style={styles.buttonText}>
                    Add Photos (+)
                </Text>
            </Pressable>
            <Pressable style={styles.submitButton} onPress={() => onMinus()}>
                <Text style={styles.buttonText}>
                    Reduce Photos (-)
                </Text>
            </Pressable>
        </View>
    )

    const VerificationImages = () => (
        <View>
            {/* <Text>
                {chosenAccountType == "Blood_Donor" ? `Documents Showing the last time you donated blood (if any)` : `Photos of documents to prove that you belong to an NGO/Medical Institution.`}
            </Text> */}
            <DocCounter/>
            {
                docCounter.map((num, index) => (
                    <Pressable key={index} style={[styles.uploadButton, { backgroundColor: '#D600FF'}]} onPress={() => openImagePickerAsync('docs', index)}>
                        {
                            verificationDocs[index] != '' && <Image source={{uri: verificationDocs[index]}} style={styles.thumbnail} />
                        }
                        <Text style={styles.buttonText}>Upload Photos of Documents For Verification</Text>
                    </Pressable>
                ))
            }
        </View>
    )

    React.useEffect(() => {
        let isComponentMounted = true;

        if (submit) {
            const { user, allowed } = convertUser();
            if (allowed) {
                api.signUp(user)
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
                            setId(res.data._id);
                            setModalVerify(true);
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
        if (!userTypeChosen) {
            alert("Please select your user type.")
            return retVal;
        }
        if (password == "") {
            alert("Please enter your password.")
            return retVal;
        }
        if (confirmedpassword == "") {
            alert("Please confirm your password.")
            return retVal;
        }
        if ((confirmedpassword != password)) {
            alert("The password and confirmed password do not match.")
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
        if ( (chosenAccountType == "NGO_Worker" || chosenAccountType == "MI_Worker") && verificationDocs.filter(doc => doc != "").length == 0 ) {
            alert("Please upload verification documents.")
            return retVal;
        }
        const user = { username, firstName, middleName, lastName, userType: chosenAccountType, password, email: (email != "" ? email: null), phoneNumber: (phoneNumber != "" ? phoneNumber : null), bloodType: chosenBloodType, cnic, cnicPhoto, livePhoto, verificationDocs: verificationDocs.filter(doc => doc != "") };
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
        setConfirmedpassword('');
        setPassword('');
        setEmail('');
        setPhoneNumber('');
        setCnicPhoto('');
        setCnic('');
        setVerificationDocs(['']);
        setDocCounter(['']);
        setLivePhoto('');
        setFirstName('');
        setLastName('');
        setMiddleName('');
        setUserTypeChosen(false);
    }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor='pink'/>
            <ScrollView>
                <View style={styles.logInForm}>
                        <Text style={{left: 12}}>Please enter your details to create an account.</Text>
                        <FlatList
                            data={AccountTypes}
                            renderItem={renderAccount}
                            keyExtractor={(item) => item.id}
                            extraData={chosenAccountType}
                            horizontal={true}
                        />
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
                            onChangeText={setPassword}
                            value={password}
                            placeholder="Password"
                            secureTextEntry={true}
                        />
                        <TextInput
                            style={styles.input}
                            onChangeText={setConfirmedpassword}
                            value={confirmedpassword}
                            placeholder="Confirm Password"
                            secureTextEntry={true}
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
                            <Text style={styles.buttonText}>Upload Passport Photo of Yourself</Text>
                        </Pressable>
                        {
                            (chosenAccountType != 'Blood_Requester') &&
                            <VerificationImages/>
                        }
                        {/* The non-functioning Pressables below are for padding. DO NOT REMOVE. */}
                        <Pressable style={styles.submitButton}/><Pressable style={styles.submitButton}/>
                </View>
            </ScrollView>
            <View style={styles.bottomButtons}>
                <Pressable style={styles.submitButton} onPress={() => onSubmit()}>
                    <Text style={styles.buttonText}>Submit</Text>
                </Pressable>
            </View>
            {
                id != "" && <VerifyAccount
                    modalVisible={modalVerify}
                    setModalVisible={setModalVerify}
                    id = {id}
                />
            }
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
        top: '5%',
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
