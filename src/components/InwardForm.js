import React, { useState, useEffect } from "react";
import { Alert, Platform, ScrollView, Image } from "react-native";
import { 
  Card, YStack, XStack, Input, Button, Text, H2, Paragraph, Spinner, View, Label 
} from 'tamagui';
import { Icon } from "@rneui/themed";
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import ValidationService from "../services/validationService";

const InwardForm = ({ initialValues, onSubmit, isEdit = false }) => {
    const [showReceivedDate, setShowReceivedDate] = useState(false);
    const [receivedDate, setReceivedDate] = useState(null);
    const [showPaymentDate, setShowPaymentDate] = useState(false);
    const [paymentDate, setPaymentDate] = useState(null);
    const [lotnumber, setLotNumber] = useState('');
    const [location, setLocation] = useState('');
    const [item, setItem] = useState('');
    const [quantity, setQuantity] = useState('');
    const [unit, setUnit] = useState('');
    const [marka, setMarka] = useState('');
    const [balance, setBalance] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [finalNames, setFinalNames] = useState([]);
    const [validationErrors, setValidationErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialValues) {
            setReceivedDate(initialValues.receivedDate);
            setPaymentDate(initialValues.paymentDate);
            setLocation(initialValues.location);
            setLotNumber(initialValues.lotnumber);
            setItem(initialValues.item);
            setQuantity(initialValues.quantity + '');
            setUnit(initialValues.unit);
            setMarka(initialValues.marka);
            setBalance(initialValues.quantity - initialValues.balance);
            const destinationUri = FileSystem.documentDirectory;
            var tempArray = initialValues.imageName.split(",").map(element => (
                { uri: destinationUri + element, name: element.split(".")[0] }
            ));
            setSelectedImage(initialValues.imageName ? tempArray : null);
            setFinalNames(initialValues.imageName.split(","));
        }
    }, [initialValues]);

    const submit = async () => {
        setLoading(true);
        // Prepare form data
        const formData = {
            receivedDate,
            paymentDate,
            location,
            lotnumber,
            item,
            quantity,
            unit,
            marka,
            balance: isEdit ? (+quantity - balance) : quantity,
            imageExist: false,
            imageName: finalNames.toString()
        };

        // Validate form data
        const validation = ValidationService.validateAndSanitizeForm(formData, 'inward');
        
        if (!validation.isValid) {
            // Set validation errors
            const errors = {};
            Object.keys(validation.results).forEach(fieldName => {
                const result = validation.results[fieldName];
                if (!result.isValid) {
                    errors[fieldName] = result.errors[0];
                }
            });
            setValidationErrors(errors);
            setLoading(false);
            // Show alert with first error
            const firstError = validation.allErrors[0];
            Alert.alert(
                "Validation Error",
                firstError,
                [{ text: "Okay", style: "cancel" }]
            );
            return;
        }

        // Clear validation errors
        setValidationErrors({});

        // Process images if any
        var imageExist = false;
        if (selectedImage && selectedImage.length > 0) {
            imageExist = true;
            for await (const item of selectedImage) {
                await saveFile(item.uri, item.name);
            }
        }

        // Prepare final data with sanitized values
        const data = {
            ...validation.sanitizedData,
            balance: isEdit ? (+validation.sanitizedData.quantity - balance) : validation.sanitizedData.quantity,
            imageExist,
            imageName: finalNames.toString()
        };
        setLoading(false);
        onSubmit(data);
    }

    const onChangeReceivedDate = (e, date) => {
        if (Platform.OS === 'android') {
            setShowReceivedDate(false);
        }
        const from = moment(date, 'DD/MM/YYYY').toDate();
        setReceivedDate(from);
        if (validationErrors.receivedDate) {
            setValidationErrors(prev => ({ ...prev, receivedDate: null }));
        }
    }

    const onChangePaymentDate = (e, date) => {
        if (Platform.OS === 'android') {
            setShowPaymentDate(false);
        }
        const from = moment(date, 'DD/MM/YYYY').toDate();
        setPaymentDate(from);
        if (validationErrors.paymentDate) {
            setValidationErrors(prev => ({ ...prev, paymentDate: null }));
        }
    }

    const changeQuantity = (value) => {
        if (isEdit && Number(value) < (+balance)) {
            Alert.alert(
                "Warning",
                "" + (+balance) + " items have already been issued",
                [
                    {
                        text: "Okay",
                        style: "cancel"
                    },
                ]
            );
            setQuantity((+balance) + "");
        } else {
            setQuantity(value);
        }
        if (validationErrors.quantity) {
            setValidationErrors(prev => ({ ...prev, quantity: null }));
        }
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
                var URi = selectedImage ? [...selectedImage] : [];
                var names = finalNames ? [...finalNames] : [];
                pickerResult.assets.forEach((element, index) => {
                    const fileUriParts = element.uri.split('.');
                    const fileExtension = fileUriParts[fileUriParts.length - 1];
                    const newFileName = `${moment.utc(new Date()).valueOf() + `${index}`}.${fileExtension}`;
                    URi.push({ uri: element.uri, name: moment.utc(new Date()).valueOf() + `${index}` });
                    names.push(newFileName);
                });
                setSelectedImage(URi);
                setFinalNames(names);
            }
        } catch (error) {
            console.error("Error picking image:", error);
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
            console.error("Error saving file:", error);
        }
    };

    const deleteSelectedImage = (index) => {
        var tempArray = [...selectedImage];
        var tempNames = [...finalNames];
        tempArray.splice(index, 1);
        tempNames.splice(index, 1);
        setSelectedImage(tempArray);
        setFinalNames(tempNames);
    };

    return (
        <ScrollView 
            style={{ flex: 1, backgroundColor: '#f5f5f5' }}
            contentContainerStyle={{ paddingBottom: 50 }}
            showsVerticalScrollIndicator={false}
        >
            <YStack p="$4" space="$4" paddingTop="$6">
                <Card elevate size="$4" padding="$5" borderRadius="$5" marginTop="$2">
                    <YStack space="$5" alignItems="center">
                        <Icon name="inventory" size={40} color="$green10" />
                        <H2 fontWeight="800" fontSize="$10" padding="$2" color="$color" textAlign="center">
                            Add New Inward
                        </H2>
                        <Paragraph textAlign="center" fontSize="$4" color="$color11">
                            Enter details for the new inward item below.
                        </Paragraph>
                    </YStack>
                </Card>
                
                <Card elevate size="$4" padding="$5" borderRadius="$5">
                    <YStack space="$4">
                        {/* Received Date */}
                        <Label fontWeight="700" fontSize="$4" color="$color">Received Date</Label>
                        <Card elevate size="$2" padding="$3" borderRadius="$3" backgroundColor="white">
                            <Button
                                backgroundColor="transparent"
                                color="$blue10"
                                onPress={() => setShowReceivedDate(true)}
                                icon={<Icon name="event" size={20} color="$blue10" />}
                                borderRadius="$3"
                                height={44}
                                justifyContent="flex-start"
                                pressStyle={{ backgroundColor: '$blue5' }}
                            >
                                <Text color="$blue10" fontSize="$4" fontWeight="600">
                                    {receivedDate ? moment(receivedDate).format("DD-MM-YYYY") : "Select Date"}
                                </Text>
                            </Button>
                        </Card>
                        {showReceivedDate && (
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={receivedDate || new Date()}
                                maximumDate={new Date()}
                                display={Platform.OS === "android" ? "default" : "spinner"}
                                mode="date"
                                onChange={onChangeReceivedDate}
                                style={{ marginBottom: 10 }}
                            />
                        )}
                        {validationErrors.receivedDate && (
                            <Text color="$red10" fontSize="$3">{validationErrors.receivedDate}</Text>
                        )}

                        {/* Payment Date */}
                        <Label fontWeight="700" fontSize="$4" color="$color">Payment Date</Label>
                        <Card elevate size="$2" padding="$3" borderRadius="$3" backgroundColor="white">
                            <Button
                                backgroundColor="transparent"
                                color="$blue10"
                                onPress={() => setShowPaymentDate(true)}
                                icon={<Icon name="event" size={20} color="$blue10" />}
                                borderRadius="$3"
                                height={44}
                                justifyContent="flex-start"
                                pressStyle={{ backgroundColor: '$blue5' }}
                            >
                                <Text color="$blue10" fontSize="$4" fontWeight="600">
                                    {paymentDate ? moment(paymentDate).format("DD-MM-YYYY") : "Select Date"}
                                </Text>
                            </Button>
                        </Card>
                        {showPaymentDate && (
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={paymentDate || new Date()}
                                maximumDate={new Date()}
                                display={Platform.OS === "android" ? "default" : "spinner"}
                                mode="date"
                                onChange={onChangePaymentDate}
                                style={{ marginBottom: 10 }}
                            />
                        )}
                        {validationErrors.paymentDate && (
                            <Text color="$red10" fontSize="$3">{validationErrors.paymentDate}</Text>
                        )}

                        {/* Location */}
                        <Label fontWeight="700" fontSize="$4" color="$color">Location</Label>
                        <Card elevate size="$2" padding="$3" borderRadius="$3" backgroundColor="white">
                            <Input
                                value={location}
                                onChangeText={setLocation}
                                placeholder="Enter location"
                                size="$4"
                                borderWidth={0}
                                backgroundColor="transparent"
                                fontSize="$4"
                                color="$color"
                                placeholderTextColor="$color8"
                            />
                        </Card>
                        {validationErrors.location && (
                            <Text color="$red10" fontSize="$3">{validationErrors.location}</Text>
                        )}

                        {/* Lot Number */}
                        <Label fontWeight="700" fontSize="$4" color="$color">Lot Number</Label>
                        <Card elevate size="$2" padding="$3" borderRadius="$3" backgroundColor="white">
                            <Input
                                value={lotnumber}
                                onChangeText={setLotNumber}
                                placeholder="Enter lot number"
                                size="$4"
                                borderWidth={0}
                                backgroundColor="transparent"
                                fontSize="$4"
                                color="$color"
                                placeholderTextColor="$color8"
                            />
                        </Card>
                        {validationErrors.lotnumber && (
                            <Text color="$red10" fontSize="$3">{validationErrors.lotnumber}</Text>
                        )}

                        {/* Item */}
                        <Label fontWeight="700" fontSize="$4" color="$color">Item</Label>
                        <Card elevate size="$2" padding="$3" borderRadius="$3" backgroundColor="white">
                            <Input
                                value={item}
                                onChangeText={setItem}
                                placeholder="Enter item name"
                                size="$4"
                                borderWidth={0}
                                backgroundColor="transparent"
                                fontSize="$4"
                                color="$color"
                                placeholderTextColor="$color8"
                            />
                        </Card>
                        {validationErrors.item && (
                            <Text color="$red10" fontSize="$3">{validationErrors.item}</Text>
                        )}

                        {/* Quantity */}
                        <Label fontWeight="700" fontSize="$4" color="$color">Quantity</Label>
                        <Card elevate size="$2" padding="$3" borderRadius="$3" backgroundColor="white">
                            <Input
                                value={quantity}
                                onChangeText={changeQuantity}
                                placeholder="Enter quantity"
                                size="$4"
                                keyboardType="numeric"
                                borderWidth={0}
                                backgroundColor="transparent"
                                fontSize="$4"
                                color="$color"
                                placeholderTextColor="$color8"
                            />
                        </Card>
                        {validationErrors.quantity && (
                            <Text color="$red10" fontSize="$3">{validationErrors.quantity}</Text>
                        )}

                        {/* Unit */}
                        <Label fontWeight="700" fontSize="$4" color="$color">Unit</Label>
                        <Card elevate size="$2" padding="$3" borderRadius="$3" backgroundColor="white">
                            <Input
                                value={unit}
                                onChangeText={setUnit}
                                placeholder="Enter unit"
                                size="$4"
                                borderWidth={0}
                                backgroundColor="transparent"
                                fontSize="$4"
                                color="$color"
                                placeholderTextColor="$color8"
                            />
                        </Card>
                        {validationErrors.unit && (
                            <Text color="$red10" fontSize="$3">{validationErrors.unit}</Text>
                        )}

                        {/* Marka */}
                        <Label fontWeight="700" fontSize="$4" color="$color">Marka</Label>
                        <Card elevate size="$2" padding="$3" borderRadius="$3" backgroundColor="white">
                            <Input
                                value={marka}
                                onChangeText={setMarka}
                                placeholder="Enter marka"
                                size="$4"
                                borderWidth={0}
                                backgroundColor="transparent"
                                fontSize="$4"
                                color="$color"
                                placeholderTextColor="$color8"
                            />
                        </Card>
                        {validationErrors.marka && (
                            <Text color="$red10" fontSize="$3">{validationErrors.marka}</Text>
                        )}

                        {/* Balance */}
                        <Label fontWeight="700" fontSize="$4" color="$color">Balance</Label>
                        <Card elevate size="$2" padding="$3" borderRadius="$3" backgroundColor="white">
                            <Input
                                value={balance}
                                onChangeText={setBalance}
                                placeholder="Enter balance"
                                size="$4"
                                keyboardType="numeric"
                                borderWidth={0}
                                backgroundColor="transparent"
                                fontSize="$4"
                                color="$color"
                                placeholderTextColor="$color8"
                            />
                        </Card>
                        {validationErrors.balance && (
                            <Text color="$red10" fontSize="$3">{validationErrors.balance}</Text>
                        )}

                        {/* Image Picker */}
                        <Label fontWeight="700" fontSize="$4" color="$color">Images</Label>
                        <Card elevate size="$2" padding="$3" borderRadius="$3" backgroundColor="$blue10">
                            <Button
                                backgroundColor="transparent"
                                color="white"
                                onPress={openImagePicker}
                                icon={<Icon name="image" size={20} color="white" />}
                                borderRadius="$3"
                                height={32}
                                marginBottom={selectedImage && selectedImage.length > 0 ? "$2" : 0}
                                pressStyle={{ backgroundColor: '$blue11' }}
                            >
                                <Text color="white" fontSize="$4" fontWeight="600">
                                    {selectedImage && selectedImage.length > 0 ? "Add More Images" : "Pick Images"}
                                </Text>
                            </Button>
                        </Card>
                        {selectedImage && selectedImage.length > 0 && (
                            <YStack space="$2">
                                <Text fontWeight="700" fontSize="$4" color="$color">Selected Images:</Text>
                                <XStack flexWrap="wrap" space="$2">
                                    {selectedImage.map((image, index) => (
                                        <Card key={index} elevate size="$2" padding="$2" borderRadius="$3" backgroundColor="$gray5">
                                            <YStack alignItems="center" space="$1">
                                                <Image source={{ uri: image.uri }} style={{ width: 60, height: 60, borderRadius: 8 }} />
                                                <Card elevate size="$3" padding="$1" borderRadius="$2" backgroundColor="$red10" shadowColor="$red11" shadowOffset={{ width: 0, height: 2 }} shadowOpacity={0.3} shadowRadius={4}>
                                                    <Button
                                                        size="$4"
                                                        backgroundColor="transparent"
                                                        color="white"
                                                        onPress={() => deleteSelectedImage(index)}
                                                        borderRadius="$2"
                                                        icon={<Icon name="close" size={14} color="white" />}
                                                        pressStyle={{ backgroundColor: '$red11' }}
                                                    >
                                                        <Text color="white" fontSize="$2" fontWeight="600">Remove</Text>
                                                    </Button>
                                                </Card>
                                            </YStack>
                                        </Card>
                                    ))}
                                </XStack>
                            </YStack>
                        )}

                        {/* Submit Button */}
                        <Card elevate size="$3" padding="$3" borderRadius="$4" backgroundColor="$green10" marginTop="$4">
                            <Button
                                size="$6"
                                backgroundColor="transparent"
                                color="white"
                                onPress={submit}
                                borderRadius="$4"
                                icon={<Icon name="check" size={24} color="white" />}
                                disabled={loading}
                                pressStyle={{ backgroundColor: '$green11' }}
                            >
                                {loading ? (
                                    <Spinner color="white" />
                                ) : (
                                    <Text color="white" fontSize="$5" fontWeight="700">
                                        {isEdit ? "Update Inward" : "Add Inward"}
                                    </Text>
                                )}
                            </Button>
                        </Card>
                    </YStack>
                </Card>
            </YStack>
        </ScrollView>
    );
};

export default InwardForm;
