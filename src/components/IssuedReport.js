import { useEffect } from "react";
import { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Dropdown } from "react-native-element-dropdown";
import { Icon } from "@rneui/themed";
import { TouchableOpacity } from "react-native-gesture-handler";
import { ActivityIndicator, Switch } from 'react-native-paper';
import moment from 'moment';
import Transaction from '../services/transaction'
import IssuedReportPdf from './IssuedReportpdf'

const IssuedReport = () => {
    const [isFocusOrder, setIsFocusOrder] = useState(false);
    const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(new Date());
    const [showFromDate, setShowFromDate] = useState(false);
    const [showToDate, setShowToDate] = useState(false);
    const maxDate = new Date();
    const [minDate, setMinDate] = useState(new Date())
    const [groupBy, setGroupBy] = useState(false);
    const [orderby, setOrderby] = useState('id');
    const [loader, setLoader] = useState(false);


    const getIssuedReportPdf = async () => {




        Transaction.getOutwardReport(moment.utc(fromDate).valueOf(), moment.utc(toDate).valueOf(), groupBy, orderby).then(async (res) => {
            // console.log(res);
            setLoader(true);
            if (res.length === 0) {
                Alert.alert(
                    "No data found",
                    "There is no data for the dates you selected",
                    [
                        {
                            text: "Okay",
                            style: "cancel"
                        },
                    ]
                );
                setLoader(false);
            }
            else {
                await IssuedReportPdf(res, fromDate, toDate);
                setLoader(false);
            }


        })

    }

    useEffect(() => {
        var today = new Date();
        var todayDate = '04-01-' + today.getFullYear();
        if ((today.getMonth() + 1) <= 3) {
            todayDate = '04-01-' + (today.getFullYear() - 1);
            setFromDate(moment(todayDate, 'MM-DD-YYYY').toDate())
            setMinDate(moment(todayDate, 'MM-DD-YYYY').toDate())
        } else {
            setFromDate(moment(todayDate, 'MM-DD-YYYY').toDate());
            setMinDate(moment(todayDate, 'MM-DD-YYYY').toDate());
        }
    }, [])

    const onChangeToDate = (e, date) => {
        if (Platform.OS === "android") {
            setShowToDate(false);
        }
        const to = moment(date, 'DD/MM/YYYY').toDate();
        const from = new Date(fromDate);
        // console.log(e)
        if (fromDate !== "" && from.getTime() > to.getTime()) {
            setToDate(fromDate);
        }
        else {
            setToDate(moment(date, 'DD/MM/YYYY').toDate());
        }
    }
    const onChangeFromDate = (e, date) => {
        if (Platform.OS === "android") {
            setShowFromDate(false);
        }
        const to = new Date(toDate);
        const from = moment(date, 'DD/MM/YYYY').toDate();
        // console.log(to + '=' + toDate);
        if (toDate !== "" && from.getTime() > to.getTime()) {
            setFromDate(toDate);
        }
        else {
            setFromDate(moment(date, 'DD/MM/YYYY').toDate());
        }
    }


    const renderLabelOrder = () => {
        if (orderby || isFocusOrder) {
            return (
                <Text style={[styles.label, isFocusOrder && { color: 'blue' }]}>
                    OrderBy
                </Text>
            );
        }
        return null;
    };


    return (
        <ScrollView>
            <View style={styles.container}>
                <View style={{
                    backgroundColor: 'white',
                    padding: 16, flexDirection: 'row'
                }}>
                    <Text style={{ fontSize: 18, width: '30%' }}>Date From:   </Text>
                    <TouchableOpacity onPress={() => { setShowFromDate(true) }} style={{ flexDirection: 'row', borderWidth: 1, width: '80%' }}>
                        <Text style={{ fontSize: 18, marginLeft: 10, width: '70%' }}>{moment(fromDate).format('DD-MM-YYYY')}</Text>
                        <Icon name='today' size={28} color='#0d6efd' style={{ float: 'right' }} />
                    </TouchableOpacity>
                </View>

                <View >
                    {showFromDate && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={fromDate}
                            maximumDate={toDate}
                            minimumDate={minDate}
                            mode={'date'}
                            onChange={onChangeFromDate}
                            display={Platform.OS === "android" ? "default" : "spinner"}
                            style={styles.datepicker}
                        />
                    )}
                    {showFromDate && Platform.OS === "ios" && (
                        <View
                            style={{ flexDirection: "row", justifyContent: "space-around" }}>
                            <TouchableOpacity
                                onPress={() => setShowFromDate(false)}
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

                <View style={{
                    backgroundColor: 'white',
                    padding: 16, flexDirection: 'row'
                }}>
                    <Text style={{ fontSize: 18, width: '30%' }}>Date: To:   </Text>
                    <TouchableOpacity onPress={() => { setShowToDate(true) }} style={{ flexDirection: 'row', borderWidth: 1, width: '80%' }}>
                        <Text style={{ fontSize: 18, marginLeft: 10, width: '70%' }}>{moment(toDate).format('DD-MM-YYYY')}</Text>
                        <Icon name='today' size={28} color='#0d6efd' style={{ float: 'right' }} />
                    </TouchableOpacity>
                </View>
                <View>
                    {showToDate && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={toDate}
                            maximumDate={maxDate}
                            minimumDate={fromDate}
                            mode={'date'}
                            display={Platform.OS === "android" ? "default" : "spinner"}
                            onChange={onChangeToDate}
                            style={styles.datepicker}

                        />
                    )}
                    {showToDate && Platform.OS === "ios" && (
                        <View
                            style={{ flexDirection: "row", justifyContent: "space-around" }}>
                            <TouchableOpacity
                                onPress={() => setShowToDate(false)}
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
                <View style={{
                    backgroundColor: 'white',
                    padding: 16, marginLeft: 10,
                    flexDirection: 'row'
                }}>
                    <Switch
                        value={groupBy}
                        onValueChange={() => {
                            setGroupBy(!groupBy);
                        }
                        }
                    />
                    <Text style={styles.label}>Itemwise</Text>
                </View>
                {renderLabelOrder()}
                <Dropdown
                    style={[styles.dropdown, isFocusOrder && { borderColor: 'blue' }]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    data={[{ label: 'As Entered', value: 'id' }, { label: 'Lotwise', value: 'lotnumber' }, { label: 'DateWise', value: 'gatepassdate' }]}
                    search
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder={!isFocusOrder ? 'Select Order' : '...'}
                    searchPlaceholder="Search..."
                    value={orderby}
                    itemTextStyle={{ textTransform: 'capitalize' }}
                    onFocus={() => setIsFocusOrder(true)}
                    onBlur={() => setIsFocusOrder(false)}
                    onChange={item => {
                        setOrderby(item.value);
                        setIsFocusOrder(false);
                    }}
                />
                <View style={styles.container}>
                    {loader && <ActivityIndicator size="large" />}
                    <Pressable style={{ alignContent: 'center', alignItems: 'center' }}
                        onPress={getIssuedReportPdf}
                    >
                        <Text style={{ marginTop: 7, color: '#007aff' }}>Download</Text>
                    </Pressable>
                </View>
            </View>



        </ScrollView>
    )
}

export default IssuedReport



const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 16,
    },
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
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "blue",
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
    modalTextBold: {
        marginTop: 10,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: "center"
    },
    datePickerStyle: {
        width: '90%',
        marginTop: 20,
    },
    icon: {
        marginTop: 20,

    },
    label: {
        marginLeft: 3,
        marginTop: 5,
        fontSize: 18
    },
    datepicker: {
        height: 120,
        marginTop: -10
    }
});