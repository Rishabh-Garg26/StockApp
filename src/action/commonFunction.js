import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import Papa from "papaparse";
import moment from "moment";
import { Alert } from "react-native";
import TransactionService from "../services/transaction";

export const pickDocument = async (setIsLoading) => {
  try {
    // Pick a CSV file
    setIsLoading(true); // Start loading
    let result = await DocumentPicker.getDocumentAsync({
      type: "text/csv", // Limit file type to CSV
      copyToCacheDirectory: true,
    });
    if (result.assets) {
      // Read the file content
      const fileUri = result.assets[0].uri;
      const fileContent = await FileSystem.readAsStringAsync(fileUri);

      // Parse the CSV content
      Papa.parse(fileContent, {
        header: true, // Adjust according to whether you have headers
        complete: async (results) => {
          try {
            // Process the data to convert dates
            const processedData = results.data.map((element) => ({
              ...element,
              receivedDate: element.receivedDate
                ? moment.utc(element.receivedDate, "DD/MM/YYYY").valueOf()
                : null,
              paymentDate: element.paymentDate
                ? moment.utc(element.paymentDate, "DD/MM/YYYY").valueOf()
                : null,
              lotnumber: element.lotnumber?.toString(),
              quantity: element.quantity,
              balance: element.quantity,
            }));

            // Use the transaction service
            await TransactionService.importCSVData(processedData);

            Alert.alert("Success", "Data has been uploaded successfully", [
              {
                text: "Okay",
                style: "cancel",
              },
            ]);
          } catch (error) {
            console.error("Error importing CSV data:", error);
            Alert.alert("Error", error.message || "Failed to import data. Please check the file format.", [
              {
                text: "Okay",
                style: "cancel",
              },
            ]);
          }
        },
        error: (error) => {
          Alert.alert("OOPs!! Something went wrong", error, [
            {
              text: "Okay",
              style: "cancel",
            },
          ]);
        },
      });
    }
  } catch (error) {
    console.error("Error picking document:", error);
    Alert.alert("Error", "Failed to pick document. Please try again.", [
      {
        text: "Okay",
        style: "cancel",
      },
    ]);
  } finally {
    setIsLoading(false); // Stop loading
  }
};

// Inward operations
export const insertInward = async (data) => {
  return await TransactionService.insertInward(data);
};

export const updateInward = async (data) => {
  return await TransactionService.updateInward(data);
};

export const deleteInward = async (id) => {
  return await TransactionService.deleteInward(id);
};

export const getAllInward = async (limit = 20, offset = 0, sortColumn = 'id', sortOrder = 'asc', searchQuery = '') => {
  return await TransactionService.getAllInward(limit, offset, sortColumn, sortOrder, searchQuery);
};

export const getInwardById = async (id) => {
  return await TransactionService.getInwardById(id);
};

export const getInwardCount = async (searchQuery = '') => {
  return await TransactionService.getInwardCount(searchQuery);
};

export const getAllInwardsWithCount = async (limit = 20, offset = 0, sortColumn = 'id', sortOrder = 'asc', searchQuery = '') => {
  return await TransactionService.getAllInwardsWithCount(limit, offset, sortColumn, sortOrder, searchQuery);
};

// Outward operations
export const insertOutward = async (data) => {
  return await TransactionService.insertOutward(data);
};

export const updateOutward = async (data) => {
  return await TransactionService.updateOutward(data);
};

export const deleteOutward = async (id, issued, receivedId) => {
  return await TransactionService.deleteOutward(id, issued, receivedId);
};

export const getAllOutward = async (limit = 20, offset = 0, sortColumn = 'id', sortOrder = 'asc', searchQuery = '') => {
  return await TransactionService.getAllOutward(limit, offset, sortColumn, sortOrder, searchQuery);
};

export const getOutwardById = async (id) => {
  return await TransactionService.getOutwardById(id);
};

export const getOutwardCount = async (searchQuery = '') => {
  return await TransactionService.getOutwardCount(searchQuery);
};

export const getAllOutwardsWithCount = async (limit = 20, offset = 0, sortColumn = 'id', sortOrder = 'asc', searchQuery = '') => {
  return await TransactionService.getAllOutwardsWithCount(limit, offset, sortColumn, sortOrder, searchQuery);
};

// Dropdown and search operations
export const getAllInwardsForOutwards = async (limit = 20, offset = 0, sortColumn = 'id', sortOrder = 'asc', searchQuery = '') => {
  return await TransactionService.getAllInwardsForOutwards(limit, offset, sortColumn, sortOrder, searchQuery);
};

export const searchInwardsForDropdown = async (searchQuery = '', limit = 20) => {
  return await TransactionService.searchInwardsForDropdown(searchQuery, limit);
};

export const getAvailableItems = async (searchQuery = '', limit = 100) => {
  return await TransactionService.getAvailableItems(searchQuery, limit);
};

// Report operations
export const getInwardReport = async (fromDate, toDate, groupBy = false, orderBy = 'receivedDate') => {
  return await TransactionService.getInwardReport(fromDate, toDate, groupBy, orderBy);
};

export const getOutwardReport = async (fromDate, toDate, groupBy = false, orderBy = 'gatePassDate') => {
  return await TransactionService.getOutwardReport(fromDate, toDate, groupBy, orderBy);
};

export const getStockPosition = async (reportType, findLotNumber, order, toDate, item, selectedItems) => {
  return await TransactionService.getStockPosition(reportType, findLotNumber, order, toDate, item, selectedItems);
};

// User operations
export const createDatabase = async (pin, email) => {
  return await TransactionService.createDatabase(pin, email);
};

export const updateUserPin = async (newPin) => {
  return await TransactionService.updateUserPin(newPin);
};

export const checkPassword = async (pin) => {
  return await TransactionService.checkPassword(pin);
};

// Data import/export operations
export const importCSVData = async (csvData) => {
  return await TransactionService.importCSVData(csvData);
};

export const exportData = async (tableName) => {
  return await TransactionService.exportData(tableName);
};

export const backupDatabase = async () => {
  return await TransactionService.backupDatabase();
};

export const restoreDatabase = async (backupData) => {
  return await TransactionService.restoreDatabase(backupData);
};

// Validation methods
export const validateInwardData = (data) => {
  return TransactionService.validateInwardData(data);
};

export const validateOutwardData = (data) => {
  return TransactionService.validateOutwardData(data);
};

export const validateUserData = (data) => {
  return TransactionService.validateUserData(data);
};
