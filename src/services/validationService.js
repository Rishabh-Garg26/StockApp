import moment from "moment";
import UtilityService from "./utilityService";

class ValidationService {
  // Field validation rules
  static RULES = {
    // Required fields
    REQUIRED: (value) => value !== null && value !== undefined && value.toString().trim() !== '',
    
    // String validations
    MIN_LENGTH: (min) => (value) => value && value.toString().length >= min,
    MAX_LENGTH: (max) => (value) => value && value.toString().length <= max,
    ALPHA_NUMERIC: (value) => /^[a-zA-Z0-9\s]+$/.test(value),
    ALPHA_ONLY: (value) => /^[a-zA-Z\s]+$/.test(value),
    NUMERIC_ONLY: (value) => /^\d+$/.test(value),
    
    // Number validations
    POSITIVE_NUMBER: (value) => !isNaN(value) && Number(value) > 0,
    NON_NEGATIVE_NUMBER: (value) => !isNaN(value) && Number(value) >= 0,
    MAX_NUMBER: (max) => (value) => !isNaN(value) && Number(value) <= max,
    MIN_NUMBER: (min) => (value) => !isNaN(value) && Number(value) >= min,
    
    // Date validations
    VALID_DATE: (value) => moment(value).isValid(),
    FUTURE_DATE: (value) => moment(value).isAfter(moment()),
    PAST_DATE: (value) => moment(value).isBefore(moment()),
    DATE_RANGE: (startDate, endDate) => (value) => {
      const date = moment(value);
      return date.isBetween(moment(startDate), moment(endDate), 'day', '[]');
    },
    
    // Email validation
    EMAIL: (value) => UtilityService.isValidEmail(value),
    
    // PIN validation
    PIN: (value) => UtilityService.isValidPin(value),
    
    // Phone validation
    PHONE: (value) => UtilityService.isValidPhone(value),
    
    // File validation
    FILE_SIZE: (maxSizeMB) => (file) => {
      if (!file || !file.size) return true;
      return file.size <= maxSizeMB * 1024 * 1024;
    },
    FILE_TYPE: (allowedTypes) => (file) => {
      if (!file || !file.type) return true;
      return allowedTypes.includes(file.type);
    },
    
    // Custom validations
    NOT_EMPTY_STRING: (value) => value && value.toString().trim().length > 0,
    NO_SPECIAL_CHARS: (value) => /^[a-zA-Z0-9\s\-_]+$/.test(value),
    NO_HTML_TAGS: (value) => !/<[^>]*>/.test(value),
  };

  // Validation error messages
  static MESSAGES = {
    REQUIRED: 'This field is required',
    MIN_LENGTH: (min) => `Must be at least ${min} characters`,
    MAX_LENGTH: (max) => `Must be no more than ${max} characters`,
    ALPHA_NUMERIC: 'Only letters, numbers, and spaces are allowed',
    ALPHA_ONLY: 'Only letters and spaces are allowed',
    NUMERIC_ONLY: 'Only numbers are allowed',
    POSITIVE_NUMBER: 'Must be a positive number',
    NON_NEGATIVE_NUMBER: 'Must be zero or a positive number',
    MAX_NUMBER: (max) => `Must be ${max} or less`,
    MIN_NUMBER: (min) => `Must be ${min} or more`,
    VALID_DATE: 'Please enter a valid date',
    FUTURE_DATE: 'Date must be in the future',
    PAST_DATE: 'Date must be in the past',
    EMAIL: 'Please enter a valid email address',
    PIN: 'PIN must be at least 4 digits',
    PHONE: 'Please enter a valid phone number',
    FILE_SIZE: (maxSizeMB) => `File size must be ${maxSizeMB}MB or less`,
    FILE_TYPE: (types) => `File type must be one of: ${types.join(', ')}`,
    NOT_EMPTY_STRING: 'This field cannot be empty',
    NO_SPECIAL_CHARS: 'Special characters are not allowed',
    NO_HTML_TAGS: 'HTML tags are not allowed',
  };

