import { StyleSheet, Text, View, Pressable, Alert, ScrollView, Modal } from "react-native";
import { useEffect, useState } from "react";
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ActivityIndicator, TextInput, DataTable, Divider, } from 'react-native-paper';
import Transaction from '../services/transaction'
import { TouchableOpacity } from "react-native-gesture-handler";
import { Icon } from "@rneui/themed";
import moment from 'moment';
import StockReportPdf from './StockReportPdf'
const StockPositionUser = () => {
    const [isFocusReport, setIsFocusReport] = useState(false);
    const [isFocusOrder, setIsFocusOrder] = useState(false);
    const [isFocuseItem, setIsFocusItem] = useState(false);
    const [reportType, setReportType] = useState(null);
    const [order, setOrder] = useState(null);
    const [toDate, setToDate] = useState(new Date());
    const [item, setItem] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);
    const [itemOprions, setItemOptions] = useState([]);
    const [loader, setLoader] = useState(false);
    const [showToDate, setShowToDate] = useState(false);
    const [findLotNumber, setFindLotNumber] = useState('');
    const [showFindLotNumber, setShowFindLotNumber] = useState(false);
    const [errorLotNumber, setErrorLotNumber] = useState(null);
    const maxDate = new Date();
    const [dataList, setDataList] = useState([]);
    const [page, setPage] = useState(0);
    const optionsPerPage = [5, 10, 15];
    const [itemsPerPage, setItemsPerPage] = useState(optionsPerPage[0]);
    const from = Math.min((page * itemsPerPage) + 1, dataList.length);
    const to = Math.min((page + 1) * itemsPerPage, dataList.length);


    const onChangeToDate = (e, date) => {
        if (Platform.OS === "android") {
            setShowToDate(false);
        }
        setToDate(moment(date, 'DD/MM/YYYY').toDate());
    }

    const reportTypeMenu = [
        { label: 'Single Lot', value: '1' },
        { label: 'All Pending', value: '2' },
        { label: 'All Clear', value: '3' },
        { label: 'Pending & Clear', value: '4' },
        { label: 'Only Balance', value: '5' },
    ]

    const orderMenu = [
        { label: 'Lotwise', value: 'a.lotnumber, a.id, b.id' },
        { label: 'DateWise', value: 'a.receivedDate, a.id, b.gatePassDate, b.id' },
        { label: 'Item Wise', value: 'a.item, a.id, b.id' },
    ]


    const itemSelectionMenu = [
        { label: 'All', value: '1' },
        { label: 'Selected', value: '2' }
    ]






    const renderLabelReport = () => {
        if (reportType || isFocusReport) {
            return (
                <Text style={[styles.label, isFocusReport && { color: 'blue' }]}>
                    Report Type
                </Text>
            );
        }
        return null;
    };
    const renderLabelOrder = () => {
        if (order || isFocusOrder) {
            return (
                <Text style={[styles.label, isFocusOrder && { color: 'blue' }]}>
                    Order
                </Text>
            );
        }
        return null;
    };
    const renderLabelItem = () => {
        if (item || isFocuseItem) {
            return (
                <Text style={[styles.label, isFocuseItem && { color: 'blue' }]}>
                    Item
                </Text>
            );
        }
        return null;
    };

    useEffect(() => {
        itemOprions !== [] && Transaction.getReceivedItems().then((res) => {

            var tempArray = [];
            res.forEach(element => {
                const tempValue = { label: element[`upper(item)`], value: element[`upper(item)`] }
                tempArray.push(tempValue)
            });

            setItemOptions(tempArray);
        }).catch((err) => {
            // console.log(err);
        })
    }, []);


    const getStockPosition = async () => {
        const result = await Transaction.getStockPosition(reportType, findLotNumber, order, moment.utc(toDate).valueOf(), item, selectedItems);
        setLoader(true);
        if (result.length === 0) {
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
            console.log(result);

            var id = '';
            var balance = 0;
            for (var i = 0; i < result.length; i++) {
                if (id !== result[i].id) {
                    id = result[i].id
                    balance = result[i].quantity
                }
                balance = balance - (result[i].issued ? result[i].issued : 0);
                result[i].balance = balance;

            }



            await StockReportPdf(result, toDate);
            setLoader(false);
        }



    }

    const previewStockPosition = async () => {
        const result = await Transaction.getStockPosition(reportType, findLotNumber, order, moment.utc(toDate).valueOf(), item, selectedItems);
        setDataList(result);
        // console.log(result);
    }


    const onchangeReportType = (e) => {
        setReportType(e);

        if (e === '1') {
            setOrder('3');
            setShowFindLotNumber(true);
        }
        else {
            setShowFindLotNumber(false);
        }


    }


    function DataTabelModel(props) {
        const { row } = props;

        return (
            <>
                <DataTable.Row key={row.id}>
                    <DataTable.Cell>{row.receivedDate ? moment(row.receivedDate).format("DD/MM/YYYY") : ''}</DataTable.Cell>
                    <DataTable.Cell>{row.lotnumber}</DataTable.Cell>
                    <DataTable.Cell>{row.item}</DataTable.Cell>
                    <DataTable.Cell>{row.quantity}</DataTable.Cell>
                    <DataTable.Cell>{row.unit}</DataTable.Cell>
                    <DataTable.Cell>{row.gatePassDate ? moment(row.gatePassDate).format("DD/MM/YYYY") : ''}</DataTable.Cell>
                    <DataTable.Cell>{row.gatepass}</DataTable.Cell>
                    <DataTable.Cell>{row.issued}</DataTable.Cell>
                    <DataTable.Cell>{row.marka}</DataTable.Cell>
                    <DataTable.Cell>{row.location}</DataTable.Cell>
                </DataTable.Row>
                {/* <Divider bold={true} /> */}
            </>
        )
    }



    return (
        <>
            <ScrollView automaticallyAdjustKeyboardInsets={true}>
                <View style={styles.container}>
                    {renderLabelReport()}
                    <Dropdown
                        style={[styles.dropdown, isFocusReport && { borderColor: 'blue' }]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        data={reportTypeMenu}
                        search
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder={!isFocusReport ? 'Select Report Type' : '...'}
                        searchPlaceholder="Search..."
                        value={reportType}
                        itemTextStyle={{ textTransform: 'capitalize' }}
                        onFocus={() => setIsFocusReport(true)}
                        onBlur={() => setIsFocusReport(false)}
                        onChange={item => {
                            onchangeReportType(item.value);
                            setIsFocusReport(false);
                        }} />
                </View>

                {showFindLotNumber && <View style={styles.container}>
                    <TextInput
                        mode={'outlined'}
                        style={{ backgroundColor: 'white' }}
                        label="LotNumber"
                        value={findLotNumber}
                        onChangeText={text => setFindLotNumber(text)}
                    />
                    {errorLotNumber && <Text style={{ marginLeft: 10, color: 'red' }}>{errorLotNumber}</Text>}
                </View>}


                {!showFindLotNumber && <View style={styles.container}>
                    {renderLabelOrder()}
                    <Dropdown
                        style={[styles.dropdown, isFocusOrder && { borderColor: 'blue' }]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        data={orderMenu}
                        search
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder={!isFocusOrder ? 'Select Order Type' : '...'}
                        searchPlaceholder="Search..."
                        value={order}
                        itemTextStyle={{ textTransform: 'capitalize' }}
                        onFocus={() => setIsFocusOrder(true)}
                        onBlur={() => setIsFocusOrder(false)}
                        onChange={item => {
                            setOrder(item.value);
                            setIsFocusOrder(false);
                        }} />
                </View>}
                <View style={{
                    backgroundColor: 'white',
                    padding: 16, flexDirection: 'row'
                }}>
                    <Text style={{ fontSize: 18, width: '30%' }}>Date To:   </Text>
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
                            mode={'date'}
                            onChange={onChangeToDate}
                            display={Platform.OS === "android" ? "default" : "spinner"}
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
                <View style={styles.container}>
                    {renderLabelItem()}
                    <Dropdown
                        style={[styles.dropdown, isFocuseItem && { borderColor: 'blue' }]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        data={itemSelectionMenu}
                        search
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder={!isFocuseItem ? 'Item' : '...'}
                        searchPlaceholder="Search..."
                        value={item}
                        itemTextStyle={{ textTransform: 'capitalize' }}
                        onFocus={() => setIsFocusItem(true)}
                        onBlur={() => setIsFocusOrder(false)}
                        onChange={item => {
                            setItem(item.value);
                            setIsFocusItem(false);
                        }} />
                </View>
                {item === '2' && <View style={styles.container}>
                    <MultiSelect
                        // inside
                        statusBarIsTranslucent={true}
                        // ref={ref}
                        style={styles.dropdown}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        search
                        activeColor='#007aff'
                        data={itemOprions}
                        labelField="label"
                        valueField="value"
                        placeholder="Select item"
                        searchPlaceholder="Search..."
                        value={selectedItems}
                        onChange={(item) => {
                            setSelectedItems(item);
                        }}
                        selectedStyle={styles.selectedStyle}

                    />
                </View>}
                <View style={styles.container}>
                    {loader && <ActivityIndicator size="large" />}
                </View>
                <View style={styles.container}>
                    <View style={[styles.container, { alignSelf: 'center', alignContent: 'center', alignItems: 'center', flexDirection: 'row' }]}>
                        <Pressable style={{ alignContent: 'center', alignItems: 'center', paddingRight: 30 }}
                            onPress={previewStockPosition}
                        >
                            <Text style={{ marginTop: 7, color: '#007aff' }}>Preview</Text>
                        </Pressable>

                        <Pressable style={{ alignContent: 'center', alignItems: 'center' }}
                            onPress={() => { getStockPosition() }}
                        >
                            <Text style={{ marginTop: 7, color: '#007aff' }}>Download</Text>
                        </Pressable>
                    </View>
                </View>


                <ScrollView horizontal={true} style={styles.container}>
                    <DataTable style={{ width: 950 }}>
                        <DataTable.Header>
                            <DataTable.Title>Recd Date</DataTable.Title>
                            <DataTable.Title >Lot no.</DataTable.Title>
                            <DataTable.Title >Item</DataTable.Title>
                            <DataTable.Title >Recvd</DataTable.Title>
                            <DataTable.Title >Unit</DataTable.Title>
                            <DataTable.Title >G.P.Date</DataTable.Title>
                            <DataTable.Title >G.Pass</DataTable.Title>
                            <DataTable.Title >Issued</DataTable.Title>
                            <DataTable.Title >Marka</DataTable.Title>
                            <DataTable.Title >Locn</DataTable.Title>
                        </DataTable.Header>
                        {dataList.slice(page * itemsPerPage, page * itemsPerPage + itemsPerPage).map((el, index) => (
                            <DataTabelModel key={el.id + '-' + index} row={el} />
                        ))}


                        <DataTable.Pagination
                            style={{ width: 400 }}
                            page={page}
                            onPageChange={(page) => setPage(page)}
                            label={`${from}-${to} of ${dataList.length}`}
                            numberOfItemsPerPageList={optionsPerPage}
                            numberOfItemsPerPage={itemsPerPage}
                            onItemsPerPageChange={setItemsPerPage}
                            selectPageDropdownLabel={'Rows per page'}
                        />
                    </DataTable>
                </ScrollView>


            </ScrollView>

        </>
    )
}


export default StockPositionUser;


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
        textTransform: 'capitalize',

    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    datePickerStyle: {
        width: '90%',
        marginTop: 20,
    },
    selectedStyle: {
        borderRadius: 12,
        color: '#007aff'
    },
    datepicker: {
        height: 120,
        marginTop: -10
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
    }
});