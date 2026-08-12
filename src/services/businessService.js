import DatabaseService from "./database";
import ValidationService from "./validationService";
import moment from "moment";

class BusinessService {
  // Business logic methods
  static async createInwardRecord(data) {
    // Validate data using ValidationService
    const validation = ValidationService.validateAndSanitizeForm(data, 'inward');
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.allErrors.join(', ')}`);
    }

    // Set default values
    const inwardData = {
      ...validation.sanitizedData,
      balance: validation.sanitizedData.quantity, // Initial balance equals quantity
      imageExist: data.imageExist || 0,
      imageName: data.imageName || '',
      receivedDate: validation.sanitizedData.receivedDate || moment().valueOf(),
      paymentDate: validation.sanitizedData.paymentDate || null,
    };

    // Insert into database
    await DatabaseService.insertInward(inwardData);
    
    return inwardData;
  }

  static async createOutwardRecord(data) {
    // Validate data using ValidationService
    const validation = ValidationService.validateAndSanitizeForm(data, 'outward');
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.allErrors.join(', ')}`);
    }

    // Check if source inward exists and has sufficient balance
    const sourceInward = await DatabaseService.getInwardById(validation.sanitizedData.receivedId);
    if (!sourceInward || sourceInward.length === 0) {
      throw new Error('Source inward record not found');
    }

    const currentBalance = sourceInward[0].balance;
    if (validation.sanitizedData.issued > currentBalance) {
      throw new Error(`Insufficient balance. Available: ${currentBalance}, Requested: ${validation.sanitizedData.issued}`);
    }

    // Calculate new balance
    const newBalance = currentBalance - validation.sanitizedData.issued;

    // Prepare outward data
    const outwardData = {
      ...validation.sanitizedData,
      balance: newBalance,
      receivedDate: validation.sanitizedData.receivedDate || moment().valueOf(),
      gatePassDate: validation.sanitizedData.gatePassDate || moment().valueOf(),
    };

    // Insert outward record and update inward balance
    await DatabaseService.insertOutward(outwardData);
    
    return outwardData;
  }

  static async updateInwardRecord(id, data) {
    // Validate data using ValidationService
    const validation = ValidationService.validateAndSanitizeForm(data, 'inward');
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.allErrors.join(', ')}`);
    }

    // Check if record exists
    const existingRecord = await DatabaseService.getInwardById(id);
    if (!existingRecord || existingRecord.length === 0) {
      throw new Error('Inward record not found');
    }

    // Check if quantity can be reduced (considering outwards)
    const currentRecord = existingRecord[0];
    const totalIssued = currentRecord.quantity - currentRecord.balance;
    
    if (validation.sanitizedData.quantity < totalIssued) {
      throw new Error(`Cannot reduce quantity below total issued (${totalIssued})`);
    }

    // Calculate new balance
    const newBalance = validation.sanitizedData.quantity - totalIssued;

    // Update data
    const updateData = {
      ...validation.sanitizedData,
      id,
      balance: newBalance,
    };

    await DatabaseService.updateInward(updateData);
    
    return updateData;
  }

  static async updateOutwardRecord(id, data) {
    // Validate data using ValidationService
    const validation = ValidationService.validateAndSanitizeForm(data, 'outward');
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.allErrors.join(', ')}`);
    }

    // Check if record exists
    const existingRecord = await DatabaseService.getOutwardById(id);
    if (!existingRecord || existingRecord.length === 0) {
      throw new Error('Outward record not found');
    }

    const currentRecord = existingRecord[0];
    
    // Check if issued quantity can be increased
    const sourceInward = await DatabaseService.getInwardById(validation.sanitizedData.receivedId);
    if (!sourceInward || sourceInward.length === 0) {
      throw new Error('Source inward record not found');
    }

    const availableBalance = sourceInward[0].balance + currentRecord.issued;
    if (validation.sanitizedData.issued > availableBalance) {
      throw new Error(`Insufficient balance. Available: ${availableBalance}, Requested: ${validation.sanitizedData.issued}`);
    }

    // Calculate new balance for source inward
    const newBalance = availableBalance - validation.sanitizedData.issued;

    // Update outward record
    const updateData = {
      ...validation.sanitizedData,
      id,
      balance: newBalance,
    };

    await DatabaseService.updateOutward(updateData);
    
    // Update source inward balance
    await DatabaseService.updateInward({
      ...sourceInward[0],
      balance: newBalance,
    });
    
    return updateData;
  }

  static async deleteInwardRecord(id) {
    // Check if record exists
    const existingRecord = await DatabaseService.getInwardById(id);
    if (!existingRecord || existingRecord.length === 0) {
      throw new Error('Inward record not found');
    }

    // Check if there are any outwards linked to this inward
    const outwards = await DatabaseService.getAllOutward(1000, 0, 'id', 'asc', '');
    const linkedOutwards = outwards.filter(outward => outward.receivedId === id);
    
    if (linkedOutwards.length > 0) {
      throw new Error('Cannot delete inward record with linked outward records');
    }

    await DatabaseService.deleteInward(id);
  }

  static async deleteOutwardRecord(id) {
    // Check if record exists
    const existingRecord = await DatabaseService.getOutwardById(id);
    if (!existingRecord || existingRecord.length === 0) {
      throw new Error('Outward record not found');
    }

    const currentRecord = existingRecord[0];
    
    // Restore balance to source inward
    const sourceInward = await DatabaseService.getInwardById(currentRecord.receivedId);
    if (sourceInward && sourceInward.length > 0) {
      const newBalance = sourceInward[0].balance + currentRecord.issued;
      await DatabaseService.updateInward({
        ...sourceInward[0],
        balance: newBalance,
      });
    }

    await DatabaseService.deleteOutward(id, currentRecord.issued, currentRecord.receivedId);
  }

  // Report generation methods
  static async generateInwardReport(fromDate, toDate, groupBy = false, orderBy = 'receivedDate') {
    // Validate date range
    const dateValidation = ValidationService.validateSearchForm({ fromDate, toDate });
    if (!dateValidation.isValid) {
      throw new Error(`Date validation failed: ${dateValidation.allErrors.join(', ')}`);
    }

    const data = await DatabaseService.getInwardReport(fromDate, toDate, groupBy, orderBy);
    
    // Process data for reporting
    const processedData = data.map(item => ({
      ...item,
      receivedDate: item.receivedDate ? moment(item.receivedDate).format('DD/MM/YYYY') : '',
      paymentDate: item.paymentDate ? moment(item.paymentDate).format('DD/MM/YYYY') : '',
    }));

    return processedData;
  }

  static async generateOutwardReport(fromDate, toDate, groupBy = false, orderBy = 'gatePassDate') {
    // Validate date range
    const dateValidation = ValidationService.validateSearchForm({ fromDate, toDate });
    if (!dateValidation.isValid) {
      throw new Error(`Date validation failed: ${dateValidation.allErrors.join(', ')}`);
    }

    const data = await DatabaseService.getOutwardReport(fromDate, toDate, groupBy, orderBy);
    
    // Process data for reporting
    const processedData = data.map(item => ({
      ...item,
      receivedDate: item.receivedDate ? moment(item.receivedDate).format('DD/MM/YYYY') : '',
      gatePassDate: item.gatePassDate ? moment(item.gatePassDate).format('DD/MM/YYYY') : '',
    }));

    return processedData;
  }

  static async generateStockPositionReport(reportType, findLotNumber, order, toDate, item, selectedItems) {
    // Validate date
    if (toDate) {
      const dateValidation = ValidationService.validateField(toDate, [
        ValidationService.RULES.VALID_DATE
      ]);
      if (!dateValidation.isValid) {
        throw new Error(`Invalid date: ${dateValidation.errors[0]}`);
      }
    }

    const data = await DatabaseService.getStockPosition(reportType, findLotNumber, order, toDate, item, selectedItems);
    
    // Process data for reporting
    const processedData = data.map(item => ({
      ...item,
      receivedDate: item.receivedDate ? moment(item.receivedDate).format('DD/MM/YYYY') : '',
      paymentDate: item.paymentDate ? moment(item.paymentDate).format('DD/MM/YYYY') : '',
      gatePassDate: item.gatePassDate ? moment(item.gatePassDate).format('DD/MM/YYYY') : '',
    }));

    return processedData;
  }

  // Search and filter methods
  static async searchInwards(searchQuery, limit = 20) {
    // Validate search query
    const searchValidation = ValidationService.validateSearchForm({ searchQuery });
    if (!searchValidation.isValid) {
      throw new Error(`Search validation failed: ${searchValidation.allErrors.join(', ')}`);
    }

    return await DatabaseService.searchInwardsForDropdown(searchValidation.sanitizedData.searchQuery, limit);
  }

  static async getItemsList(searchQuery, limit = 100) {
    // Validate search query
    const searchValidation = ValidationService.validateSearchForm({ searchQuery });
    if (!searchValidation.isValid) {
      throw new Error(`Search validation failed: ${searchValidation.allErrors.join(', ')}`);
    }

    return await DatabaseService.getAvailableItems(searchValidation.sanitizedData.searchQuery, limit);
  }

  // User management methods
  static async createUser(pin, email) {
    const validation = ValidationService.validateAndSanitizeForm({ pin, email }, 'user');
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.allErrors.join(', ')}`);
    }

    await DatabaseService.createDatabase(validation.sanitizedData.pin, validation.sanitizedData.email);
  }

  static async updateUserPin(newPin) {
    const validation = ValidationService.validateAndSanitizeForm({ pin: newPin }, 'user');
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.allErrors.join(', ')}`);
    }

    await DatabaseService.updateUserPin(validation.sanitizedData.pin);
  }

  static async authenticateUser(pin) {
    const users = await DatabaseService.checkPassword(pin);
    return users && users.length > 0;
  }

  // Data import/export methods
  static async importCSVData(csvData) {
    // Validate CSV data structure
    const requiredFields = ['item', 'quantity', 'unit', 'location'];
    const errors = [];

    csvData.forEach((row, index) => {
      requiredFields.forEach(field => {
        if (!row[field] || row[field].toString().trim() === '') {
          errors.push(`Row ${index + 1}: Missing required field '${field}'`);
        }
      });

      // Validate quantity
      if (row.quantity) {
        const quantityValidation = ValidationService.validateField(row.quantity, [
          ValidationService.RULES.POSITIVE_NUMBER
        ]);
        if (!quantityValidation.isValid) {
          errors.push(`Row ${index + 1}: ${quantityValidation.errors[0]}`);
        }
      }

      // Validate item name
      if (row.item) {
        const itemValidation = ValidationService.validateField(row.item, [
          ValidationService.RULES.MIN_LENGTH(1),
          ValidationService.RULES.MAX_LENGTH(100),
          ValidationService.RULES.NO_HTML_TAGS
        ]);
        if (!itemValidation.isValid) {
          errors.push(`Row ${index + 1}: ${itemValidation.errors[0]}`);
        }
      }
    });

    if (errors.length > 0) {
      throw new Error(`CSV validation failed: ${errors.join(', ')}`);
    }

    await DatabaseService.importCSVData(csvData);
  }

  static async exportData(tableName) {
    return await DatabaseService.getAllData(tableName);
  }

  static async backupDatabase() {
    const tables = ['Inward', 'Outward'];
    const backup = {};

    for (const table of tables) {
      backup[table] = await DatabaseService.getAllData(table);
    }

    return backup;
  }

  static async restoreDatabase(backupData) {
    await DatabaseService.restoreDatabase(backupData);
  }

  // Validation methods (now using ValidationService)
  static validateInwardData(data) {
    return ValidationService.validateInwardForm(data);
  }

  static validateOutwardData(data) {
    return ValidationService.validateOutwardForm(data);
  }

  static validateUserData(data) {
    return ValidationService.validateUserForm(data);
  }

  static isValidEmail(email) {
    return ValidationService.RULES.EMAIL(email);
  }
}

export default BusinessService; 