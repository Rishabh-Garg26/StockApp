import React from 'react';
import { StyleSheet, Pressable, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { Icon } from '@rneui/themed';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withSequence,
  withTiming
} from 'react-native-reanimated';

const ModernButton = ({ 
  title, 
  onPress, 
  variant = 'primary', // 'primary', 'secondary', 'outline', 'ghost'
  size = 'medium', // 'small', 'medium', 'large'
  icon,
  iconPosition = 'left', // 'left', 'right'
  disabled = false,
  loading = false,
  style,
  textStyle,
  fullWidth = false,
  rounded = false
}) => {
  const theme = useTheme();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const handlePressIn = () => {
    if (!disabled && !loading) {
      scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
    }
  };

  const handlePressOut = () => {
    if (!disabled && !loading) {
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    }
  };

  const handlePress = () => {
    if (!disabled && !loading && onPress) {
      // Add haptic feedback animation
      scale.value = withSequence(
        withTiming(0.9, { duration: 100 }),
        withTiming(1, { duration: 100 })
      );
      onPress();
    }
  };

  const getButtonStyle = () => {
    const baseStyle = {
      borderRadius: rounded ? 50 : 12,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    };

    const sizeStyle = {
      small: { paddingHorizontal: 16, paddingVertical: 8, minHeight: 36 },
      medium: { paddingHorizontal: 24, paddingVertical: 12, minHeight: 48 },
      large: { paddingHorizontal: 32, paddingVertical: 16, minHeight: 56 },
    };

    const variantStyle = {
      primary: {
        backgroundColor: theme.colors.primary,
        elevation: 2,
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      secondary: {
        backgroundColor: theme.colors.secondary,
        elevation: 2,
        shadowColor: theme.colors.secondary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: theme.colors.primary,
      },
      ghost: {
        backgroundColor: 'transparent',
      },
    };

    return {
      ...baseStyle,
      ...sizeStyle[size],
      ...variantStyle[variant],
      ...(fullWidth && { width: '100%' }),
    };
  };

  const getTextStyle = () => {
    const baseTextStyle = {
      fontWeight: '600',
      textAlign: 'center',
    };

    const sizeTextStyle = {
      small: { fontSize: 14 },
      medium: { fontSize: 16 },
      large: { fontSize: 18 },
    };

    const variantTextStyle = {
      primary: { color: theme.colors.onPrimary },
      secondary: { color: theme.colors.onSecondary },
      outline: { color: theme.colors.primary },
      ghost: { color: theme.colors.primary },
    };

    return {
      ...baseTextStyle,
      ...sizeTextStyle[size],
      ...variantTextStyle[variant],
    };
  };

  const getIconStyle = () => {
    const iconSizes = {
      small: 16,
      medium: 20,
      large: 24,
    };

    return {
      size: iconSizes[size],
      color: getTextStyle().color,
      style: {
        marginLeft: iconPosition === 'right' ? 8 : 0,
        marginRight: iconPosition === 'left' ? 8 : 0,
      },
    };
  };

  return (
    <Animated.View style={[animatedStyle, style]}>
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        style={({ pressed }) => [
          styles.pressable,
          getButtonStyle(),
          (disabled || loading) && styles.disabled,
        ]}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <Animated.View style={styles.spinner} />
            <Text style={[getTextStyle(), styles.loadingText]}>Loading...</Text>
          </View>
        ) : (
          <>
            {icon && iconPosition === 'left' && (
              <Icon name={icon} {...getIconStyle()} />
            )}
            <Text style={[getTextStyle(), textStyle]}>{title}</Text>
            {icon && iconPosition === 'right' && (
              <Icon name={icon} {...getIconStyle()} />
            )}
          </>
        )}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  pressable: {
    // Pressable styles
  },
  disabled: {
    opacity: 0.5,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spinner: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    borderTopColor: 'currentColor',
    marginRight: 8,
  },
  loadingText: {
    marginLeft: 8,
  },
});

export default ModernButton; 