import { StyleSheet, Text, View, Modal, Pressable, ScrollView, Alert, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { Button, DataTable, Divider, IconButton, Menu } from 'react-native-paper';
import Transaction from "../services/transaction";
import moment from 'moment';
import ImageView from "react-native-image-viewing";
import * as FileSystem from 'expo-file-system';
import { Dropdown } from "react-native-element-dropdown";
import { Searchbar } from 'react-native-paper';


const ReceivedItemsUser = ({ navigation }) => {
    const [dataList, setDataList] = useState([]);
    const [page, setPage] = useState(0);
    const optionsPerPage = [5, 10, 15];
    const [itemsPerPage, setItemsPerPage] = useState(optionsPerPage[0]);
    const from = Math.min((page * itemsPerPage) + 1, dataList.length);
    const to = Math.min((page + 1) * itemsPerPage, dataList.length);
    const [sortBy, setSortBy] = useState('');
    const [isFocusSort, setIsFocusSort] = useState(false);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [constantData, setConstantData] = useState([]);
    const sortMenu = [
        { label: 'Lot No asc', value: '1' },
        { label: 'Lot No desc', value: '2' },
        { label: 'Receive Date asc', value: '3' },
        { label: 'Receive Date desc', value: '4' },
        { label: 'Payment Date asc', value: '5' },
        { label: 'Payment Date desc', value: '6' },
        { label: 'Item asc', value: '7' },
        { label: 'Item desc', value: '8' },
    ]
    const onchangeSortType = (e) => {
        setSortBy(e);
        var tempArray = [...constantData]
        switch (e) {
            case "1": tempArray.sort((a, b) => a.lotnumber >= b.lotnumber ? 1 : -1); break;
            case "2": tempArray.sort((a, b) => a.lotnumber <= b.lotnumber ? 1 : -1); break;
            case "3": tempArray.sort((a, b) => a.receivedDate >= b.receivedDate ? 1 : -1); break;
            case "4": tempArray.sort((a, b) => a.receivedDate >= b.receivedDate ? 1 : -1); break;
            case "5": tempArray.sort((a, b) => a.paymentDate >= b.paymentDate ? 1 : -1); break;
            case "6": tempArray.sort((a, b) => a.paymentDate >= b.paymentDate ? 1 : -1); break;
            case "7": tempArray.sort((a, b) => a.item >= b.item ? 1 : -1); break;
            case "8": tempArray.sort((a, b) => a.item >= b.item ? 1 : -1); break;
            default:
        }
        setConstantData(tempArray);
        if (searchQuery === '' || searchQuery === null) {
            setDataList(tempArray);
        }
        else {
            var tempDataList = tempArray.filter((item) => {
                for (let value of Object.values(item)) {
                    // Check if the value matches the query
                    if (typeof value === 'string' && value.toLowerCase().includes(query.toLowerCase())) {
                        return true; // Return true if there's a match
                    } else if (typeof value === 'number' && value.toString().includes(query)) {
                        return true; // Return true if there's a match
                    }
                }
                return false; // Return false if no match is found
            })
            setDataList(tempDataList);
        }
    }


    const onChangeSearch = query => {

        setSearchQuery(query);
        console.log(query);
        if (query === '' || query === null) {
            setDataList(constantData);
        }
        else {
            var tempArray = dataList.filter((item) => {
                for (let value of Object.values(item)) {
                    // Check if the value matches the query
                    if (typeof value === 'string' && value.toLowerCase().includes(query.toLowerCase())) {
                        return true; // Return true if there's a match
                    } else if (typeof value === 'number' && value.toString().includes(query)) {
                        return true; // Return true if there's a match
                    }
                }
                return false; // Return false if no match is found
            })
            setDataList(tempArray);
        }





    }

    useEffect(() => {
        getReceivedItems();
    }, []);

    const getReceivedItems = async () => {
        try {
            const result = await Transaction.getAllInwards();
            if (result.length !== 0) {
                setConstantData(result);
                setDataList(result);
            }
        } catch (error) {

        }

    }

    const deleteReceivedById = (id, check, imageExist, imageName) => {

        if (check) {
            Alert.alert(
                "Confirm",
                "Click on Okay to confirm delete",
                [
                    {
                        text: "Cancel",
                        style: "cancel"
                    },
                    {
                        text: "Okay",
                        onPress: () => { deleteReceivedByIdConfirm(id, imageExist, imageName) },
                        style: "cancel"
                    },

                ]
            );
        }
        else {
            Alert.alert(
                "Warning",
                "Items have been issued from this lot. Delete outward related to this lot first ",
                [
                    {
                        text: "Okay",
                        style: "cancel"
                    },

                ]
            );
        }




    }

    const deleteReceivedByIdConfirm = async (id, imageExist, imageName) => {
        try {

            if (imageExist) {
                const destinationUri = FileSystem.documentDirectory;
                imageName.split(',').forEach(async (element) => {
                    await FileSystem.deleteAsync(destinationUri + element);
                });
            }
            await Transaction.deleteReceivedById(id);


            Alert.alert(
                "Success",
                "Inward deleted successfully",
                [
                    {
                        text: "Okay",
                        style: "cancel"
                    },
                ]
            );




            let index = -1;
            let tempArray = [...dataList];
            for (let i = 0; i < dataList.length; i++) {
                // console.log(constantData[i].id, id)
                if (dataList[i].id === id) {
                    index = i;
                    break;
                }
            }
            tempArray.splice(index, 1);
            setDataList(tempArray);


        } catch (error) {

            Alert.alert(
                "Failure",
                "Try again later",
                [
                    {
                        text: "Okay",
                        style: "cancel"
                    },
                ]
            );
        }
    }


    const renderLabelSort = () => {
        if (sortBy || isFocusSort) {
            return (
                <Text style={[styles.label, isFocusSort && { color: 'blue' }]}>
                    Sort By
                </Text>
            );
        }
        return null;
    };


    function DataTabelModel(props) {
        const { row } = props;
        const [visible, setVisible] = useState(false);
        const [show, setShow] = useState(false);
        const openMenu = () => setVisible(true);

        const closeMenu = () => setVisible(false);

        const destinationUri = FileSystem.documentDirectory;
        const Images = row.imageName.split(",").map((item) => (
            { uri: destinationUri + item }
        ))

        return (
            <>

                <View style={{ paddingVertical: 10 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontWeight: '700', width: '30%', fontSize: 16 }}>Receive Date: </Text>
                        <Text style={{ width: '30%', fontSize: 16 }}>{row.receivedDate ? moment(row.receivedDate).format("DD/MM/YYYY") : ''}</Text>
                        <Text style={{ fontWeight: '700', width: '20%', fontSize: 16 }}>Lot No.: </Text>
                        <Text style={{ width: '20%', fontSize: 16 }}>{row.lotnumber}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', paddingVertical: 10 }}>
                        <Text style={{ fontWeight: '700', width: '30%', fontSize: 16 }}>Paymnt Date: </Text>
                        <Text style={{ width: '30%', fontSize: 16 }}>{row.paymentDate ? moment(row.paymentDate).format("DD/MM/YYYY") : ''}</Text>
                        <Text style={{ fontWeight: '700', width: '20%', fontSize: 16 }}>Location:</Text>
                        <Text style={{ width: '20%', fontSize: 16 }}>{row.location}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontWeight: '700', width: '15%', fontSize: 16 }}>Item: </Text>
                        <Text style={{ width: '18%', fontSize: 16 }}>{row.item}</Text>
                        <Text style={{ fontWeight: '700', width: '16%', fontSize: 16 }}>QTY: </Text>
                        <Text style={{ width: '18%', fontSize: 16 }}>{row.quantity}</Text>
                        <Text style={{ fontWeight: '700', width: '15%', fontSize: 16 }}>Unit: </Text>
                        <Text style={{ width: '18%', fontSize: 16 }}>{row.unit}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', paddingVertical: 10 }}>
                        <Text style={{ fontWeight: '700', width: '20%', fontSize: 16 }}>Marka: </Text>
                        <Text style={{ width: '30%', fontSize: 16 }}>{row.marka}</Text>
                        <Text style={{ fontWeight: '700', width: '20%', fontSize: 16 }}>Balance: </Text>
                        <Text style={{ width: '30%', fontSize: 16 }}>{row.balance}</Text>
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                        }}>
                        <Menu
                            visible={visible}
                            onDismiss={closeMenu}
                            anchor={<Button onPress={openMenu}>Options</Button>}>
                            {row.imageExist === 1 && <Menu.Item onPress={() => { setShow(true); closeMenu() }} title="View Image" />}
                            <Menu.Item onPress={() => {
                                navigation.navigate('Home!',
                                    {
                                        screen: 'Edit Inward',
                                        params: { id: row.id },
                                    })
                            }} title="Edit" />
                            <Menu.Item onPress={() => { deleteReceivedById(row.id, (row.quantity === row.balance), row.imageExist, row.imageName) }} title="Delete" />
                            <Divider />
                        </Menu>

                        <ImageView
                            images={Images}
                            imageIndex={0}
                            visible={show}
                            onRequestClose={() => setShow(false)}
                        />

                    </View>
                </View>
                <Divider bold={true} />
            </>
        )
    }


    return (
        <ScrollView style={{ backgroundColor: 'white' }}>

            <View style={{ padding: 20 }}>

                <Button
                    style={{ height: 60 }} labelStyle={{ marginTop: 15, fontSize: 18 }} mode="contained"
                    onPress={() => navigation.navigate('Add New Inward')}
                >
                    <Text style={{ color: 'white', textAlign: 'center', fontSize: 18 }}>New Entry</Text>
                </Button>
            </View>
            <View style={{ paddingHorizontal: 20 }}>

                <Button
                    style={{ height: 60 }} labelStyle={{ marginTop: 15, fontSize: 18 }} mode="contained"
                    onPress={() => navigation.navigate('Inward Report')}
                >
                    <Text style={{ color: 'white', textAlign: 'center', fontSize: 18 }}>Click for Inward Reports</Text>
                </Button>
            </View>

            <View style={{ marginTop: 30, padding: 20 }}>
                {renderLabelSort()}
                <Dropdown
                    style={[styles.dropdown, isFocusSort && { borderColor: 'blue' }]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    data={sortMenu}
                    search
                    maxHeight={300}

                    labelField="label"
                    valueField="value"
                    placeholder={!isFocusSort ? 'Select Sort Type' : '...'}
                    searchPlaceholder="Search..."
                    value={sortBy}
                    itemTextStyle={{ textTransform: 'capitalize' }}
                    onFocus={() => setIsFocusSort(true)}
                    onBlur={() => setIsFocusSort(false)}
                    onChange={item => {
                        onchangeSortType(item.value);
                        setIsFocusSort(false);
                    }} />
            </View>

            <Searchbar
                placeholder="Search"
                onChangeText={onChangeSearch}
                value={searchQuery}
            />


            <View style={styles.container}>


                <Divider />




                <DataTable>

                    {dataList.slice(page * itemsPerPage, page * itemsPerPage + itemsPerPage).map((el) => (
                        <DataTabelModel key={el.id} row={el} />
                    ))}


                    <DataTable.Pagination
                        page={page}
                        onPageChange={(page) => setPage(page)}
                        label={`${from}-${to} of ${dataList.length}`}
                        numberOfItemsPerPageList={optionsPerPage}
                        numberOfItemsPerPage={itemsPerPage}
                        onItemsPerPageChange={setItemsPerPage}
                        selectPageDropdownLabel={'Rows per page'}
                    />
                </DataTable>


            </View>
        </ScrollView >


    )
}


export default ReceivedItemsUser;


const styles = StyleSheet.create({
    containerI: {
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
        height: '80%',
        resizeMode: 'contain',
    },
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
    }
});