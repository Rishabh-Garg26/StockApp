import React, { useState } from "react";
import { ScrollView, Dimensions } from "react-native";
import { Icon } from "@rneui/themed";
import { pickDocument } from "../action/commonFunction";
import { 
  View, 
  Text, 
  Card, 
  Button, 
  YStack, 
  XStack, 
  H1, 
  H2, 
  H3,
  Paragraph,
  Theme,
  useTheme
} from 'tamagui';
import Animated, { 
  FadeInUp, 
  FadeInDown, 
  FadeInLeft,
  FadeInRight 
} from 'react-native-reanimated';
import { useDispatch } from "react-redux";
import { logout } from "../action/auth";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const HomeScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  const menuItems = [
    {
      id: 'inwards',
      title: 'Inwards',
      subtitle: 'Manage incoming stock',
      icon: 'arrow-downward',
      iconColor: '#10b981', // Green
      onPress: () => navigation.navigate("Inwards"),
      animation: FadeInUp,
      delay: 100
    },
    {
      id: 'outwards',
      title: 'Outwards',
      subtitle: 'Track outgoing stock',
      icon: 'arrow-upward',
      iconColor: '#f59e0b', // Amber
      onPress: () => navigation.navigate("Outwards"),
      animation: FadeInUp,
      delay: 200
    },
    {
      id: 'stock-position',
      title: 'Stock Position',
      subtitle: 'View current inventory',
      icon: 'book',
      iconColor: '#3b82f6', // Blue
      onPress: () => navigation.navigate("Stock Position"),
      animation: FadeInUp,
      delay: 300
    },
    {
      id: 'backup-restore',
      title: 'Backup & Restore',
      subtitle: 'Manage data backup',
      icon: 'cloud-upload',
      iconColor: '#8b5cf6', // Purple
      onPress: () => navigation.navigate("Backup & Restore"),
      animation: FadeInUp,
      delay: 400
    },
    {
      id: 'upload-data',
      title: 'Upload Inward Data',
      subtitle: 'Import data from CSV',
      icon: 'file-upload',
      iconColor: '#ef4444', // Red
      onPress: () => pickDocument(setIsLoading),
      animation: FadeInUp,
      delay: 500
    }
  ];

  return (
    <View flex={1} backgroundColor="$background">
      {/* Header */}
      <Animated.View 
        entering={FadeInDown.delay(50)}
        style={{ paddingTop: 20, paddingHorizontal: 16, paddingBottom: 16 }}
      >
        <Card elevate size="$4" padding="$6" borderRadius="$5">
          <YStack alignItems="center" space="$4">
            <View 
              backgroundColor="$blue5" 
              padding="$4" 
              borderRadius="$4"
            >
              <Icon 
                name="warehouse" 
                color="$blue10" 
                size={40} 
              />
            </View>
            <YStack alignItems="center" space="$2">
              <H1 
                fontWeight="800" 
                textAlign="center"
                fontSize="$10"
                color="$color"
              >
                Stock Management
              </H1>
              <Paragraph 
                textAlign="center" 
                color="$color11"
                fontSize="$4"
                lineHeight="$4"
              >
                Manage your inventory efficiently
              </Paragraph>
            </YStack>
          </YStack>
        </Card>
      </Animated.View>

      {/* Menu Items */}
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
      >
        <YStack space="$4">
          {menuItems.map((item, index) => (
            <Animated.View
              key={item.id}
              entering={item.animation.delay(item.delay)}
            >
              <Card 
                elevate 
                size="$3" 
                padding="$5" 
                borderRadius="$4"
                pressStyle={{ scale: 0.98, backgroundColor: '$backgroundHover' }}
                onPress={item.onPress}
              >
                <XStack space="$4" alignItems="center">
                  <View 
                    backgroundColor={item.iconColor + '15'} 
                    padding="$3" 
                    borderRadius="$4"
                    borderWidth={1}
                    borderColor={item.iconColor + '30'}
                  >
                    <Icon 
                      name={item.icon} 
                      color={item.iconColor} 
                      size={28} 
                    />
                  </View>
                  <YStack flex={1} space="$2">
                    <H3 
                      fontWeight="700" 
                      fontSize="$6"
                      color="$color"
                    >
                      {item.title}
                    </H3>
                    <Paragraph 
                      color="$color11" 
                      fontSize="$4"
                      lineHeight="$4"
                    >
                      {item.subtitle}
                    </Paragraph>
                  </YStack>
                  <Icon 
                    name="chevron-right" 
                    color="$color10" 
                    size={24} 
                  />
                </XStack>
              </Card>
            </Animated.View>
          ))}

          {/* Quick Actions */}
          <Animated.View entering={FadeInUp.delay(600)}>
            <YStack space="$4">
              <H2 
                marginVertical="$4" 
                fontWeight="700"
                fontSize="$8"
                color="$color"
              >
                Quick Actions
              </H2>
              <XStack space="$3" flexWrap="wrap">
                <Button
                  variant="outlined"
                  size="$4"
                  backgroundColor="$blue5"
                  borderColor="$blue8"
                  borderWidth={2}
                  icon={<Icon name="add" size={20} color="$blue10" />}
                  onPress={() => navigation.navigate("Add New Inward")}
                  flex={1}
                  minWidth={160}
                  height={56}
                  borderRadius="$4"
                >
                  <Text 
                    color="$blue10" 
                    fontSize="$4" 
                    fontWeight="600"
                  >
                    Add Inward
                  </Text>
                </Button>
                <Button
                  variant="outlined"
                  size="$4"
                  backgroundColor="$orange5"
                  borderColor="$orange8"
                  borderWidth={2}
                  icon={<Icon name="add" size={20} color="$orange10" />}
                  onPress={() => navigation.navigate("Add New Outward")}
                  flex={1}
                  minWidth={160}
                  height={56}
                  borderRadius="$4"
                >
                  <Text 
                    color="$orange10" 
                    fontSize="$4" 
                    fontWeight="600"
                  >
                    Add Outward
                  </Text>
                </Button>
              </XStack>
            </YStack>
          </Animated.View>

          {/* Logout Section */}
          <Animated.View entering={FadeInUp.delay(700)}>
            <YStack space="$4" marginTop="$4">
              <Card 
                backgroundColor="$red5" 
                padding="$4" 
                borderRadius="$4"
                borderWidth={1}
                borderColor="$red8"
              >
                <Button
                  size="$4"
                  backgroundColor="$red10"
                  color="white"
                  onPress={handleLogout}
                  width="100%"
                  height={56}
                  borderRadius="$4"
                  pressStyle={{ backgroundColor: '$red11' }}
                  icon={<Icon name="logout" size={20} color="white" />}
                >
                  <Text 
                    color="white" 
                    fontSize="$5" 
                    fontWeight="700"
                  >
                    Logout
                  </Text>
                </Button>
              </Card>
            </YStack>
          </Animated.View>
        </YStack>
      </ScrollView>

      {/* Loading Overlay */}
      {isLoading && (
        <Animated.View 
          entering={FadeInUp}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <Card elevate size="$4" padding="$6" borderRadius="$4">
            <YStack alignItems="center" space="$4">
              <View 
                backgroundColor="$blue5" 
                padding="$4" 
                borderRadius="$4"
              >
                <Icon name="file-upload" size={32} color="$blue10" />
              </View>
              <YStack alignItems="center" space="$2">
                <Text fontSize="$5" fontWeight="600" color="$color">
                  Uploading Data
                </Text>
                <Paragraph color="$color11" textAlign="center">
                  Please wait while we process your file...
                </Paragraph>
              </YStack>
            </YStack>
          </Card>
        </Animated.View>
      )}
    </View>
  );
};

export default HomeScreen;
