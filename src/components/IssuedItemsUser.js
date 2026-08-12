import { Alert, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import moment from 'moment';
import Transaction from "../services/transaction";
import { Dropdown } from "react-native-element-dropdown";
import { Icon } from "@rneui/themed";
import { 
  Card, YStack, XStack, Button, Text, H2, Paragraph, Spinner, View, Label, Input 
} from 'tamagui';
import Pagination from './common/Pagination';
import DataTable from './common/DataTable';

const IssuedItemsUser = ({ navigation }) => {
    const [dataList, setDataList] = useState([]);
    const [page, setPage] = useState(0);
    const optionsPerPage = [5, 10, 15];
    const [itemsPerPage, setItemsPerPage] = useState(optionsPerPage[0]);
    const [sortBy, setSortBy] = useState('id');
    const [sortOrder, setSortOrder] = useState('asc');
    const [isFocusSort, setIsFocusSort] = useState(false);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(false);

    const sortMenu = [
        { label: 'Lot No asc', value: 'lotnumber-asc' },
        { label: 'Lot No desc', value: 'lotnumber-desc' },
        { label: 'Receive Date asc', value: 'receivedDate-asc' },
        { label: 'Receive Date desc', value: 'receivedDate-desc' },
        { label: 'GatePassDate Date asc', value: 'gatePassDate-asc' },
        { label: 'GatePassDate Date desc', value: 'gatePassDate-desc' },
        { label: 'Item asc', value: 'item-asc' },
        { label: 'Item desc', value: 'item-desc' },
    ]

    const onchangeSortType = (e) => {
        const [newSortBy, newSortOrder] = e.split('-');
        setSortBy(newSortBy);
        setSortOrder(newSortOrder);
    }

    const onChangeSearch = query => {
        setSearchQuery(query);
    }

    useEffect(() => {
        getIssuedItems();
    }, [page, itemsPerPage, sortBy, sortOrder, searchQuery]);

    const getIssuedItems = async () => {
        try {
            setLoading(true);
            const result = await Transaction.getAllOutward(itemsPerPage, page * itemsPerPage, sortBy, sortOrder, searchQuery);
            const countResult = await Transaction.getOutwardCount(searchQuery);
            if (result.length !== 0) {
                setDataList(result);
                setTotalItems(countResult[0]['count(*)'])
            }
            setLoading(false);
        } catch (error) {
            console.error('Error getting issued items:', error);
            setLoading(false);
        }
    }

    const deleteIssuedById = (id, issued, receivedId) => {
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
                    onPress: () => { deleteIssuedByIdConfirm(id, issued, receivedId) },
                    style: "cancel"
                },
            ]
        );
    }

    const deleteIssuedByIdConfirm = async (id, issued, receivedId) => {
        try {
            await Transaction.deleteIssuedById(id, issued, receivedId);
            Alert.alert(
                "Success",
                "Outward deleted successfully",
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

    const renderDataItem = (row) => {
        return (
            <Card key={row.id} elevate size="$2" padding="$4" borderRadius="$3" marginBottom="$2" backgroundColor="white">
                <YStack space="$3">
                    {/* Gate Pass Date and Lot Number */}
                    <XStack justifyContent="space-between" alignItems="center">
                        <YStack flex={1}>
                            <Text fontWeight="700" fontSize="$3" color="$color11">G.P. Date</Text>
                            <Text fontSize="$4" color="$color">{row.gatePassDate ? moment(row.gatePassDate).format("DD/MM/YYYY") : '-'}</Text>
                        </YStack>
                        <YStack flex={1} alignItems="flex-end">
                            <Text fontWeight="700" fontSize="$3" color="$color11">Lot No.</Text>
                            <Text fontSize="$4" color="$color">{row.lotnumber}</Text>
                        </YStack>
                    </XStack>

                    {/* Received Date and Location */}
                    <XStack justifyContent="space-between" alignItems="center">
                        <YStack flex={1}>
                            <Text fontWeight="700" fontSize="$3" color="$color11">Recd Date</Text>
                            <Text fontSize="$4" color="$color">{row.receivedDate ? moment(row.receivedDate).format("DD/MM/YYYY") : '-'}</Text>
                        </YStack>
                        <YStack flex={1} alignItems="flex-end">
                            <Text fontWeight="700" fontSize="$3" color="$color11">Location</Text>
                            <Text fontSize="$4" color="$color">{row.location}</Text>
                        </YStack>
                    </XStack>

                    {/* Item, Quantity, and Unit */}
                    <XStack justifyContent="space-between" alignItems="center">
                        <YStack flex={1}>
                            <Text fontWeight="700" fontSize="$3" color="$color11">Item</Text>
                            <Text fontSize="$4" color="$color">{row.item}</Text>
                        </YStack>
                        <YStack flex={1} alignItems="center">
                            <Text fontWeight="700" fontSize="$3" color="$color11">QTY</Text>
                            <Text fontSize="$4" color="$color">{row.issued}</Text>
                        </YStack>
                        <YStack flex={1} alignItems="flex-end">
                            <Text fontWeight="700" fontSize="$3" color="$color11">Unit</Text>
                            <Text fontSize="$4" color="$color">{row.unit}</Text>
                        </YStack>
                    </XStack>

                    {/* Gate Pass */}
                    <YStack>
                        <Text fontWeight="700" fontSize="$3" color="$color11">G.Pass</Text>
                        <Text fontSize="$4" color="$color">{row.gatepass}</Text>
                    </YStack>

                    {/* Action Buttons */}
                    <XStack justifyContent="center" space="$3" marginTop="$2">
                        <Card elevate size="$1" padding="$2" borderRadius="$3" backgroundColor="$blue10">
                            <Button
                                size="$3"
                                backgroundColor="transparent"
                                color="white"
                                onPress={() => {
                                    navigation.navigate('Home!', {
                                        screen: 'Edit Outward',
                                        params: { id: row.id },
                                    })
                                }}
                                borderRadius="$3"
                                icon={<Icon name="edit" size={16} color="white" />}
                                pressStyle={{ backgroundColor: '$blue11' }}
                            >
                                <Text color="white" fontSize="$3" fontWeight="600">Edit</Text>
                            </Button>
                        </Card>
                        
                        <Card elevate size="$1" padding="$2" borderRadius="$3" backgroundColor="$red10">
                            <Button
                                size="$3"
                                backgroundColor="transparent"
                                color="white"
                                onPress={() => deleteIssuedById(row.id, row.issued, row.receivedId)}
                                borderRadius="$3"
                                icon={<Icon name="delete-outline" size={16} color="white" />}
                                pressStyle={{ backgroundColor: '$red11' }}
                            >
                                <Text color="white" fontSize="$3" fontWeight="600">Delete</Text>
                            </Button>
                        </Card>
                    </XStack>
                </YStack>
            </Card>
        );
    };

    return (
        <ScrollView 
            style={{ flex: 1, backgroundColor: '#f5f5f5' }}
            contentContainerStyle={{ paddingBottom: 50 }}
            showsVerticalScrollIndicator={false}
        >
            <YStack p="$4" space="$4" paddingTop="$6">
                {/* Header */}
                <Card elevate size="$4" padding="$5" borderRadius="$5" marginTop="$2">
                    <YStack space="$5" alignItems="center">
                        <Icon name="exit-to-app" size={40} color="$orange10" />
                        <H2 fontWeight="800" fontSize="$10" padding="$2" color="$color" textAlign="center">
                            Issued Items
                        </H2>
                        <Paragraph textAlign="center" fontSize="$4" color="$color11">
                            View and manage all issued/outward items.
                        </Paragraph>
                    </YStack>
                </Card>

                {/* Action Buttons */}
                <Card elevate size="$4" padding="$5" borderRadius="$5">
                    <YStack space="$4">
                        <H2 fontWeight="700" fontSize="$6" color="$color" textAlign="center" marginBottom="$2">
                            Quick Actions
                        </H2>
                        
                        <Card elevate size="$3" padding="$3" borderRadius="$4" backgroundColor="$green10">
                            <Button
                                size="$5"
                                backgroundColor="transparent"
                                color="white"
                                onPress={() => navigation.navigate('Add New Outward')}
                                borderRadius="$4"
                                icon={<Icon name="add" size={24} color="white" />}
                                pressStyle={{ backgroundColor: '$green11' }}
                            >
                                <Text color="white" fontSize="$5" fontWeight="700">Add New Outward</Text>
                            </Button>
                        </Card>

                        <Card elevate size="$3" padding="$3" borderRadius="$4" backgroundColor="$blue10">
                            <Button
                                size="$5"
                                backgroundColor="transparent"
                                color="white"
                                onPress={() => navigation.navigate('Outward Report')}
                                borderRadius="$4"
                                icon={<Icon name="assessment" size={24} color="white" />}
                                pressStyle={{ backgroundColor: '$blue11' }}
                            >
                                <Text color="white" fontSize="$5" fontWeight="700">Outward Report</Text>
                            </Button>
                        </Card>
                    </YStack>
                </Card>

                {/* Search and Filter */}
                <Card elevate size="$4" padding="$5" borderRadius="$5">
                    <YStack space="$4">
                        <H2 fontWeight="700" fontSize="$6" color="$color" textAlign="center" marginBottom="$2">
                            Search & Filter
                        </H2>

                        {/* Search Input */}
                        <Label fontWeight="700" fontSize="$4" color="$color">Search Items</Label>
                        <Card elevate size="$2" padding="$3" borderRadius="$3" backgroundColor="white">
                            <Input
                                value={searchQuery}
                                onChangeText={onChangeSearch}
                                placeholder="Search by item, lot number, location..."
                                size="$4"
                                borderWidth={0}
                                backgroundColor="transparent"
                                fontSize="$4"
                                color="$color"
                                placeholderTextColor="$color8"
                                icon={<Icon name="search" size={20} color="$color8" />}
                            />
                        </Card>

                        {/* Sort Dropdown */}
                        <Label fontWeight="700" fontSize="$4" color="$color">Sort By</Label>
                        <Card elevate size="$2" padding="$3" borderRadius="$3" backgroundColor="white">
                            <Dropdown
                                style={{
                                    height: 44,
                                    borderWidth: 0,
                                    borderRadius: 8,
                                    paddingHorizontal: 8,
                                }}
                                placeholderStyle={{
                                    fontSize: 16,
                                    color: '#666',
                                }}
                                selectedTextStyle={{
                                    fontSize: 16,
                                    color: '#333',
                                    fontWeight: '600',
                                }}
                                inputSearchStyle={{
                                    height: 40,
                                    fontSize: 16,
                                }}
                                data={sortMenu}
                                search
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder="Select Sort Type"
                                searchPlaceholder="Search..."
                                value={`${sortBy}-${sortOrder}`}
                                itemTextStyle={{ textTransform: 'capitalize' }}
                                onFocus={() => setIsFocusSort(true)}
                                onBlur={() => setIsFocusSort(false)}
                                onChange={item => {
                                    onchangeSortType(item.value);
                                    setIsFocusSort(false);
                                }}
                            />
                        </Card>
                    </YStack>
                </Card>

                {/* Data Display */}
                <Card elevate size="$4" padding="$5" borderRadius="$5">
                    <YStack space="$4">
                        <H2 fontWeight="700" fontSize="$6" color="$color" textAlign="center" marginBottom="$2">
                            Issued Items List
                        </H2>

                        {loading ? (
                            <YStack alignItems="center" padding="$6">
                                <Spinner size="large" color="$blue10" />
                                <Text marginTop="$3" fontSize="$4" color="$color11">Loading items...</Text>
                            </YStack>
                        ) : dataList.length === 0 ? (
                            <YStack alignItems="center" padding="$6">
                                <Icon name="inbox" size={60} color="$color8" />
                                <Text marginTop="$3" fontSize="$5" color="$color11" textAlign="center">
                                    No issued items found
                                </Text>
                                <Text fontSize="$3" color="$color8" textAlign="center">
                                    Try adjusting your search or filters
                                </Text>
                            </YStack>
                        ) : (
                            <YStack space="$3">
                                {dataList.map((item) => renderDataItem(item))}
                            </YStack>
                        )}
                    </YStack>
                </Card>

                {/* Pagination */}
                {dataList.length > 0 && (
                    <Card elevate size="$3" padding="$4" borderRadius="$4" backgroundColor="white">
                        <Pagination
                            currentPage={page}
                            totalItems={totalItems}
                            itemsPerPage={itemsPerPage}
                            onPageChange={setPage}
                            onItemsPerPageChange={setItemsPerPage}
                            itemsPerPageOptions={optionsPerPage}
                        />
                    </Card>
                )}
            </YStack>
        </ScrollView>
    );
};

export default IssuedItemsUser;