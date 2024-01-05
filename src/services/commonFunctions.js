import * as FileSystem from 'expo-file-system';
import React, { useState } from 'react';
import { Modal, Image, TouchableOpacity, StyleSheet, View } from 'react-native';

const saveFile = async (fileUri, fileName) => {
    try {
        const fileUriParts = fileUri.split('.');
        const fileExtension = fileUriParts[fileUriParts.length - 1];
        const newFileName = `${fileName}.${fileExtension}`;
        const destinationUri = FileSystem.documentDirectory + newFileName;

        await FileSystem.copyAsync({ from: fileUri, to: destinationUri });

        console.log('File saved successfully:', destinationUri);
    } catch (error) {
        console.log('Error saving file:', error);
    }
};

const fullScreenImage = ({ imageUrl }) => {
    const [modalVisible, setModalVisible] = useState(false);

    const handleImagePress = () => {
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handleImagePress}>
                <Image style={styles.thumbnail} source={{ uri: imageUrl }} />
            </TouchableOpacity>
            <Modal visible={modalVisible} transparent={true}>
                <TouchableOpacity style={styles.modalContainer} onPress={handleCloseModal}>
                    <Image style={styles.fullImage} source={{ uri: imageUrl }} />
                </TouchableOpacity>
            </Modal>
        </View>
    );
};



const CommonFunctions = {
    saveFile,
    fullScreenImage
}

export default CommonFunctions


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    thumbnail: {
        width: 100,
        height: 100,
        resizeMode: 'cover',
    },
    modalContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'black',
    },
    fullImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
});