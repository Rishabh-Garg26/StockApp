import React, { useState, useRef } from 'react';
import { View, StyleSheet, TextInput as RNTextInput, Pressable } from 'react-native';
import { Text, useTheme, HelperText } from 'react-native-paper';
import { Icon } from '@rneui/themed';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';

const ModernInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  autoCorrect = true,
  multiline = false,
  numberOfLines = 1,
  maxLength,
  error,
  helperText,
  leftIcon,
  rightIcon,
  onRightIconPress,
  disabled = false,
  style,
  inputStyle,
  onFocus,
  onBlur,
  ...props
}) => {
  const theme = useTheme();
  const inputRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(!secureTextEntry);
  
  const focusAnim = useSharedValue(0);
  const scaleAnim = useSharedValue(1);

  const animatedLabelStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      focusAnim.value,
      [0, 1],
      [0, -20],
      Extrapolate.CLAMP
    );
    
    const scale = interpolate(
      focusAnim.value,
      [0, 1],
      [1, 0.85],
      Extrapolate.CLAMP
    );

    return {
      transform: [
        { translateY },
        { scale },
      ],
    };
  });

  const animatedBorderStyle = useAnimatedStyle(() => {
    const borderColor = error 
      ? theme.colors.error 
      : isFocused 
        ? theme.colors.primary 
        : theme.colors.outline;

    return {
      borderColor: withTiming(borderColor, { duration: 200 }),
    };
  });

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scaleAnim.value }],
    };
  });

  const handleFocus = () => {
    setIsFocused(true);
    focusAnim.value = withSpring(1, { damping: 15, stiffness: 300 });
    scaleAnim.value = withSpring(1.02, { damping: 15, stiffness: 300 });
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (!value) {
      focusAnim.value = withSpring(0, { damping: 15, stiffness: 300 });
    }
    scaleAnim.value = withSpring(1, { damping: 15, stiffness: 300 });
    onBlur?.();
  };

  const handlePress = () => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const getRightIcon = () => {
    if (secureTextEntry) {
      return (
        <Pressable onPress={togglePasswordVisibility} style={styles.iconButton}>
          <Icon 
            name={showPassword ? 'eye-off' : 'eye'} 
            size={20} 
            color={theme.colors.onSurfaceVariant}
          />
        </Pressable>
      );
    }
    
    if (rightIcon) {
      return (
        <Pressable onPress={onRightIconPress} style={styles.iconButton}>
          <Icon name={rightIcon} size={20} color={theme.colors.onSurfaceVariant} />
        </Pressable>
      );
    }
    
    return null;
  };

  return (
    <Animated.View style={[animatedContainerStyle, style]}>
      <Pressable onPress={handlePress} disabled={disabled}>
        <View style={[styles.container, animatedBorderStyle]}>
          {leftIcon && (
            <View style={styles.leftIconContainer}>
              <Icon name={leftIcon} size={20} color={theme.colors.onSurfaceVariant} />
            </View>
          )}
          
          <View style={styles.inputContainer}>
            <Animated.View style={[styles.labelContainer, animatedLabelStyle]}>
              <Text 
                style={[
                  styles.label,
                  { 
                    color: error 
                      ? theme.colors.error 
                      : isFocused 
                        ? theme.colors.primary 
                        : theme.colors.onSurfaceVariant 
                  }
                ]}
              >
                {label}
              </Text>
            </Animated.View>
            
            <RNTextInput
              ref={inputRef}
              value={value}
              onChangeText={onChangeText}
              placeholder={isFocused ? placeholder : ''}
              secureTextEntry={secureTextEntry && !showPassword}
              keyboardType={keyboardType}
              autoCapitalize={autoCapitalize}
              autoCorrect={autoCorrect}
              multiline={multiline}
              numberOfLines={numberOfLines}
              maxLength={maxLength}
              editable={!disabled}
              onFocus={handleFocus}
              onBlur={handleBlur}
              style={[
                styles.input,
                inputStyle,
                { color: theme.colors.onSurface },
                multiline && styles.multilineInput
              ]}
              placeholderTextColor={theme.colors.onSurfaceVariant}
              {...props}
            />
          </View>
          
          {getRightIcon()}
        </View>
      </Pressable>
      
      {(error || helperText) && (
        <HelperText 
          type={error ? 'error' : 'info'} 
          style={styles.helperText}
        >
          {error || helperText}
        </HelperText>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: 'white',
    minHeight: 56,
    paddingHorizontal: 16,
  },
  leftIconContainer: {
    marginRight: 12,
  },
  inputContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 8,
  },
  labelContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  input: {
    fontSize: 16,
    padding: 0,
    margin: 0,
    minHeight: 24,
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
    paddingTop: 8,
  },
  iconButton: {
    padding: 4,
    marginLeft: 8,
  },
  helperText: {
    marginTop: 4,
    marginLeft: 4,
  },
});

export default ModernInput; 