import moment from "moment";

class UtilityService {
  // Date utilities
  static formatDate(timestamp, format = 'DD/MM/YYYY') {
    if (!timestamp) return '';
    return moment(timestamp).format(format);
  }

  static parseDate(dateString, format = 'DD/MM/YYYY') {
    if (!dateString) return null;
    return moment(dateString, format).valueOf();
  }

  static getCurrentTimestamp() {
    return moment().valueOf();
  }

  static isValidDate(timestamp) {
    return moment(timestamp).isValid();
  }

  // String utilities
  static capitalizeFirst(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  static truncateString(str, maxLength = 50) {
    if (!str) return '';
    if (str.length <= maxLength) return str;
    return str.substring(0, maxLength) + '...';
  }

  static sanitizeString(str) {
    if (!str) return '';
    return str.trim().replace(/[<>]/g, '');
  }

  // Number utilities
  static formatNumber(num, decimals = 2) {
    if (num === null || num === undefined) return '0';
    return Number(num).toFixed(decimals);
  }

  static isValidNumber(num) {
    return !isNaN(num) && isFinite(num);
  }

  static roundToDecimal(num, decimals = 2) {
    if (!this.isValidNumber(num)) return 0;
    return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
  }

  // Array utilities
  static chunkArray(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  static uniqueArray(array, key = null) {
    if (!key) {
      return [...new Set(array)];
    }
    const seen = new Set();
    return array.filter(item => {
      const value = item[key];
      if (seen.has(value)) {
        return false;
      }
      seen.add(value);
      return true;
    });
  }

  static sortArray(array, key, order = 'asc') {
    return [...array].sort((a, b) => {
      let aVal = a[key];
      let bVal = b[key];

      // Handle null/undefined values
      if (aVal === null || aVal === undefined) aVal = '';
      if (bVal === null || bVal === undefined) bVal = '';

      // Handle numbers
      if (this.isValidNumber(aVal) && this.isValidNumber(bVal)) {
        return order === 'asc' ? aVal - bVal : bVal - aVal;
      }

      // Handle strings
      aVal = aVal.toString().toLowerCase();
      bVal = bVal.toString().toLowerCase();
      
      if (order === 'asc') {
        return aVal.localeCompare(bVal);
      } else {
        return bVal.localeCompare(aVal);
      }
    });
  }

  // Object utilities
  static deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => this.deepClone(item));
    if (typeof obj === 'object') {
      const clonedObj = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          clonedObj[key] = this.deepClone(obj[key]);
        }
      }
      return clonedObj;
    }
  }

  static removeNullValues(obj) {
    const cleaned = {};
    for (const key in obj) {
      if (obj[key] !== null && obj[key] !== undefined) {
        cleaned[key] = obj[key];
      }
    }
    return cleaned;
  }

  // Validation utilities
  static isValidEmail(email) {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isValidPhone(phone) {
    if (!phone) return false;
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }

  static isValidPin(pin) {
    if (!pin) return false;
    return pin.length >= 4 && /^\d+$/.test(pin);
  }

  // File utilities
  static getFileExtension(filename) {
    if (!filename) return '';
    return filename.split('.').pop().toLowerCase();
  }

  static isValidFileType(filename, allowedTypes) {
    const extension = this.getFileExtension(filename);
    return allowedTypes.includes(extension);
  }

  static formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Search utilities
  static searchInArray(array, searchTerm, searchFields = []) {
    if (!searchTerm || !array || array.length === 0) return array;
    
    const term = searchTerm.toLowerCase().trim();
    
    return array.filter(item => {
      if (searchFields.length === 0) {
        // Search in all string fields
        return Object.values(item).some(value => 
          value && value.toString().toLowerCase().includes(term)
        );
      } else {
        // Search in specific fields
        return searchFields.some(field => {
          const value = item[field];
          return value && value.toString().toLowerCase().includes(term);
        });
      }
    });
  }

  // Pagination utilities
  static paginateArray(array, page = 1, pageSize = 10) {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = array.slice(startIndex, endIndex);
    
    return {
      data: paginatedData,
      pagination: {
        currentPage: page,
        pageSize: pageSize,
        totalItems: array.length,
        totalPages: Math.ceil(array.length / pageSize),
        hasNextPage: endIndex < array.length,
        hasPrevPage: page > 1
      }
    };
  }

  // Error handling utilities
  static formatErrorMessage(error) {
    if (typeof error === 'string') return error;
    if (error.message) return error.message;
    if (error.error) return error.error;
    return 'An unknown error occurred';
  }

  static isNetworkError(error) {
    return error.message && (
      error.message.includes('Network') ||
      error.message.includes('fetch') ||
      error.message.includes('timeout')
    );
  }

  // Data transformation utilities
  static transformInwardData(data) {
    return data.map(item => ({
      ...item,
      receivedDate: this.formatDate(item.receivedDate),
      paymentDate: this.formatDate(item.paymentDate),
      quantity: this.formatNumber(item.quantity, 0),
      balance: this.formatNumber(item.balance, 0),
    }));
  }

  static transformOutwardData(data) {
    return data.map(item => ({
      ...item,
      receivedDate: this.formatDate(item.receivedDate),
      gatePassDate: this.formatDate(item.gatePassDate),
      quantity: this.formatNumber(item.quantity, 0),
      issued: this.formatNumber(item.issued, 0),
      balance: this.formatNumber(item.balance, 0),
    }));
  }

  static transformStockData(data) {
    return data.map(item => ({
      ...item,
      receivedDate: this.formatDate(item.receivedDate),
      paymentDate: this.formatDate(item.paymentDate),
      gatePassDate: this.formatDate(item.gatePassDate),
      quantity: this.formatNumber(item.quantity, 0),
      issued: this.formatNumber(item.issued, 0),
      balance: this.formatNumber(item.balance, 0),
    }));
  }

  // Export utilities
  static generateCSVData(data, headers) {
    if (!data || data.length === 0) return '';
    
    const csvHeaders = headers.map(h => h.label).join(',');
    const csvRows = data.map(row => 
      headers.map(h => {
        const value = row[h.key];
        // Escape commas and quotes in CSV
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value || '';
      }).join(',')
    );
    
    return [csvHeaders, ...csvRows].join('\n');
  }

  static downloadCSV(csvData, filename) {
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}

export default UtilityService; 