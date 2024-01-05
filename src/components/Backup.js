import { Alert, Dimensions, Pressable, StyleSheet, View } from "react-native"
import { Divider, IconButton, Text } from "react-native-paper";
import Transaction from "../services/transaction";
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import { ActivityIndicator } from 'react-native-paper';
import { useState } from "react";
import JSZip, { file } from 'jszip';


const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width

const Backup = () => {
    const [isLoading, setIsLoading] = useState(false);

    const saveJsonToFile = async (jsonData) => {
        try {
            const fileUri = `${FileSystem.documentDirectory}data.json`;
            await FileSystem.writeAsStringAsync(fileUri, jsonData);
            return fileUri;
        } catch (error) {
            console.error(error);
        }
    };

    const shareJsonFile = async (fileUri) => {
        try {
            await Sharing.shareAsync(fileUri);
        } catch (error) {
            console.error(error);
        }
    };

    const uploadJsonFile = async () => {
        try {
            setIsLoading(true);
            const file = await DocumentPicker.getDocumentAsync({ type: 'application/json' });
            if (file.type === 'success') {
                const fileUri = file.uri;
                const fileContent = await FileSystem.readAsStringAsync(fileUri);
                const jsonData = JSON.parse(fileContent);
                // console.log(jsonData);

                await Transaction.restoreDb(jsonData);
                // Perform further operations with the JSON data

                Alert.alert(
                    "Success",
                    "Data restored successfully",
                    [
                        {
                            text: "Okay",
                            style: "cancel"
                        },

                    ]
                );

            }
        } catch (error) {
            console.error(error);
        }
        setIsLoading(false);
    };

    const backupDb = async () => {
        setIsLoading(true);
        const tables = await Transaction.getTableNames();

        var tableData = {};
        for (let i = 0; i < tables.length; i++) {
            const tableName = tables[i];
            const data = await Transaction.getAllData(tableName);
            tableData[tableName] = data;
        }
        const jsonData = JSON.stringify(tableData);
        const fileUri = await saveJsonToFile(jsonData);
        await shareJsonFile(fileUri);
        setIsLoading(false);

    }

    const backupDbImages = async () => {
        setIsLoading(true);
        try {
            const imageDirectory = `${FileSystem.documentDirectory}`;
            const fileNames = await FileSystem.readDirectoryAsync(imageDirectory);
            // Handle the image files here

            const imageFiles = fileNames.filter((fileName) => {
                const extension = fileName.split('.').pop().toLowerCase();
                return ['jpg', 'jpeg', 'png', 'gif'].includes(extension);
            });

            const zip = new JSZip();

            for (const imageFile of imageFiles) {
                const imagePath = `${FileSystem.documentDirectory}${imageFile}`;
                const fileInfo = await FileSystem.getInfoAsync(imagePath);


                if (fileInfo.exists) {
                    const imageContent = await FileSystem.readAsStringAsync(imagePath, {
                        encoding: FileSystem.EncodingType.Base64,
                    });

                    zip.file(imageFile, imageContent, { base64: true });
                }
            }
            const zipContent = await zip.generateAsync({ type: 'base64' });
            // Save the ZIP file to the cache directory
            const cacheDirectory = `${FileSystem.cacheDirectory}backup.zip`;
            await FileSystem.writeAsStringAsync(cacheDirectory, zipContent, {
                encoding: FileSystem.EncodingType.Base64,
            });
            // Share the ZIP file from the cache directory
            await Sharing.shareAsync(cacheDirectory);
        } catch (error) {
            console.log('Error reading image directory:', error);
            console.log('Error details:', error.message); // Log the error message for more details
            console.log('Error stack trace:', error.stack);
        }
        setIsLoading(false);
    }

    const restoreDb = () => {
        Alert.alert(
            "Confirm",
            "This action will wipe out your previous data. If you want to continue click on Okay to confirm delete",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Okay",
                    onPress: () => { uploadJsonFile(); },
                    style: "cancel"
                },

            ]
        );


    }

    const restoreDbImages = async () => {
        setIsLoading(true);
        try {
            // Select the zip file using the document picker
            const file = await DocumentPicker.getDocumentAsync({ type: 'application/zip' });

            if (file.type !== 'success') {
                console.log('No file selected');
                return;
            }

            const zipContent = await FileSystem.readAsStringAsync(file.uri, {
                encoding: FileSystem.EncodingType.Base64,
            });

            const zip = await JSZip.loadAsync(zipContent, { base64: true });

            const imageDirectory = `${FileSystem.documentDirectory}`;


            // Extract and save each image file from the zip
            await Promise.all(
                Object.keys(zip.files).map(async (filename) => {
                    const file = zip.files[filename];

                    // Skip directories
                    if (file.dir) return;

                    // Check if the image file already exists
                    const imageFilePath = `${imageDirectory}${filename}`;
                    const imageFileExists = await FileSystem.getInfoAsync(imageFilePath);

                    if (imageFileExists.exists) {
                        // If the file already exists, overwrite it
                        await FileSystem.deleteAsync(imageFilePath);
                    }

                    // Extract the image file
                    const extractedImage = await file.async('base64');

                    // Save the image file to the restored image directory
                    await FileSystem.writeAsStringAsync(imageFilePath, extractedImage, {
                        encoding: FileSystem.EncodingType.Base64,
                    });
                })
            );


            Alert.alert(
                "Success",
                "Images restored successfully",
                [
                    {
                        text: "Okay",
                        style: "cancel"
                    },

                ]
            );



            console.log('Images restored successfully');
        } catch (error) {
            console.log('Error restoring images:', error);
        }


        setIsLoading(false);
    }

    return (
        <View style={{ height: DeviceHeight, backgroundColor: 'white' }}>
            <Pressable onPress={() => { backupDb() }}>
                <View style={styles.top_container}></View>
                <View style={{ flexDirection: 'row' }}>
                    <IconButton
                        icon="cloud-upload"
                        iconColor={'purple'}
                        size={40}
                    />
                    <Text style={{ fontSize: 40, marginTop: 10 }}>Backup Data</Text>
                </View>
                <Divider />
            </Pressable>
            <Pressable onPress={() => { backupDbImages() }}>
                <View style={styles.top_container}></View>
                <View style={{ flexDirection: 'row' }}>
                    <IconButton
                        icon="cloud-upload"
                        iconColor={'purple'}
                        size={40}
                    />
                    <Text style={{ fontSize: 40, marginTop: 10 }}>Backup Images</Text>
                </View>
                <Divider />
            </Pressable>


            <Pressable onPress={() => { restoreDb() }}>
                <View style={styles.top_container}></View>
                <View style={{ flexDirection: 'row' }}>
                    <IconButton
                        icon="cloud-download"
                        iconColor={'purple'}
                        size={40}
                    />
                    <Text style={{ fontSize: 40, marginTop: 10 }}>Restore</Text>
                </View>
                <Divider />
            </Pressable>

            <Pressable onPress={() => { restoreDbImages() }}>
                <View style={styles.top_container}></View>
                <View style={{ flexDirection: 'row' }}>
                    <IconButton
                        icon="cloud-download"
                        iconColor={'purple'}
                        size={40}
                    />
                    <Text style={{ fontSize: 40, marginTop: 10 }}>Restore Images</Text>
                </View>
                <Divider />
            </Pressable>


            {isLoading && (
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    }}
                >
                    <ActivityIndicator size="large" color="#ffffff" />
                </View>
            )}
        </View>
    )
}


export default Backup


const styles = StyleSheet.create({
    top_container: {
        paddingTop: 10,
    },
    flexrow_container: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    cell: {
        backgroundColor: "#ebedf0",
        height: DeviceWidth * 0.3,
        width: DeviceWidth * 0.3,
        margin: 5,
        flexGrow: 1,
        alignContent: 'center',
        alignItems: 'center',
    },
    text: {
        alignContent: 'center',
    },
    icon: {
        marginTop: 20,

    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    buttonClose: {
        backgroundColor: "blue",
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
});