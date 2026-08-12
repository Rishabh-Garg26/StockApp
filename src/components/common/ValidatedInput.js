import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TextInput, HelperText } from 'react-native-paper';
import ValidationService from '../../services/validationService';

const ValidatedInput = ({
  label,
  value,
  onChangeText,
  onBlur,
  onFocus,
  error,
  helperText,
  validationRules = [],
  fieldType = 'text',
  validateOnChange = false,
  validateOnBlur = true,
  showError = true,
  style,
  inputStyle,
  errorStyle,
  helperStyle,
  ...props
}) => {
  const [localError, setLocalError] = useState(error);
  const [isFocused, setIsFocused] = useState(false);
  const [hasBeenTouched, setHasBeenTouched] = useState(false);

  // Update local error when prop error changes
  useEffect(() => {
    setLocalError(error);
  }, [error]);

  // Validate input value
  const validateValue = (inputValue) => {
    if (!validationRules || validationRules.length === 0) {
      return { isValid: true, errors: [] };
    }

    // Use ValidationService for validation
    const result = ValidationService.validateField(inputValue, validationRules);
    return result;
  };

  // Handle text change
  const handleChangeText = (text) => {
    // Sanitize input based on field type
    const sanitizedText = ValidationService.sanitizeInput(text, fieldType);
    
    // Update the value
    onChangeText(sanitizedText);

    // Validate on change if enabled
    if (validateOnChange && hasBeenTouched) {
      const validation = validateValue(sanitizedText);
      setLocalError(validation.isValid ? null : validation.errors[0]);
    }
  };

  // Handle focus
  const handleFocus = (e) => {
    setIsFocused(true);
    setHasBeenTouched(true);
    if (onFocus) {
      onFocus(e);
    }
  };

  // Handle blur
  const handleBlur = (e) => {
    setIsFocused(false);
    setHasBeenTouched(true);
    
    // Validate on blur if enabled
    if (validateOnBlur) {
      const validation = validateValue(value);
      setLocalError(validation.isValid ? null : validation.errors[0]);
    }
    
    if (onBlur) {
      onBlur(e);
    }
  };

  // Determine if we should show error
  const shouldShowError = showError && localError && hasBeenTouched;

  // Get input props based on field type
  const getInputProps = () => {
    const baseProps = {
      mode: 'outlined',
      style: [styles.input, inputStyle],
      value: value || '',
      onChangeText: handleChangeText,
      onFocus: handleFocus,
      onBlur: handleBlur,
      error: shouldShowError,
      ...props
    };

    switch (fieldType) {
      case 'number':
        return {
          ...baseProps,
          keyboardType: 'numeric',
          inputMode: 'numeric'
        };
      case 'email':
        return {
          ...baseProps,
          keyboardType: 'email-address',
          autoCapitalize: 'none',
          autoCorrect: false
        };
      case 'pin':
        return {
          ...baseProps,
          keyboardType: 'numeric',
          secureTextEntry: true,
          maxLength: 10
        };
      case 'phone':
        return {
          ...baseProps,
          keyboardType: 'phone-pad'
        };
      case 'multiline':
        return {
          ...baseProps,
          multiline: true,
          numberOfLines: 3
        };
      default:
        return baseProps;
    }
  };

  return (
    <View style={[styles.container, style]}>
      <TextInput
        label={label}
        {...getInputProps()}
      />
      
      {/* Show helper text */}
      {helperText && !shouldShowError && (
        <HelperText type="info" style={[styles.helperText, helperStyle]}>
          {helperText}
        </HelperText>
      )}
      
      {/* Show error message */}
      {shouldShowError && (
        <HelperText type="error" style={[styles.errorText, errorStyle]}>
          {localError}
        </HelperText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
  },
  helperText: {
    marginTop: 4,
    fontSize: 12,
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
  }
});

export default ValidatedInput; 