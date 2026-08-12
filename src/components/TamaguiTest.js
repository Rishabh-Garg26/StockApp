import React from 'react';
import { 
  View, 
  Text, 
  Button, 
  YStack, 
  XStack, 
  H1, 
  H2, 
  H3,
  Paragraph,
  Card,
  Input,
  Switch,
  Spinner
} from 'tamagui';

const TamaguiTest = () => {
  return (
    <View flex={1} backgroundColor="$background" padding="$4">
      <YStack space="$4">
        <H1 color="$color">Tamagui Test Component</H1>
        
        <Card elevate size="$3" padding="$4" borderRadius="$4">
          <YStack space="$3">
            <H2>Card Component</H2>
            <Paragraph>This is a test card using Tamagui components.</Paragraph>
          </YStack>
        </Card>

        <XStack space="$3" flexWrap="wrap">
          <Button size="$3" backgroundColor="$blue10">
            Primary Button
          </Button>
          <Button size="$3" variant="outlined">
            Outlined Button
          </Button>
        </XStack>

        <Input placeholder="Test input" size="$4" />

        <XStack space="$3" alignItems="center">
          <Switch size="$2" />
          <Paragraph>Toggle switch</Paragraph>
        </XStack>

        <YStack alignItems="center">
          <Spinner size="large" color="$blue10" />
          <Paragraph>Loading spinner</Paragraph>
        </YStack>

        <Text color="$green10" fontSize="$6" fontWeight="bold">
          ✅ Tamagui is working!
        </Text>
      </YStack>
    </View>
  );
};

export default TamaguiTest; 