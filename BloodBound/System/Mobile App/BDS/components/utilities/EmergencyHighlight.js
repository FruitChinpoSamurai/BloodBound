import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View, ScrollView, TextInput, Pressable } from 'react-native';
import React from 'react';

import { parseDate } from '../../utils/utils';

import { useSelector, useDispatch } from 'react-redux';

import { getEmergencyPosts } from '../../actions/emergencyPosts';

export default function EmergencyHighlight(props) {
    const [modalDisplayMap, setModalDisplayMap] = React.useState(false);

    const ePosts = useSelector((state) => state.emergencyPosts);

    const dispatch = useDispatch();

    React.useEffect(() => dispatch(getEmergencyPosts()), []);

    const DrawBanner = ({ locations, body, created, bloodTypes }) => (
        <View style={styles.banner}>
            <Text>
                <Text>Location(s): </Text><Text style={styles.locationText}>{locations}</Text>
            </Text>
            <Text>
                <Text>Blood Type(s): </Text><Text>{bloodTypes.join(',')}</Text>
            </Text>
            <Text style={{marginVertical: 10}}>{body}</Text>
            <Text style={{textAlign: 'right', fontSize: 11}}>{parseDate(created)}</Text>
        </View>
    );

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
                        {
                            (ePosts.length > 0) ?
                            <View>
                                <View style={styles.headerArea}>
                                    <Text style={styles.headerText}>EMERGENCIES</Text>
                                </View>
                                <View style={{marginTop: 30}}>
                                    <FlatList 
                                        data={ePosts}
                                        renderItem={({ item }) => DrawBanner(item) }
                                        keyExtractor={item => item._id}
                                    />
                                </View>
                            </View>
                            :
                            <View style={styles.noBanner}>
                                <Text style={styles.noBannerText}>Good news!</Text>
                                <Text style={styles.noBannerText}>There are no emergencies at the moment.</Text>
                            </View>
                        }
                    </View>
                </TouchableWithoutFeedback>
            </TouchableOpacity> 
        </Modal>
	);
}

const styles = StyleSheet.create({
    banner: {
        marginVertical: 5,
        borderRadius: 15,
        backgroundColor: '#F0E68C',
        padding: 10
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#00000080'
    },
    headerArea: {
        position: 'absolute',
        width: '100%'
    },
    headerText: {
        fontSize: 16,
        textAlign: 'center',
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
    noBanner: {
        backgroundColor: '#7CFC00',
        borderRadius: 15,
        padding: 15
    },
    noBannerText: {
        textAlign: 'center',
    },
    locationText: {
        color: 'red'
    },
  });
