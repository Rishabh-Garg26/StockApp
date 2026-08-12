import { useEffect, useState, useCallback } from "react";
import { ScrollView, Image, Alert, Pressable } from "react-native";
import Transaction from "../services/transaction";
import * as LocalAuthentication from 'expo-local-authentication';
import { useDispatch } from "react-redux";
import { login } from "./../action/auth";
import { 
  View, 
  Text, 
  Input, 
  Button, 
  YStack, 
  XStack, 
  H1, 
  H2, 
  H3,
  Paragraph,
  Switch,
  Spinner,
  Card
} from 'tamagui';

const Login = ({ navigation }) => {
    const [password, setPassword] = useState('');
    const [faceId, setIsFaceId] = useState(false);
    const [isBiometricSupported, setIsBiometricSupported] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();

    const onToggleSwitch = useCallback((checked) => {
        setIsFaceId(checked);
    }, []);

    const loginUsingBiometric = useCallback(async () => {
        try {
            const tokenUser = await Transaction.checkUser();
            if (tokenUser[0].biometric === 1) {
                setIsFaceId(true);

                const enroll = await LocalAuthentication.isEnrolledAsync();
                if (!enroll) {
                    Alert.alert(
                        "Biometric not found",
                        "Please register biometric with your phone to use this feature",
                        [
                            {
                                text: "Okay",
                                style: "cancel"
                            },
                        ]
                    );
                }
                else {
                    try {
                        const biometricAuth = await LocalAuthentication.authenticateAsync({
                            promptMessage: "Login with Biometrics",
                            disableDeviceFallback: true,
                            cancelLabel: "Cancel",
                        });
                        console.log(biometricAuth);
                        if (biometricAuth.success) {
                            dispatch(login());
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }
            }
        } catch (error) {
            console.log("Error in biometric login:", error);
        }
    }, [dispatch]);

    useEffect(() => {
        (async () => {
            try {
                const compatible = await LocalAuthentication.hasHardwareAsync();
                setIsBiometricSupported(compatible);
                
                // Check if user has biometric enabled
                const tokenUser = await Transaction.checkUser();
                if (tokenUser[0].biometric === 1) {
                    setIsFaceId(true);
                }
                
                // Only attempt biometric login if hardware is supported and enabled
                if (compatible && tokenUser[0].biometric === 1) {
                    await loginUsingBiometric();
                }
            } catch (error) {
                console.log("Error checking biometric support:", error);
            }
        })();
    }, [loginUsingBiometric]);

    const submit = async () => {
        if (password === '') {
            Alert.alert(
                "Please enter a PIN",
                "",
                [
                    {
                        text: "Okay",
                        style: "cancel"
                    },
                ]
            );
        }
        else {
            try {
                const result = await Transaction.checkPassword(password);
                setIsLoading(true);
                if (result.length === 0) {
                    setIsLoading(false);
                    Alert.alert(
                        "Incorrect Credentials",
                        "Password you have entered is incorrect, please try again",
                        [
                            {
                                text: "Okay",
                                style: "cancel"
                            },
                        ]
                    );
                }
                else {
                    if (faceId) {
                        await Transaction.updateBiometric(1);
                    }
                    else {
                        await Transaction.updateBiometric(0);
                    }
                    setIsLoading(false);
                    dispatch(login())
                    console.log('success');
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    return (
        <ScrollView automaticallyAdjustKeyboardInsets={true} backgroundColor="$background">
            <YStack padding="$4" space="$6">
                {/* Logo Section */}
                <View alignItems="center" paddingVertical="$6">
                    <View 
                        backgroundColor="white" 
                        padding="$4" 
                        borderRadius="$5"
                        marginTop="$4"
                        // marginBottom="$4"
                    >
                        <Image 
                            source={require("../../assets/logo-placeholder-image.png")} 
                            style={{ width: 150, height: 100 }}
                        />
                    </View>
                </View>
                
                {/* Login Form */}
                <Card elevate size="$4" padding="$6" borderRadius="$5">
                    <YStack space="$5" alignItems="center">
                        <YStack alignItems="center" space="$2">
                            <H1 
                                color="$blue10" 
                                fontWeight="800"
                                fontSize="$10"
                            >
                                Welcome Back
                            </H1>
                            <Paragraph 
                                color="$color11" 
                                fontSize="$4"
                                textAlign="center"
                            >
                                Sign in to access your stock management system
                            </Paragraph>
                        </YStack>
                        
                        <YStack space="$4" width="100%">
                            <YStack space="$2">
                                <Text 
                                    fontWeight="600" 
                                    fontSize="$4"
                                    color="$color"
                                >
                                    PIN
                                </Text>
                                <Input
                                    placeholder="Enter your PIN"
                                    value={password}
                                    keyboardType="number-pad"
                                    secureTextEntry
                                    size="$4"
                                    width="100%"
                                    height={56}
                                    fontSize="$4"
                                    borderWidth={2}
                                    borderColor="$borderColor"
                                    backgroundColor="$background"
                                    onChangeText={text => setPassword(text)}
                                />
                            </YStack>

                            {isBiometricSupported && (
                                <Card 
                                    backgroundColor="$blue5" 
                                    padding="$4" 
                                    borderRadius="$4"
                                    borderWidth={1}
                                    borderColor="$blue8"
                                >
                                    <YStack space="$3">
                                        <XStack space="$3" alignItems="center">
                                            <Switch 
                                                checked={faceId} 
                                                onCheckedChange={onToggleSwitch}
                                                size="$3"
                                                backgroundColor="$gray8"
                                                borderColor="$gray10"
                                            >
                                                <Switch.Thumb animation="quick" />
                                            </Switch>
                                            <YStack flex={1} space="$1">
                                                <Text 
                                                    fontSize="$4" 
                                                    fontWeight="600"
                                                    color="$color"
                                                >
                                                    Enable Biometric Login
                                                </Text>
                                                <Paragraph 
                                                    fontSize="$3" 
                                                    color="$color11"
                                                >
                                                    Use Face ID or Touch ID for faster login
                                                </Paragraph>
                                            </YStack>
                                        </XStack>
                                        
                                        <Button
                                            size="$10"
                                            backgroundColor="$blue10"
                                            color="white"
                                            onPress={loginUsingBiometric}
                                            borderRadius="$3"
                                            pressStyle={{ backgroundColor: '$blue11' }}
                                        >
                                            <Text 
                                                color="white" 
                                                fontSize="$3" 
                                                fontWeight="600"
                                            >
                                                Login with Biometrics
                                            </Text>
                                        </Button>
                                        
                                    </YStack>
                                </Card>
                            )}

                            <Pressable onPress={() => navigation.navigate('ResetPin')}>
                                <Text 
                                    color="$blue10" 
                                    fontSize="$4" 
                                    fontWeight="600"
                                    textAlign="center"
                                    paddingVertical="$2"
                                >
                                    Forgot PIN? Reset here
                                </Text>
                            </Pressable>
                        </YStack>

                        {isLoading && (
                            <YStack alignItems="center" space="$3">
                                <Spinner size="large" color="$blue10" />
                                <YStack alignItems="center" space="$1">
                                    <Text 
                                        fontSize="$4" 
                                        fontWeight="600"
                                        color="$color"
                                    >
                                        Signing in...
                                    </Text>
                                    <Paragraph 
                                        color="$color11" 
                                        fontSize="$3"
                                    >
                                        Please wait a moment
                                    </Paragraph>
                                </YStack>
                            </YStack>
                        )}

                        <Button
                            size="$4"
                            backgroundColor="$blue10"
                            color="white"
                            onPress={submit}
                            disabled={isLoading}
                            width="100%"
                            height={56}
                            borderRadius="$4"
                            pressStyle={{ backgroundColor: '$blue11' }}
                        >
                            <Text 
                                color="white" 
                                fontSize="$5" 
                                fontWeight="700"
                            >
                                Sign In
                            </Text>
                        </Button>
                    </YStack>
                </Card>
            </YStack>
        </ScrollView>
    )
}

export default Login;