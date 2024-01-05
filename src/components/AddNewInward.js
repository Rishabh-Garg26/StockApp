import React, { useState } from "react";
import { Button, Text, TextInput, IconButton } from "react-native-paper"
import { Alert, Pressable, ScrollView, StyleSheet, TouchableOpacity, View, Image } from "react-native"
import Transaction from "../services/transaction";
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { Icon } from "@rneui/themed";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
// import { saveFile } from '../services/commonFunctions'




const AddNewInward = () => {

    const [showReceivedDate, setShowReceivedDate] = useState(false);
    const [receivedDate, setReceivedDate] = useState(null);
    const [recievedDatePick, setReceivedDatePick] = useState(false);
    const [showPaymentDate, setShowPaymentDate] = useState(false);
    const [paymentDatePick, setPaymentDatePick] = useState(false);
    const [paymentDate, setPaymentDate] = useState(null);
    const [lotnumber, setLotNumber] = useState('');
    const [location, setLocation] = useState('');
    const [item, setItem] = useState('');
    const [quantity, setQuantity] = useState('');
    const [unit, setUnit] = useState('');
    const [marka, setMarka] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [finalNames, setFinalNames] = useState([])
    const submit = async () => {

        if (item.trim() === '') {
            Alert.alert(
                "Warning",
                "Enter Item Name",
                [
                    {
                        text: "Okay",
                        style: "cancel"
                    },
                ]
            );
        }
        else if (quantity === '') {
            Alert.alert(
                "Warning",
                "Enter Item quantity",
                [
                    {
                        text: "Okay",
                        style: "cancel"
                    },
                ]
            );
        }
        else {
            try {
                var imageExist = false;
                if (selectedImage && selectedImage.length > 0) {
                    imageExist = true;

                    for await (const item of selectedImage) {
                        await saveFile(item.uri, item.name);

                    }
                }
                await Transaction.insertInward(receivedDate ? moment.utc(receivedDate).valueOf() : null, paymentDate ? moment.utc(paymentDate).valueOf() : null, location.toString(), lotnumber, item, quantity, unit, marka, quantity, imageExist, finalNames.toString());

                Alert.alert(
                    "Success",
                    "Inward added successfully",
                    [
                        {
                            text: "Okay",
                            style: "cancel"
                        },
                    ]
                );


                setReceivedDate(null);
                setReceivedDatePick(false);
                setPaymentDate(null);
                setPaymentDatePick(false);
                setLocation('');
                setLotNumber('');
                setItem('');
                setQuantity('');
                setUnit('');
                setMarka('');
                setSelectedImage(null);
                setFinalNames([]);

            } catch (error) {
                // console.log(error);
                Alert.alert(
                    "Failure",
                    "Something went wrong please try again later.",
                    [
                        {
                            text: "Okay",
                            style: "cancel"
                        },
                    ]
                );
            }
        }
    }


    const onChangeReceivedDate = (e, date) => {
        if (Platform.OS === 'android') {
            setShowReceivedDate(false);
        }
        const from = moment(date, 'DD/MM/YYYY').toDate();
        setReceivedDate(from)
    }


    const onChangePaymentDate = (e, date) => {
        if (Platform.OS === 'android') {
            setShowPaymentDate(false);
        }
        const from = moment(date, 'DD/MM/YYYY').toDate();
        setPaymentDate(from)
    }





    const openImagePicker = async () => {
        try {
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (permissionResult.granted === false) {
                Alert.alert(
                    "Error",
                    "Permission to access media library was denied",
                    [
                        {
                            text: "Okay",
                            style: "cancel"
                        },
                    ]
                );

                return;
            }

            const pickerResult = await ImagePicker.launchImageLibraryAsync({ allowsMultipleSelection: true, });
            if (!pickerResult.canceled) {
                var URi = [];
                var names = [];
                pickerResult.assets.forEach((element, index) => {
                    const fileUriParts = element.uri.split('.');
                    const fileExtension = fileUriParts[fileUriParts.length - 1];
                    const newFileName = `${moment.utc(new Date()).valueOf() + `${index}`}.${fileExtension}`;
                    URi.push({ uri: element.uri, name: moment.utc(new Date()).valueOf() + `${index}` });
                    names.push(newFileName);
                });
                // console.log(URi)
                setSelectedImage(URi);
                setFinalNames(names);
            }
        } catch (error) {
            // console.log(error)
        }

    };

    const saveFile = async (fileUri, fileName) => {
        try {
            const fileUriParts = fileUri.split('.');
            const fileExtension = fileUriParts[fileUriParts.length - 1];
            const newFileName = `${fileName}.${fileExtension}`;
            const destinationUri = FileSystem.documentDirectory + newFileName;

            await FileSystem.copyAsync({ from: fileUri, to: destinationUri });
        } catch (error) {
            // console.log('Error saving file:', error);
        }
    };

    const deleteSelectedImage = (index) => {
        // console.log(index);
        var tempArray = [...selectedImage];
        var tempName = [...finalNames];
        tempArray.splice(index, 1);
        tempName.splice(index, 1);
        setSelectedImage(tempArray);
        setFinalNames(tempName)
    }

    return (

        <ScrollView automaticallyAdjustKeyboardInsets={true} style={{ backgroundColor: 'white', padding: 5 }}>

            <View style={{
                backgroundColor: 'white',
                padding: 16, flexDirection: 'row'
            }}>
                <Text style={{ fontSize: 18, width: '30%' }}>Received Date:   </Text>
                <TouchableOpacity onPress={() => { setShowReceivedDate(true); recievedDatePick ? null : setReceivedDate(new Date()); setReceivedDatePick(true) }} style={{ flexDirection: 'row', borderWidth: 1, width: '70%' }}>
                    <Text style={{ fontSize: 18, marginLeft: 10, width: '70%' }}>{receivedDate ? moment(receivedDate).format('DD-MM-YYYY') : ''}</Text>
                    <Icon name='today' size={28} color='#0d6efd' style={{ float: 'right' }} />
                </TouchableOpacity>
            </View>
            {recievedDatePick && <View >
                {showReceivedDate && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={receivedDate ? receivedDate : new Date()}
                        display={Platform.OS === "android" ? "default" : "spinner"}
                        mode='date'
                        onChange={onChangeReceivedDate}
                        style={styles.datepicker}
                    />
                )}
                {showReceivedDate && Platform.OS === "ios" && (
                    <View
                        style={{ flexDirection: "row", justifyContent: "space-around" }}>
                        <TouchableOpacity
                            onPress={() => setShowReceivedDate(false)}
                            style={{
                                paddingHorizontal: 20,
                                paddingVertical: 10,
                                backgroundColor: '#0d6efd',
                                marginBottom: 15,
                                borderRadius: 10
                            }}>
                            <Text style={{ fontSize: 16, color: 'white' }}>Confirm</Text>
                        </TouchableOpacity>
                    </View>)}
            </View>}


            <View style={{
                backgroundColor: 'white',
                padding: 16, flexDirection: 'row'
            }}>
                <Text style={{ fontSize: 18, width: '30%' }}>Payment Date:   </Text>
                <TouchableOpacity onPress={() => { setShowPaymentDate(true); paymentDatePick ? null : setPaymentDate(new Date()); setPaymentDatePick(true); }} style={{ flexDirection: 'row', borderWidth: 1, width: '70%' }}>
                    <Text style={{ fontSize: 18, marginLeft: 10, width: '70%' }}>{paymentDate ? moment(paymentDate).format('DD-MM-YYYY') : ''}</Text>
                    <Icon name='today' size={28} color='#0d6efd' style={{ float: 'right' }} />
                </TouchableOpacity>
            </View>
            <View >
                {showPaymentDate && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={paymentDate ? paymentDate : new Date()}
                        display={Platform.OS === "android" ? "default" : "spinner"}
                        mode='date'
                        onChange={onChangePaymentDate}
                        style={styles.datepicker}
                    />
                )}
                {showPaymentDate && Platform.OS === "ios" && (
                    <View
                        style={{ flexDirection: "row", justifyContent: "space-around" }}>
                        <TouchableOpacity
                            onPress={() => setShowPaymentDate(false)}
                            style={{
                                paddingHorizontal: 20,
                                paddingVertical: 10,
                                backgroundColor: '#0d6efd',
                                marginBottom: 15,
                                borderRadius: 10
                            }}>
                            <Text style={{ fontSize: 16, color: 'white' }}>Confirm</Text>
                        </TouchableOpacity>
                    </View>)}
            </View>

            <View style={{ paddingHorizontal: 20, paddingBottom: 10 }}>
                <TextInput
                    label="Location"
                    mode="outlined"
                    value={location}
                    onChangeText={text => setLocation(text)}
                />
            </View>

            <View style={{ paddingHorizontal: 20, paddingBottom: 10 }}>
                <TextInput
                    label="Lot Number"
                    mode="outlined"
                    value={lotnumber}
                    onChangeText={text => setLotNumber(text)}
                />
            </View>

            <View style={{ paddingHorizontal: 20, paddingBottom: 10 }}>
                <TextInput
                    label="Item"
                    mode="outlined"
                    value={item}
                    onChangeText={text => setItem(text)}
                />
            </View>

            <View style={{ paddingHorizontal: 20, paddingBottom: 10 }}>
                <TextInput
                    label="Quantity"
                    inputMode='numeric'
                    keyboardType='number-pad'
                    mode="outlined"
                    value={quantity}
                    onChangeText={text => setQuantity(text)}
                />
            </View>

            <View style={{ paddingHorizontal: 20, paddingBottom: 10 }}>
                <TextInput
                    label="Unit"
                    mode="outlined"
                    value={unit}
                    onChangeText={text => setUnit(text)}
                />
            </View>

            <View style={{ paddingHorizontal: 20, paddingBottom: 10 }}>
                <TextInput
                    label="Marka"
                    mode="outlined"
                    value={marka}
                    onChangeText={text => setMarka(text)}
                />
            </View>

            <Pressable style={{}} onPress={openImagePicker}>
                <View style={{ paddingTop: 20 }}>
                    <Button style={{ height: 60 }} labelStyle={{ marginTop: 15, fontSize: 18 }}
                        mode="contained" >
                        Upload Image
                    </Button>
                </View>
            </Pressable>

            {selectedImage &&
                selectedImage.map((item, index) => (
                    <View key={index}>
                        <View style={{ paddingTop: 10, alignItems: 'center' }}>
                            <Image source={{ uri: item.uri }} style={{ width: 200, height: 200 }} />
                            <IconButton
                                icon="delete"
                                iconColor={'red'}
                                size={50}
                                onPress={() => deleteSelectedImage(index)}
                            />
                        </View>
                    </View>
                ))

            }


            <Pressable style={{ padding: 20 }} onPress={submit}>
                <View style={{ paddingTop: 20 }}>
                    <Button style={{ height: 60 }} labelStyle={{ marginTop: 15, fontSize: 18 }}
                        mode="contained" >
                        Submit
                    </Button>

                </View>
            </Pressable>


        </ScrollView>
    );
}

export default AddNewInward


const styles = StyleSheet.create({
    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
        textTransform: 'capitalize'
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
        textTransform: 'capitalize'
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
        textTransform: 'capitalize'
    },
});