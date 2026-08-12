import React from 'react';
import { View, StyleSheet, Pressable, Dimensions } from 'react-native';
import { Text, Surface, useTheme } from 'react-native-paper';
import { Icon } from '@rneui/themed';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';

const { width: screenWidth } = Dimensions.get('window');

const ModernCard = ({ 
  title, 
  subtitle, 
  icon, 
  iconColor = '#6366f1', 
  onPress, 
  style,
  children,
  disabled = false,
  variant = 'default' // 'default', 'elevated', 'outlined'
}) => {
  const theme = useTheme();
  const scale = useSharedValue(1);
  const pressed = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        {
          translateY: interpolate(
            pressed.value,
            [0, 1],
            [0, -2],
            Extrapolate.CLAMP
          ),
        },
      ],
    };
  });

  const handlePressIn = () => {
    if (!disabled) {
      scale.value = withSpring(0.98, { damping: 15, stiffness: 300 });
      pressed.value = withSpring(1);
    }
  };

  const handlePressOut = () => {
    if (!disabled) {
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
      pressed.value = withSpring(0);
    }
  };

  const getCardStyle = () => {
    switch (variant) {
      case 'elevated':
        return {
          elevation: 8,
          shadowColor: theme.colors.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
        };
      case 'outlined':
        return {
          borderWidth: 1,
          borderColor: theme.colors.outline,
          elevation: 0,
        };
      default:
        return {
          elevation: 2,
          shadowColor: theme.colors.onSurface,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        };
    }
  };

  return (
    <Animated.View style={[animatedStyle, style]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={({ pressed }) => [
          styles.pressable,
          disabled && styles.disabled
        ]}
      >
        <Surface style={[styles.card, getCardStyle()]}>
          <View style={styles.content}>
            {icon && (
              <View style={[styles.iconContainer, { backgroundColor: `${iconColor}15` }]}>
                <Icon 
                  name={icon} 
                  color={iconColor} 
                  size={24} 
                />
              </View>
            )}
            <View style={styles.textContainer}>
              <Text 
                variant="titleMedium" 
                style={[styles.title, { color: theme.colors.onSurface }]}
                numberOfLines={2}
              >
                {title}
              </Text>
              {subtitle && (
                <Text 
                  variant="bodySmall" 
                  style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}
                  numberOfLines={1}
                >
                  {subtitle}
                </Text>
              )}
            </View>
            {children}
          </View>
        </Surface>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  pressable: {
    marginVertical: 6,
    marginHorizontal: 16,
  },
  card: {
    borderRadius: 16,
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    minHeight: 80,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontWeight: '600',
    marginBottom: 4,
    lineHeight: 20,
  },
  subtitle: {
    lineHeight: 16,
  },
  disabled: {
    opacity: 0.5,
  },
});

export default ModernCard; 