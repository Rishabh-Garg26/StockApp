import DatabaseService from "./database";
import BusinessService from "./businessService";

// Validation constants for SQL injection prevention
const VALID_SORT_COLUMNS = ['id', 'receivedDate', 'paymentDate', 'location', 'lotnumber', 'item', 'quantity', 'unit', 'marka', 'balance'];
const VALID_SORT_ORDERS = ['asc', 'desc'];

// Validation functions
const validateSortColumn = (column) => {
  return VALID_SORT_COLUMNS.includes(column) ? column : 'id';
};

const validateSortOrder = (order) => {
  return VALID_SORT_ORDERS.includes(order.toLowerCase()) ? order.toLowerCase() : 'asc';
};

class TransactionService {
  // Inward operations
  static async insertInward(data) {
    try {
      return await BusinessService.createInwardRecord(data);
    } catch (error) {
      console.error('Error inserting inward record:', error);
      throw error;
    }
  }

  static async updateInward(data) {
    try {
      return await BusinessService.updateInwardRecord(data.id, data);
    } catch (error) {
      console.error('Error updating inward record:', error);
      throw error;
    }
  }

  static async deleteInward(id) {
    try {
      await BusinessService.deleteInwardRecord(id);
    } catch (error) {
      console.error('Error deleting inward record:', error);
      throw error;
    }
  }

  static async getAllInward(limit = 20, offset = 0, sortColumn = 'id', sortOrder = 'asc', searchQuery = '') {
    try {
      const validatedSortColumn = validateSortColumn(sortColumn);
      const validatedSortOrder = validateSortOrder(sortOrder);
      
      return await DatabaseService.getAllInward(limit, offset, validatedSortColumn, validatedSortOrder, searchQuery);
    } catch (error) {
      console.error('Error getting all inward records:', error);
      throw error;
    }
  }

  static async getInwardById(id) {
    try {
      return await DatabaseService.getInwardById(id);
    } catch (error) {
      console.error('Error getting inward by ID:', error);
      throw error;
    }
  }

  static async getInwardCount(searchQuery = '') {
    try {
      return await DatabaseService.getInwardCount(searchQuery);
    } catch (error) {
      console.error('Error getting inward count:', error);
      throw error;
    }
  }

  static async getAllInwardsWithCount(limit = 20, offset = 0, sortColumn = 'id', sortOrder = 'asc', searchQuery = '') {
    try {
      const validatedSortColumn = validateSortColumn(sortColumn);
      const validatedSortOrder = validateSortOrder(sortOrder);
      
      return await DatabaseService.getAllInwardsWithCount(limit, offset, validatedSortColumn, validatedSortOrder, searchQuery);
    } catch (error) {
      console.error('Error getting inward records with count:', error);
      throw error;
    }
  }

  // Outward operations
  static async insertOutward(data) {
    try {
      return await BusinessService.createOutwardRecord(data);
    } catch (error) {
      console.error('Error inserting outward record:', error);
      throw error;
    }
  }

  static async updateOutward(data) {
    try {
      return await BusinessService.updateOutwardRecord(data.id, data);
    } catch (error) {
      console.error('Error updating outward record:', error);
      throw error;
    }
  }

  static async deleteOutward(id, issued, receivedId) {
    try {
      await BusinessService.deleteOutwardRecord(id);
    } catch (error) {
      console.error('Error deleting outward record:', error);
      throw error;
    }
  }

  static async getAllOutward(limit = 20, offset = 0, sortColumn = 'id', sortOrder = 'asc', searchQuery = '') {
    try {
      const validatedSortColumn = validateSortColumn(sortColumn);
      const validatedSortOrder = validateSortOrder(sortOrder);
      
      return await DatabaseService.getAllOutward(limit, offset, validatedSortColumn, validatedSortOrder, searchQuery);
    } catch (error) {
      console.error('Error getting all outward records:', error);
      throw error;
    }
  }

  static async getOutwardById(id) {
    try {
      return await DatabaseService.getOutwardById(id);
    } catch (error) {
      console.error('Error getting outward by ID:', error);
      throw error;
    }
  }

  static async getOutwardCount(searchQuery = '') {
    try {
      return await DatabaseService.getOutwardCount(searchQuery);
    } catch (error) {
      console.error('Error getting outward count:', error);
      throw error;
    }
  }

