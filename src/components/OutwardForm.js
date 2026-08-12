import React, { useEffect, useState } from "react";
import { Alert, Platform, ScrollView } from "react-native";
import { 
  Card, YStack, XStack, Input, Button, Text, H2, Paragraph, Spinner, View, Label 
} from 'tamagui';
import { Icon } from "@rneui/themed";
import { Dropdown } from "react-native-element-dropdown";
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import Transaction from "../services/transaction";

const OutwardForm = ({ initialValues, onSubmit, isEdit = false }) => {

    const [isFocusLotNumber, setIsFocusLotNumber] = useState(false);
    const [showGatePassDate, setShowGatePassDate] = useState(false);
    const [gatepassdate, setGatePassDate] = useState(null);
    const [gatePassDatePick, setGatePassDatePick] = useState(false)
    const [lotnumber, setLotNumber] = useState('');
    const [location, setLocation] = useState('');
    const [item, setItem] = useState('');
    const [quantity, setQuantity] = useState('');
    const [unit, setUnit] = useState('');
    const [marka, setMarka] = useState('');
    const [dropdownMenu, setDropDownMenu] = useState([]);
    const [balance, setBalance] = useState('');
    const [receivedId, setReceivedId] = useState('');
    const [issued, setIssued] = useState('');
    const [gatepass, setGatePass] = useState('');
    const [receivedDate, setReceivedDate] = useState('');
    const [total, setTotal] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isEdit && initialValues) {
            const { receivedId, lotnumber, quantity, location, item, balance, unit, marka, receivedDate, gatePassDate, gatepass, issued } = initialValues;
            setReceivedId(receivedId)
            setLotNumber(lotnumber);
            setQuantity(quantity);
            setLocation(location);
            setItem(item);
            setBalance(balance);
            setUnit(unit);
            setMarka(marka);
            setReceivedDate(receivedDate);
            setGatePassDate(gatePassDate);
            setGatePass(gatepass);
            setIssued(issued + '')
            setTotal(+balance + +issued)
        }
    }, [initialValues, isEdit]);

    useEffect(() => {
        {
            receivedId !== '' &&
                getInwardById();
        }
    }, [receivedId]);

    const getInwardById = async () => {
        try {
            const item = await Transaction.getInwardById(receivedId);
            setLotNumber(item[0].lotnumber);
            setQuantity(item[0].quantity);
            setLocation(item[0].location);
            setItem(item[0].item);
            setBalance(item[0].balance);
            setUnit(item[0].unit);
            setMarka(item[0].marka);
            setReceivedDate(item[0].receivedDate);
        } catch (error) {

        }
    }

    useEffect(() => {
        getAllInwardsForOutwards();
    }, []);

    const getAllInwardsForOutwards = async () => {
        try {
            const result = await Transaction.getAllInwardsForOutwards();
            if (result.length !== 0) {
                const tempArray = result.map((item) =>
                    ({ label: '#Lot: ' + item.lotnumber + '    #Marka: ' + item.marka + '    #Qty: ' + item.quantity + '    #Locn: ' + item.location, value: item.id })
                )
                setDropDownMenu(tempArray);
            }
        } catch (error) {

        }

    }

    const onChangeGatePassDate = (e, date) => {
        if (Platform.OS === 'android') {
            setShowGatePassDate(false);
        }
        const from = moment(date, 'DD/MM/YYYY').toDate();
        setGatePassDate(from)
    }

    const submit = async () => {
        setLoading(true);
        if (issued.trim() === '') {
            Alert.alert(
                "Warning",
                "Enter Quantity",
                [
                    {
                        text: "Okay",
                        style: "cancel"
                    },
                ]
            );
            setLoading(false);
        }
        else {
            const data = {
                receivedDate: moment.utc(receivedDate).valueOf(),
                gatePassDate: moment.utc(gatepassdate).valueOf(),
                location,
                lotnumber,
                item,
                quantity,
                issued,
                unit,
                marka,
                balance: isEdit ? balance : (+balance - +issued),
                receivedId,
                gatepass
            }
            setLoading(false);
            onSubmit(data);
        }
    }

    const changeIssuedValue = (value) => {
        if (isEdit) {
            const temp = Number(value) > Number(total) ? total + '' : value + '';
            setIssued(temp);
            setBalance(+total - +temp);
        } else {
            Number(value) > Number(balance) ? setIssued(balance + '') : setIssued(value);
        }
    }

    return (
        <ScrollView automaticallyAdjustKeyboardInsets={true} style={{ backgroundColor: 'white' }}>
            <YStack padding="$4" space="$4">
                <H2 color="$blue10" textAlign="center" marginBottom="$4">
                    {isEdit ? 'Edit Outward' : 'Add New Outward'}
                </H2>

                {!isEdit && (
                    <Card elevate size="$2" padding="$4" borderRadius="$4">
                        <YStack space="$3">
                            <Label htmlFor="lotnumber" fontSize="$5" fontWeight="600" color="$gray12">
                                Select Lot Number
                            </Label>
                            <Dropdown
                                style={{
                                    height: 50,
                                    borderColor: isFocusLotNumber ? '$blue10' : '$gray8',
                                    borderWidth: 1,
                                    borderRadius: 8,
                                    paddingHorizontal: 12,
                                    backgroundColor: 'white'
                                }}
                                placeholderStyle={{ fontSize: 16, color: '$gray10' }}
                                selectedTextStyle={{ fontSize: 16, color: '$gray12' }}
                                inputSearchStyle={{ height: 40, fontSize: 16 }}
                                data={dropdownMenu}
                                search
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder="Select Lot Number"
                                searchPlaceholder="Search..."
                                value={receivedId}
                                itemTextStyle={{ textTransform: 'capitalize' }}
                                onFocus={() => setIsFocusLotNumber(true)}
                                onBlur={() => setIsFocusLotNumber(false)}
                                onChange={item => {
                                    setReceivedId(item.value);
                                    setIsFocusLotNumber(false);
                                }}
                            />
                        </YStack>
                    </Card>
                )}

                <Card elevate size="$2" padding="$4" borderRadius="$4">
                    <YStack space="$3">
                        <Label htmlFor="gatepassdate" fontSize="$5" fontWeight="600" color="$gray12">
                            Gate Pass Date
                        </Label>
                        <XStack space="$3" alignItems="center">
                            <Input
                                flex={1}
                                placeholder="Select Date"
                                value={gatepassdate ? moment(gatepassdate).format('DD-MM-YYYY') : ''}
                                editable={false}
                                fontSize="$5"
                                padding="$4"
                                borderRadius="$3"
                                borderColor="$gray8"
                                backgroundColor="$gray2"
                            />
                            <Button
                                size="$7"
                                backgroundColor="$blue10"
                                color="white"
                                onPress={() => { 
                                    setShowGatePassDate(true); 
                                    gatePassDatePick ? null : setGatePassDate(new Date()); 
                                    setGatePassDatePick(true) 
                                }}
                                borderRadius="$3"
                                icon={<Icon name="today" size={20} color="white" />}
                                pressStyle={{ backgroundColor: '$blue11' }}
                            />
                        </XStack>
                        
                        {gatePassDatePick && showGatePassDate && (
                            <YStack space="$3">
                                <DateTimePicker
                                    testID="dateTimePicker"
                                    value={gatepassdate ? gatepassdate : new Date()}
                                    display={Platform.OS === "android" ? "default" : "spinner"}
                                    mode='date'
                                    onChange={onChangeGatePassDate}
                                />
                                {Platform.OS === "ios" && (
                                    <Button
                                        size="$8"
                                        backgroundColor="$blue10"
                                        color="white"
                                        onPress={() => setShowGatePassDate(false)}
                                        borderRadius="$3"
                                        pressStyle={{ backgroundColor: '$blue11' }}
                                    >
                                        Confirm Date
                                    </Button>
                                )}
                            </YStack>
                        )}
                    </YStack>
                </Card>

                {receivedId && (
                    <Card elevate size="$2" padding="$4" borderRadius="$4">
                        <YStack space="$4">
                            <H2 fontSize="$6" color="$gray12" textAlign="center">
                                Item Details
                            </H2>
                            
                            <XStack justifyContent="space-between" alignItems="center">
                                <Text fontSize="$4" fontWeight="600" color="$gray11">Received Date:</Text>
                                <Text fontSize="$4" color="$gray12">
                                    {receivedDate !== '' && moment(receivedDate).format('DD-MM-YYYY')}
                                </Text>
                            </XStack>

                            <XStack justifyContent="space-between" alignItems="center">
                                <Text fontSize="$4" fontWeight="600" color="$gray11">Location:</Text>
                                <Text fontSize="$4" color="$gray12">{location}</Text>
                            </XStack>

                            <XStack justifyContent="space-between" alignItems="center">
                                <Text fontSize="$4" fontWeight="600" color="$gray11">Lot Number:</Text>
                                <Text fontSize="$4" color="$gray12">{lotnumber}</Text>
                            </XStack>

                            <XStack justifyContent="space-between" alignItems="center">
                                <Text fontSize="$4" fontWeight="600" color="$gray11">Item:</Text>
                                <Text fontSize="$4" color="$gray12">{item}</Text>
                            </XStack>

                            <XStack justifyContent="space-between" alignItems="center">
                                <Text fontSize="$4" fontWeight="600" color="$gray11">Received:</Text>
                                <Text fontSize="$4" color="$gray12">{quantity}</Text>
                            </XStack>

                            <XStack justifyContent="space-between" alignItems="center">
                                <Text fontSize="$4" fontWeight="600" color="$gray11">Balance:</Text>
                                <Text fontSize="$4" color="$gray12">{balance}</Text>
                            </XStack>

                            <XStack justifyContent="space-between" alignItems="center">
                                <Text fontSize="$4" fontWeight="600" color="$gray11">Unit:</Text>
                                <Text fontSize="$4" color="$gray12">{unit}</Text>
                            </XStack>

                            <XStack justifyContent="space-between" alignItems="center">
                                <Text fontSize="$4" fontWeight="600" color="$gray11">Marka:</Text>
                                <Text fontSize="$4" color="$gray12">{marka}</Text>
                            </XStack>
                        </YStack>
                    </Card>
                )}

                <Card elevate size="$2" padding="$4" borderRadius="$4">
                    <YStack space="$4">
                        <Label htmlFor="issued" fontSize="$5" fontWeight="600" color="$gray12">
                            Quantity to Issue
                        </Label>
                        <Input
                            placeholder={`Enter quantity (max: ${balance})`}
                            value={issued}
                            onChangeText={text => changeIssuedValue(text)}
                            keyboardType="numeric"
                            fontSize="$5"
                            padding="$4"
                            borderRadius="$3"
                            borderColor="$gray8"
                            backgroundColor="$gray2"
                        />
                        <Paragraph color="$gray10" fontSize="$3">
                            Enter quantity to issue (max: {balance})
                        </Paragraph>
                    </YStack>
                </Card>

                <Card elevate size="$2" padding="$4" borderRadius="$4">
                    <YStack space="$4">
                        <Label htmlFor="gatepass" fontSize="$5" fontWeight="600" color="$gray12">
                            Gate Pass Number
                        </Label>
                        <Input
                            placeholder="Enter gate pass number (optional)"
                            value={gatepass}
                            onChangeText={text => setGatePass(text)}
                            fontSize="$5"
                            padding="$4"
                            borderRadius="$3"
                            borderColor="$gray8"
                            backgroundColor="$gray2"
                        />
                        <Paragraph color="$gray10" fontSize="$3">
                            Enter gate pass number (optional)
                        </Paragraph>
                    </YStack>
                </Card>

                {receivedId !== '' && (
                    <Button
                        size="$10"
                        backgroundColor="$blue10"
                        color="white"
                        onPress={submit}
                        borderRadius="$4"
                        pressStyle={{ backgroundColor: '$blue11' }}
                        disabled={loading}
                        marginTop="$4"
                        marginBottom="$4"
                    >
                        {loading ? (
                            <XStack space="$2" alignItems="center">
                                <Spinner size="small" color="white" />
                                <Text color="white" fontSize="$4">Processing...</Text>
                            </XStack>
                        ) : (
                            <Text color="white" fontSize="$5" fontWeight="600">
                                {isEdit ? 'Update Outward' : 'Submit Outward'}
                            </Text>
                        )}
                    </Button>
                )}
            </YStack>
        </ScrollView>
    );
}

export default OutwardForm

