import React from 'react';
import { 
  View, 
  Text, 
  Button, 
  YStack, 
  XStack,
  Card
} from 'tamagui';
import { Icon } from "@rneui/themed";

const Pagination = ({
  page,
  setPage,
  itemsPerPage,
  setItemsPerPage,
  totalItems,
  optionsPerPage = [5, 10, 15, 20]
}) => {
  const from = Math.min(page * itemsPerPage + 1, totalItems);
  const to = Math.min((page + 1) * itemsPerPage, totalItems);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setPage(0); // Reset to first page when changing items per page
  };

  return (
    <Card elevate size="$3" padding="$4" borderRadius="$4" marginTop="$3">
      <YStack space="$4">
        {/* Items per page selector */}
        <XStack justifyContent="space-between" alignItems="center">
          <Text fontSize="$4" fontWeight="700" color="$color">
            Items per page:
          </Text>
          <XStack space="$2">
            {optionsPerPage.map((option) => (
              <Button
                key={option}
                size="$3"
                backgroundColor={itemsPerPage === option ? "$blue10" : "$gray5"}
                color={itemsPerPage === option ? "white" : "$color"}
                onPress={() => handleItemsPerPageChange(option)}
                borderRadius="$3"
                pressStyle={{ backgroundColor: itemsPerPage === option ? '$blue11' : '$gray6' }}
                minWidth={50}
                height={36}
              >
                <Text 
                  color={itemsPerPage === option ? "white" : "$color"} 
                  fontSize="$3" 
                  fontWeight="600"
                >
                  {option}
                </Text>
              </Button>
            ))}
          </XStack>
        </XStack>

        {/* Total items count - separate line */}
        <XStack justifyContent="center" alignItems="center">
          <View 
            backgroundColor="$green5" 
            paddingHorizontal="$4" 
            paddingVertical="$2" 
            borderRadius="$3"
            minWidth={120}
            alignItems="center"
          >
            <Text fontSize="$4" fontWeight="700" color="$green10">
              Total: {totalItems} items
            </Text>
          </View>
        </XStack>

        {/* Current page range */}
        <XStack justifyContent="center" alignItems="center">
          <Text fontSize="$4" fontWeight="600" color="$color">
            Showing {from}-{to} of {totalItems}
          </Text>
        </XStack>

        {/* Pagination controls */}
        <XStack justifyContent="center" alignItems="center" space="$3">
          <Button
            size="$3"
            backgroundColor={page === 0 ? "$gray5" : "$blue10"}
            color={page === 0 ? "$gray10" : "white"}
            onPress={() => handlePageChange(page - 1)}
            disabled={page === 0}
            borderRadius="$3"
            pressStyle={{ backgroundColor: page === 0 ? '$gray5' : '$blue11' }}
            icon={<Icon name="chevron-left" size={16} color={page === 0 ? "$gray10" : "white"} />}
            minWidth={90}
            height={40}
          >
            <Text 
              fontSize="$3" 
              fontWeight="600" 
              color={page === 0 ? "$gray10" : "white"}
            >
              Previous
            </Text>
          </Button>
          
          <View 
            backgroundColor="$blue5" 
            paddingHorizontal="$3" 
            paddingVertical="$2" 
            borderRadius="$3"
            minWidth={80}
            alignItems="center"
          >
            <Text fontSize="$4" fontWeight="700" color="$blue10">
              {page + 1} of {totalPages}
            </Text>
          </View>
          
          <Button
            size="$3"
            backgroundColor={page >= totalPages - 1 ? "$gray5" : "$blue10"}
            color={page >= totalPages - 1 ? "$gray10" : "white"}
            onPress={() => handlePageChange(page + 1)}
            disabled={page >= totalPages - 1}
            borderRadius="$3"
            pressStyle={{ backgroundColor: page >= totalPages - 1 ? '$gray5' : '$blue11' }}
            icon={<Icon name="chevron-right" size={16} color={page >= totalPages - 1 ? "$gray10" : "white"} />}
            iconPosition="right"
            minWidth={90}
            height={40}
          >
            <Text 
              fontSize="$3" 
              fontWeight="600" 
              color={page >= totalPages - 1 ? "$gray10" : "white"}
            >
              Next
            </Text>
          </Button>
        </XStack>
      </YStack>
    </Card>
  );
};

export default Pagination; 