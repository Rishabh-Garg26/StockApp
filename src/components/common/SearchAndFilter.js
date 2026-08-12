import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Searchbar, Text } from 'react-native-paper';
import { Dropdown } from "react-native-element-dropdown";

const SearchAndFilter = ({
  searchQuery,
  onSearchChange,
  sortOptions = [],
  sortBy,
  sortOrder,
  onSortChange,
  placeholder = "Search...",
  showSort = true
}) => {
  const [isFocusSort, setIsFocusSort] = useState(false);

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

  const handleSortChange = (value) => {
    if (onSortChange) {
      const [newSortBy, newSortOrder] = value.split('-');
      onSortChange(newSortBy, newSortOrder);
    }
  };

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder={placeholder}
        onChangeText={onSearchChange}
        value={searchQuery}
        style={styles.searchBar}
      />
      
      {showSort && sortOptions.length > 0 && (
        <View style={styles.sortContainer}>
          {renderLabelSort()}
          <Dropdown
            style={[styles.dropdown, isFocusSort && { borderColor: 'blue' }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            data={sortOptions}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!isFocusSort ? 'Select Sort' : '...'}
            value={`${sortBy}-${sortOrder}`}
            onFocus={() => setIsFocusSort(true)}
            onBlur={() => setIsFocusSort(false)}
            onChange={item => {
              handleSortChange(item.value);
              setIsFocusSort(false);
            }}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 10,
  },
  searchBar: {
    marginBottom: 10,
    backgroundColor: 'white',
  },
  sortContainer: {
    marginTop: 5,
  },
  label: {
    marginLeft: 5,
    fontWeight: "900",
    marginBottom: 5,
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: 'white',
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});

export default SearchAndFilter; 