  static async getAllOutwardsWithCount(limit = 20, offset = 0, sortColumn = 'id', sortOrder = 'asc', searchQuery = '') {
    try {
      const validatedSortColumn = validateSortColumn(sortColumn);
      const validatedSortOrder = validateSortOrder(sortOrder);
      
      return await DatabaseService.getAllOutwardsWithCount(limit, offset, validatedSortColumn, validatedSortOrder, searchQuery);
    } catch (error) {
      console.error('Error getting outward records with count:', error);
      throw error;
    }
  }

  // Dropdown and search operations
  static async getAllInwardsForOutwards(limit = 20, offset = 0, sortColumn = 'id', sortOrder = 'asc', searchQuery = '') {
    try {
      const validatedSortColumn = validateSortColumn(sortColumn);
      const validatedSortOrder = validateSortOrder(sortOrder);
      
      return await DatabaseService.getAllInwardsForOutwards(limit, offset, validatedSortColumn, validatedSortOrder, searchQuery);
    } catch (error) {
      console.error('Error getting inwards for outwards:', error);
      throw error;
    }
  }

  static async searchInwardsForDropdown(searchQuery, limit = 20) {
    try {
      return await BusinessService.searchInwards(searchQuery, limit);
    } catch (error) {
      console.error('Error searching inwards for dropdown:', error);
      throw error;
    }
  }

  static async getAvailableItems(searchQuery = '', limit = 100) {
    try {
      return await BusinessService.getItemsList(searchQuery, limit);
    } catch (error) {
      console.error('Error getting available items:', error);
      throw error;
    }
  }

  // Report operations
  static async getInwardReport(fromDate, toDate, groupBy = false, orderBy = 'receivedDate') {
    try {
      return await BusinessService.generateInwardReport(fromDate, toDate, groupBy, orderBy);
    } catch (error) {
      console.error('Error generating inward report:', error);
      throw error;
    }
  }

  static async getOutwardReport(fromDate, toDate, groupBy = false, orderBy = 'gatePassDate') {
    try {
      return await BusinessService.generateOutwardReport(fromDate, toDate, groupBy, orderBy);
    } catch (error) {
      console.error('Error generating outward report:', error);
      throw error;
    }
  }

  static async getStockPosition(reportType, findLotNumber, order, toDate, item, selectedItems) {
    try {
      return await BusinessService.generateStockPositionReport(reportType, findLotNumber, order, toDate, item, selectedItems);
    } catch (error) {
      console.error('Error generating stock position report:', error);
      throw error;
    }
  }

  // User operations
  static async createDatabase(pin, email) {
    try {
      await BusinessService.createUser(pin, email);
    } catch (error) {
      console.error('Error creating database:', error);
      throw error;
    }
  }

  static async updateUserPin(newPin) {
    try {
      await BusinessService.updateUserPin(newPin);
    } catch (error) {
      console.error('Error updating user PIN:', error);
      throw error;
    }
  }

  static async checkPassword(pin) {
    try {
      return await DatabaseService.checkPassword(pin);
    } catch (error) {
      console.error('Error checking password:', error);
      throw error;
    }
  }

  static async updateBiometric(biometric) {
    try {
      return await DatabaseService.updateBiometric(biometric);
    } catch (error) {
      console.error('Error updating biometric setting:', error);
      throw error;
    }
  }

  static async checkUser() {
    try {
      return await DatabaseService.checkUser();
    } catch (error) {
      console.error('Error checking user:', error);
      throw error;
    }
  }

  // Data import/export operations
  static async importCSVData(csvData) {
    try {
      await BusinessService.importCSVData(csvData);
    } catch (error) {
      console.error('Error importing CSV data:', error);
      throw error;
    }
  }

  static async exportData(tableName) {
    try {
      return await BusinessService.exportData(tableName);
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  }

  static async backupDatabase() {
    try {
      return await BusinessService.backupDatabase();
    } catch (error) {
      console.error('Error backing up database:', error);
      throw error;
    }
  }

  static async restoreDatabase(backupData) {
    try {
      await BusinessService.restoreDatabase(backupData);
    } catch (error) {
      console.error('Error restoring database:', error);
      throw error;
    }
  }

  // Validation methods (delegated to BusinessService)
  static validateInwardData(data) {
    return BusinessService.validateInwardData(data);
  }

  static validateOutwardData(data) {
    return BusinessService.validateOutwardData(data);
  }

  static validateUserData(data) {
    return BusinessService.validateUserData(data);
  }
}

export default TransactionService;