  // Validate a single field
  static validateField(value, rules, fieldName = '') {
    const errors = [];
    
    for (const rule of rules) {
      if (typeof rule === 'function') {
        if (!rule(value)) {
          errors.push(this.MESSAGES.REQUIRED);
        }
      } else if (typeof rule === 'object') {
        const { validator, message } = rule;
        if (!validator(value)) {
          errors.push(message);
        }
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      fieldName
    };
  }

  // Validate multiple fields
  static validateFields(fields) {
    const results = {};
    let isValid = true;
    
    for (const [fieldName, { value, rules }] of Object.entries(fields)) {
      const result = this.validateField(value, rules, fieldName);
      results[fieldName] = result;
      if (!result.isValid) {
        isValid = false;
      }
    }
    
    return {
      isValid,
      results,
      allErrors: Object.values(results).flatMap(result => result.errors)
    };
  }

  // Specific validation functions for different form types

  // Inward form validation
  static validateInwardForm(data) {
    const fields = {
      item: {
        value: data.item,
        rules: [
          this.RULES.REQUIRED,
          this.RULES.MIN_LENGTH(1),
          this.RULES.MAX_LENGTH(100),
          this.RULES.NO_HTML_TAGS
        ]
      },
      quantity: {
        value: data.quantity,
        rules: [
          this.RULES.REQUIRED,
          this.RULES.POSITIVE_NUMBER
        ]
      },
      unit: {
        value: data.unit,
        rules: [
          this.RULES.REQUIRED,
          this.RULES.MIN_LENGTH(1),
          this.RULES.MAX_LENGTH(20),
          this.RULES.NO_HTML_TAGS
        ]
      },
      location: {
        value: data.location,
        rules: [
          this.RULES.REQUIRED,
          this.RULES.MIN_LENGTH(1),
          this.RULES.MAX_LENGTH(100),
          this.RULES.NO_HTML_TAGS
        ]
      },
      lotnumber: {
        value: data.lotnumber,
        rules: [
          this.RULES.MIN_LENGTH(1),
          this.RULES.MAX_LENGTH(50),
          this.RULES.NO_HTML_TAGS
        ]
      },
      marka: {
        value: data.marka,
        rules: [
          this.RULES.MIN_LENGTH(1),
          this.RULES.MAX_LENGTH(50),
          this.RULES.NO_HTML_TAGS
        ]
      },
      receivedDate: {
        value: data.receivedDate,
        rules: [
          { validator: (value) => !value || this.RULES.VALID_DATE(value), message: this.MESSAGES.VALID_DATE }
        ]
      },
      paymentDate: {
        value: data.paymentDate,
        rules: [
          { validator: (value) => !value || this.RULES.VALID_DATE(value), message: this.MESSAGES.VALID_DATE }
        ]
      }
    };

    return this.validateFields(fields);
  }

  // Outward form validation
  static validateOutwardForm(data) {
    const fields = {
      receivedId: {
        value: data.receivedId,
        rules: [
          this.RULES.REQUIRED
        ]
      },
      issued: {
        value: data.issued,
        rules: [
          this.RULES.REQUIRED,
          this.RULES.POSITIVE_NUMBER,
          { 
            validator: (value) => !data.quantity || Number(value) <= Number(data.quantity), 
            message: 'Issued quantity cannot exceed available quantity' 
          }
        ]
      },
      gatepass: {
        value: data.gatepass,
        rules: [
          this.RULES.MIN_LENGTH(1),
          this.RULES.MAX_LENGTH(100),
          this.RULES.NO_HTML_TAGS
        ]
      },
      gatePassDate: {
        value: data.gatePassDate,
        rules: [
          { validator: (value) => !value || this.RULES.VALID_DATE(value), message: this.MESSAGES.VALID_DATE }
        ]
      }
    };

    return this.validateFields(fields);
  }

  // User form validation
  static validateUserForm(data) {
    const fields = {
      pin: {
        value: data.pin,
        rules: [
          this.RULES.REQUIRED,
          this.RULES.PIN
        ]
      },
      email: {
        value: data.email,
        rules: [
          { validator: (value) => !value || this.RULES.EMAIL(value), message: this.MESSAGES.EMAIL }
        ]
      }
    };

    return this.validateFields(fields);
  }

  // Search form validation
  static validateSearchForm(data) {
    const fields = {
      searchQuery: {
        value: data.searchQuery,
        rules: [
          this.RULES.MAX_LENGTH(100),
          this.RULES.NO_HTML_TAGS
        ]
      },
      fromDate: {
        value: data.fromDate,
        rules: [
          { validator: (value) => !value || this.RULES.VALID_DATE(value), message: this.MESSAGES.VALID_DATE }
        ]
      },
      toDate: {
        value: data.toDate,
        rules: [
          { validator: (value) => !value || this.RULES.VALID_DATE(value), message: this.MESSAGES.VALID_DATE },
          { 
            validator: (value) => !value || !data.fromDate || moment(value).isAfter(moment(data.fromDate)), 
            message: 'End date must be after start date' 
          }
        ]
      }
    };

    return this.validateFields(fields);
  }

  // File upload validation
  static validateFileUpload(file, options = {}) {
    const {
      maxSizeMB = 10,
      allowedTypes = ['image/jpeg', 'image/png', 'image/gif'],
      maxFiles = 5
    } = options;

    const fields = {
      file: {
        value: file,
        rules: [
          this.RULES.REQUIRED,
          this.RULES.FILE_SIZE(maxSizeMB),
          this.RULES.FILE_TYPE(allowedTypes)
        ]
      }
    };

    return this.validateFields(fields);
  }

  // Real-time validation for input fields
  static validateInput(value, fieldType, options = {}) {
    const validators = {
      text: [
        this.RULES.NO_HTML_TAGS,
        this.RULES.MAX_LENGTH(options.maxLength || 100)
      ],
      number: [
        this.RULES.NUMERIC_ONLY,
        { validator: (val) => !val || this.RULES.POSITIVE_NUMBER(val), message: this.MESSAGES.POSITIVE_NUMBER }
      ],
      email: [
        { validator: (val) => !val || this.RULES.EMAIL(val), message: this.MESSAGES.EMAIL }
      ],
      date: [
        { validator: (val) => !val || this.RULES.VALID_DATE(val), message: this.MESSAGES.VALID_DATE }
      ],
      pin: [
        this.RULES.PIN
      ]
    };

    const rules = validators[fieldType] || [];
    return this.validateField(value, rules);
  }

  // Sanitize input data
  static sanitizeInput(value, type = 'text') {
    if (!value) return value;

    const sanitizers = {
      text: (val) => val.toString().trim().replace(/[<>]/g, ''),
      number: (val) => val.toString().replace(/[^0-9.]/g, ''),
      email: (val) => val.toString().trim().toLowerCase(),
      date: (val) => moment(val).isValid() ? moment(val).format('YYYY-MM-DD') : val,
      pin: (val) => val.toString().replace(/[^0-9]/g, '')
    };

    return sanitizers[type] ? sanitizers[type](value) : value;
  }

  // Validate and sanitize form data
  static validateAndSanitizeForm(data, formType) {
    // First sanitize the data
    const sanitizedData = {};
    for (const [key, value] of Object.entries(data)) {
      sanitizedData[key] = this.sanitizeInput(value);
    }

    // Then validate the sanitized data
    let validationResult;
    switch (formType) {
      case 'inward':
        validationResult = this.validateInwardForm(sanitizedData);
        break;
      case 'outward':
        validationResult = this.validateOutwardForm(sanitizedData);
        break;
      case 'user':
        validationResult = this.validateUserForm(sanitizedData);
        break;
      case 'search':
        validationResult = this.validateSearchForm(sanitizedData);
        break;
      default:
        validationResult = { isValid: true, results: {}, allErrors: [] };
    }

    return {
      ...validationResult,
      sanitizedData
    };
  }

  // Get field-specific error message
  static getFieldError(fieldName, validationResults) {
    const fieldResult = validationResults[fieldName];
    return fieldResult && !fieldResult.isValid ? fieldResult.errors[0] : null;
  }

  // Check if form has any errors
  static hasErrors(validationResults) {
    return Object.values(validationResults).some(result => !result.isValid);
  }

  // Get all error messages
  static getAllErrors(validationResults) {
    return Object.values(validationResults)
      .filter(result => !result.isValid)
      .flatMap(result => result.errors);
  }
}

export default ValidationService; 