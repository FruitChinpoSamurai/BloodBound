import { Image, Modal, StyleSheet, View, Dimensions, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import React from 'react';
import ImageZoom from 'react-native-image-pan-zoom';

export default function EnlargeImage(props) {
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
                        <View>
                            <ImageZoom cropWidth={Dimensions.get('window').width}
                                    cropHeight={Dimensions.get('window').height}
                                    imageWidth={200}
                                    imageHeight={200}>
                                <Image style={{width:200, height:200}} source={{uri: props.image}}/>
                            </ImageZoom>
                            <TouchableOpacity activeOpacity={0.5} style={styles.scrollViewButton} onPress={() => props.setModalVisible(!props.modalVisible)} >
                                    <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/74/74673.png' }} style={styles.upAddButtonImageStyle} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </TouchableOpacity> 
        </Modal>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
        backgroundColor: 'pink'
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
    },
    scrollViewButton: {
		position: 'absolute',
		width: 50,
		height: 50,
		alignItems: 'center',
		justifyContent: 'center',
		right: 25,
        top: 25
	},
	upAddButtonImageStyle: {
		resizeMode: 'contain',
		width: 30,
		height: 30,
	},
});
