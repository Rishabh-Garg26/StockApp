import { Alert, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import Transaction from "../services/transaction";
import moment from 'moment';
import ImageView from "react-native-image-viewing";
import * as FileSystem from 'expo-file-system';
import { Dropdown } from "react-native-element-dropdown";
import { 
  Card, YStack, XStack, Button, Text, H2, Paragraph, Spinner, View, Label, Input 
} from 'tamagui';
import { Icon } from "@rneui/themed";
import Pagination from './common/Pagination';

const ReceivedItemsUser = ({ navigation }) => {
    const [dataList, setDataList] = useState([]);
    const [page, setPage] = useState(0);
    const optionsPerPage = [5, 10, 15];
    const [itemsPerPage, setItemsPerPage] = useState(optionsPerPage[0]);
    const [sortBy, setSortBy] = useState('id');
    const [sortOrder, setSortOrder] = useState('asc');
    const [searchQuery, setSearchQuery] = useState('');
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isFocusSort, setIsFocusSort] = useState(false);

    const sortMenu = [
        { label: 'Lot No asc', value: 'lotnumber-asc' },
        { label: 'Lot No desc', value: 'lotnumber-desc' },
        { label: 'Receive Date asc', value: 'receivedDate-asc' },
        { label: 'Receive Date desc', value: 'receivedDate-desc' },
        { label: 'Payment Date asc', value: 'paymentDate-asc' },
        { label: 'Payment Date desc', value: 'paymentDate-desc' },
        { label: 'Item asc', value: 'item-asc' },
        { label: 'Item desc', value: 'item-desc' },
    ];

    const onchangeSortType = (e) => {
        const [newSortBy, newSortOrder] = e.split('-');
        setSortBy(newSortBy);
        setSortOrder(newSortOrder);
    };

    const onChangeSearch = query => {
        setSearchQuery(query);
    };

    useEffect(() => {
        getReceivedItems();
    }, [page, itemsPerPage, sortBy, sortOrder, searchQuery]);

    const getReceivedItems = async () => {
        try {
            setLoading(true);
            const result = await Transaction.getAllInwardsWithCount(
                itemsPerPage, 
                page * itemsPerPage, 
                sortBy, 
                sortOrder, 
                searchQuery
            );
            
            if (result.data.length !== 0) {
                setDataList(result.data);
                setTotalItems(result.totalCount);
            } else {
                setDataList([]);
                setTotalItems(0);
            }
        } catch (error) {
            console.error('Error fetching received items:', error);
            Alert.alert('Error', 'Failed to load data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const deleteReceivedById = (id, check, imageExist, imageName) => {
        if (check) {
            Alert.alert(
                "Confirm Delete",
                "Are you sure you want to delete this inward record?",
                [
                    { text: "Cancel", style: "cancel" },
                    { text: "Delete", onPress: () => deleteReceivedByIdConfirm(id, imageExist, imageName), style: "destructive" },
                ]
            );
        } else {
            Alert.alert(
                "Cannot Delete",
                "Items have been issued from this lot. Delete outward related to this lot first.",
                [{ text: "Okay", style: "cancel" }]
            );
        }
    };

    const deleteReceivedByIdConfirm = async (id, imageExist, imageName) => {
        try {
            if (imageExist) {
                const destinationUri = FileSystem.documentDirectory;
                imageName.split(',').forEach(async (element) => {
                    await FileSystem.deleteAsync(destinationUri + element);
                });
            }
            
            await Transaction.deleteReceivedById(id);
            
            Alert.alert("Success", "Inward deleted successfully", [{ text: "Okay", style: "cancel" }]);
            
            getReceivedItems();
        } catch (error) {
            console.error('Error deleting item:', error);
            Alert.alert("Error", "Failed to delete. Please try again.", [{ text: "Okay", style: "cancel" }]);
        }
    };

    const renderDataItem = (row) => {
        const canDelete = row.quantity === row.balance;
        
        return (
            <Card key={row.id} elevate size="$2" padding="$4" borderRadius="$3" marginBottom="$2" backgroundColor="white">
                <YStack space="$3">
                    {/* Received Date and Lot Number */}
                    <XStack justifyContent="space-between" alignItems="center">
                        <YStack flex={1}>
                            <Text fontWeight="700" fontSize="$3" color="$color11">Recd Date</Text>
                            <Text fontSize="$4" color="$color">{row.receivedDate ? moment(row.receivedDate).format("DD/MM/YYYY") : '-'}</Text>
                        </YStack>
                        <YStack flex={1} alignItems="flex-end">
                            <Text fontWeight="700" fontSize="$3" color="$color11">Lot No.</Text>
                            <Text fontSize="$4" color="$color">{row.lotnumber}</Text>
                        </YStack>
                    </XStack>

                    {/* Payment Date and Location */}
                    <XStack justifyContent="space-between" alignItems="center">
                        <YStack flex={1}>
                            <Text fontWeight="700" fontSize="$3" color="$color11">Payment Date</Text>
                            <Text fontSize="$4" color="$color">{row.paymentDate ? moment(row.paymentDate).format("DD/MM/YYYY") : '-'}</Text>
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
                            <Text fontSize="$4" color="$color">{row.quantity}</Text>
                        </YStack>
                        <YStack flex={1} alignItems="flex-end">
                            <Text fontWeight="700" fontSize="$3" color="$color11">Unit</Text>
                            <Text fontSize="$4" color="$color">{row.unit}</Text>
                        </YStack>
                    </XStack>

                    {/* Marka and Balance */}
                    <XStack justifyContent="space-between" alignItems="center">
                        <YStack flex={1}>
                            <Text fontWeight="700" fontSize="$3" color="$color11">Marka</Text>
                            <Text fontSize="$4" color="$color">{row.marka}</Text>
                        </YStack>
                        <YStack flex={1} alignItems="flex-end">
                            <Text fontWeight="700" fontSize="$3" color="$color11">Balance</Text>
                            <Text fontSize="$4" color="$color">{row.balance}</Text>
                        </YStack>
                    </XStack>

                    {/* Action Buttons */}
                    <XStack justifyContent="center" space="$3" marginTop="$2">
                        <Card elevate size="$1" padding="$2" borderRadius="$3" backgroundColor="$blue10">
                            <Button
                                size="$6"
                                backgroundColor="transparent"
                                color="white"
                                onPress={() => {
                                    navigation.navigate('Home!', {
                                        screen: 'Edit Inward',
                                        params: { id: row.id },
                                    })
                                }}
                                borderRadius="$3"
                                icon={<Icon name="edit" size={14} color="white" />}
                                pressStyle={{ backgroundColor: '$blue11' }}
                            >
                                <Text color="white" fontSize="$3" fontWeight="600">Edit</Text>
                            </Button>
                        </Card>
                        
                        <Card elevate size="$1" padding="$2" borderRadius="$3" backgroundColor={canDelete ? "$red10" : "$gray8"}>
                            <Button
                                size="$6"
                                backgroundColor="transparent"
                                color="white"
                                onPress={() => deleteReceivedById(row.id, canDelete, row.imageExist, row.imageName)}
                                borderRadius="$3"
                                icon={<Icon name="delete-outline" size={14} color="white" />}
                                pressStyle={{ backgroundColor: canDelete ? '$red11' : '$gray9' }}
                                disabled={!canDelete}
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
                        <Icon name="inventory" size={40} color="$green10" />
                        <H2 fontWeight="800" fontSize="$10" padding="$2" color="$color" textAlign="center">
                            Received Items
                        </H2>
                        <Paragraph textAlign="center" fontSize="$4" color="$color11">
                            View and manage all received/inward items.
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
                                onPress={() => navigation.navigate('Add New Inward')}
                                borderRadius="$4"
                                icon={<Icon name="add" size={24} color="white" />}
                                pressStyle={{ backgroundColor: '$green11' }}
                            >
                                <Text color="white" fontSize="$5" fontWeight="700">Add New Inward</Text>
                            </Button>
                        </Card>

                        <Card elevate size="$3" padding="$3" borderRadius="$4" backgroundColor="$blue10">
                            <Button
                                size="$5"
                                backgroundColor="transparent"
                                color="white"
                                onPress={() => navigation.navigate('Inward Report')}
                                borderRadius="$4"
                                icon={<Icon name="assessment" size={24} color="white" />}
                                pressStyle={{ backgroundColor: '$blue11' }}
                            >
                                <Text color="white" fontSize="$5" fontWeight="700">Inward Report</Text>
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
                            Received Items List
                        </H2>

                        {loading ? (
                            <YStack alignItems="center" padding="$6">
                                <Spinner size="large" color="$green10" />
                                <Text marginTop="$3" fontSize="$4" color="$color11">Loading items...</Text>
                            </YStack>
                        ) : dataList.length === 0 ? (
                            <YStack alignItems="center" padding="$6">
                                <Icon name="inbox" size={60} color="$color8" />
                                <Text marginTop="$3" fontSize="$5" color="$color11" textAlign="center">
                                    No received items found
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

export default ReceivedItemsUser;