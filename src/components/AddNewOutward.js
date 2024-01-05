import React, { useEffect, useState } from "react";
import { Button, Text, TextInput } from "react-native-paper"
import { Alert, Pressable, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native"
import { Dropdown } from "react-native-element-dropdown";
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { Icon } from "@rneui/themed";
import Transaction from "../services/transaction";
const AddNewOutward = () => {


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
            // console.log(result);
            if (result.length !== 0) {
                const tempArray = result.map((item) =>
                    ({ label: '#Lot: ' + item.lotnumber + '    #Marka: ' + item.marka + '    #Qty: ' + item.quantity + '    #Locn: ' + item.location, value: item.id })
                )
                setDropDownMenu(tempArray);
            }
        } catch (error) {

        }

    }


    const renderLabelLotNumber = () => {
        if (lotnumber || isFocusLotNumber) {
            return (
                <Text style={[styles.label, isFocusLotNumber && { color: 'blue' }]}>
                    Select Lot Number
                </Text>
            );
        }
        return null;
    };


    const onChangeGatePassDate = (e, date) => {
        if (Platform.OS === 'android') {
            setShowGatePassDate(false);
        }
        const from = moment(date, 'DD/MM/YYYY').toDate();
        setGatePassDate(from)
    }



    const submit = async () => {


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
        }
        else {

        }
        try {
            await Transaction.insertOutward(moment.utc(receivedDate).valueOf(), moment.utc(gatepassdate).valueOf(), location, lotnumber, item, quantity, issued, unit, marka, (+balance - +issued), receivedId, gatepass);

            Alert.alert(
                "Success",
                "Outward added successfully",
                [
                    {
                        text: "Okay",
                        style: "cancel"
                    },
                ]
            );

            setReceivedId('');
            setLotNumber('');
            setQuantity('');
            setLocation('');
            setItem('');
            setBalance('');
            setUnit('');
            setMarka('');
            setReceivedDate('')
            setGatePassDate(null);
            setGatePassDatePick(false);
            setQuantity('');
            setGatePass('')
        } catch (error) {
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

    const changeIssuedValue = (value) => {
        Number(value) > Number(balance) ? setIssued(balance + '') : setIssued(value);
    }


    return (

        <ScrollView automaticallyAdjustKeyboardInsets={true} style={{ backgroundColor: 'white', padding: 5 }}>

            <View style={{ paddingVertical: 10 }}>
                {renderLabelLotNumber()}
                <Dropdown
                    style={[styles.dropdown, isFocusLotNumber && { borderColor: 'blue' }]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    data={dropdownMenu}
                    search
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder={!isFocusLotNumber ? 'Select Lotnumber' : '...'}
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
            </View>


            <View style={{
                backgroundColor: 'white',
                padding: 16, flexDirection: 'row'
            }}>
                <Text style={{ fontSize: 18, width: '30%', fontWeight: '600' }}>GatePass Date:   </Text>
                <TouchableOpacity onPress={() => { setShowGatePassDate(true); gatePassDatePick ? null : setGatePassDate(new Date()); setGatePassDatePick(true) }} style={{ flexDirection: 'row', borderWidth: 1, width: '70%' }}>
                    <Text style={{ fontSize: 18, marginLeft: 10, width: '70%' }}>{gatepassdate ? moment(gatepassdate).format('DD-MM-YYYY') : ''}</Text>
                    <Icon name='today' size={28} color='#0d6efd' style={{ float: 'right' }} />
                </TouchableOpacity>
            </View>
            {gatePassDatePick && <View >
                {showGatePassDate && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={gatepassdate ? gatepassdate : new Date()}
                        display={Platform.OS === "android" ? "default" : "spinner"}
                        mode='date'
                        onChange={onChangeGatePassDate}
                        style={styles.datepicker}
                    />
                )}
                {showGatePassDate && Platform.OS === "ios" && (
                    <View
                        style={{ flexDirection: "row", justifyContent: "space-around" }}>
                        <TouchableOpacity
                            onPress={() => setShowGatePassDate(false)}
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
            }

            <View style={{ paddingHorizontal: 20, paddingVertical: 10, flexDirection: 'row' }}>
                <Text style={{ fontSize: 18, width: '35%', fontWeight: '600' }}>Received Date: </Text>
                <Text style={{ fontSize: 18, width: '55%' }}>{receivedDate !== '' && moment(receivedDate).format('DD-MM-YYYY')}</Text>
            </View>

            <View style={{ paddingHorizontal: 20, paddingVertical: 10, flexDirection: 'row' }}>
                <Text style={{ fontSize: 18, width: '35%', fontWeight: '600' }}>Location: </Text>
                <Text style={{ fontSize: 18, width: '55%' }}>{location}</Text>
            </View>


            <View style={{ paddingHorizontal: 20, paddingVertical: 10, flexDirection: 'row' }}>
                <Text style={{ fontSize: 18, width: '35%', fontWeight: '600' }}>Lot Number: </Text>
                <Text style={{ fontSize: 18, width: '55%' }}>{lotnumber}</Text>
            </View>

            <View style={{ paddingHorizontal: 20, paddingVertical: 10, flexDirection: 'row' }}>
                <Text style={{ fontSize: 18, width: '35%', fontWeight: '600' }}>Item: </Text>
                <Text style={{ fontSize: 18, width: '55%' }}>{item}</Text>
            </View>

            <View style={{ paddingHorizontal: 20, paddingVertical: 10, flexDirection: 'row' }}>
                <Text style={{ fontSize: 18, width: '35%', fontWeight: '600' }}>Received: </Text>
                <Text style={{ fontSize: 18, width: '55%' }}>{quantity}</Text>
            </View>

            <View style={{ paddingHorizontal: 20, paddingVertical: 10, flexDirection: 'row' }}>
                <Text style={{ fontSize: 18, width: '35%', fontWeight: '600' }}>Balance: </Text>
                <Text style={{ fontSize: 18, width: '55%' }}>{balance}</Text>
            </View>

            <View style={{ paddingHorizontal: 20, paddingVertical: 10, flexDirection: 'row' }}>
                <Text style={{ fontSize: 18, width: '35%', fontWeight: '600' }}>Unit: </Text>
                <Text style={{ fontSize: 18, width: '55%' }}>{unit}</Text>
            </View>


            <View style={{ paddingHorizontal: 20, paddingVertical: 10, flexDirection: 'row' }}>
                <Text style={{ fontSize: 18, width: '35%', fontWeight: '600' }}>Marka: </Text>
                <Text style={{ fontSize: 18, width: '55%' }}>{marka}</Text>
            </View>

            <View style={{ paddingHorizontal: 20, paddingBottom: 10 }}>
                <TextInput
                    label="Quantity"
                    inputMode="numeric"
                    keyboardType="number-pad"
                    mode="outlined"
                    value={issued}
                    onChangeText={text => changeIssuedValue(text)}
                />
            </View>

            <View style={{ paddingHorizontal: 20, paddingBottom: 10 }}>
                <TextInput
                    label="GatePass"
                    mode="outlined"
                    value={gatepass}
                    onChangeText={text => setGatePass(text)}
                />
            </View>


            {receivedId !== '' && <Pressable style={{ padding: 20 }} onPress={submit}>
                <View style={{ paddingTop: 20 }}>
                    <Button style={{ height: 60 }} labelStyle={{ marginTop: 15, fontSize: 18 }}
                        mode="contained" >
                        Submit
                    </Button>
                </View>
            </Pressable>}
        </ScrollView>
    );
}

export default AddNewOutward


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
    boldText: {
        fontWeight: 'bold',
    },
});