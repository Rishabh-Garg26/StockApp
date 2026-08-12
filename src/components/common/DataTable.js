import React, { useState } from 'react';
import { Alert } from 'react-native';
import { 
  View, 
  Text, 
  Button, 
  YStack, 
  XStack, 
  Card
} from 'tamagui';
import { Icon } from "@rneui/themed";
import ImageView from "react-native-image-viewing";
import * as FileSystem from 'expo-file-system';
import moment from 'moment';

const DataTable = ({ 
  data, 
  columns, 
  actions, 
  onEdit, 
  onDelete, 
  onViewImage,
  imageField = 'imageName',
  imageExistField = 'imageExist'
}) => {
  const [showImageView, setShowImageView] = useState({});

  const handleViewImage = (row) => {
    if (row[imageExistField] === 1 && row[imageField]) {
      setShowImageView(prev => ({ ...prev, [row.id]: true }));
    }
  };

  const handleEdit = (row) => {
    if (onEdit) {
      onEdit(row);
    }
  };

  const handleDelete = (row) => {
    if (onDelete) {
      Alert.alert(
        "Confirm Delete",
        "Are you sure you want to delete this item?",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => onDelete(row)
          }
        ]
      );
    }
  };

  const renderRow = (row) => {
    const destinationUri = FileSystem.documentDirectory;
    const images = row[imageField] ? row[imageField].split(",").map((item) => ({
      uri: destinationUri + item
    })) : [];

    return (
      <Card key={row.id} marginVertical="$2" padding="$4" backgroundColor="$background" elevation={2}>
        <YStack space="$3">
          {columns.map((column, index) => (
            <XStack key={index} justifyContent="space-between" alignItems="center">
              <Text fontWeight="700" fontSize="$4" color="$color" minWidth={80}>
                {column.label}:
              </Text>
              <Text fontSize="$4" color="$color11" flex={1} textAlign="right">
                {column.type === 'date' 
                  ? (row[column.key] ? moment(row[column.key]).format("DD/MM/YYYY") : '')
                  : row[column.key] || ''
                }
              </Text>
            </XStack>
          ))}
          
          <XStack justifyContent="center" space="$3" marginTop="$3">
            {row[imageExistField] === 1 && (
              <Button
                size="$3"
                backgroundColor="$blue10"
                color="white"
                onPress={() => handleViewImage(row)}
                borderRadius="$3"
                pressStyle={{ backgroundColor: '$blue11' }}
                icon={<Icon name="image" size={16} color="white" />}
                minWidth={100}
                height={40}
              >
                <Text color="white" fontSize="$3" fontWeight="600">
                  View Image
                </Text>
              </Button>
            )}
            
            <Button
              size="$3"
              backgroundColor="$orange10"
              color="white"
              onPress={() => handleEdit(row)}
              borderRadius="$3"
              pressStyle={{ backgroundColor: '$orange11' }}
              icon={<Icon name="edit" size={16} color="white" />}
              minWidth={80}
              height={40}
            >
              <Text color="white" fontSize="$3" fontWeight="600">
                Edit
              </Text>
            </Button>
            
            <Button
              size="$3"
              backgroundColor="$red10"
              color="white"
              onPress={() => handleDelete(row)}
              borderRadius="$3"
              pressStyle={{ backgroundColor: '$red11' }}
              icon={<Icon name="delete" size={16} color="white" />}
              minWidth={80}
              height={40}
            >
              <Text color="white" fontSize="$3" fontWeight="600">
                Delete
              </Text>
            </Button>

            <ImageView
              images={images}
              imageIndex={0}
              visible={showImageView[row.id] || false}
              onRequestClose={() => setShowImageView(prev => ({ ...prev, [row.id]: false }))}
            />
          </XStack>
        </YStack>
      </Card>
    );
  };

  return (
    <YStack space="$2" backgroundColor="$background">
      {data.map(renderRow)}
    </YStack>
  );
};

export default DataTable; 