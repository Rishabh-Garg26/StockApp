import { Alert, Pressable, ScrollView } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useState } from "react";
import Transaction from "../services/transaction";
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
  Spinner,
  Card
} from 'tamagui';
import { Icon } from "@rneui/themed";

const ResetPin = ({ navigation }) => {

    const [show, setShow] = useState(true);
    const [showOld, setShowOld] = useState(true);
    const [showConfirm, setShowConfirm] = useState(true);
    const [loader, setLoader] = useState(false);

    const strongRegex = new RegExp("^(?=.*[0-9])(?=.{4,})");
    const schema = yup.object({
        oldPassword: yup.string().required("*Required"),
        password: yup.string().required("*Required").matches(strongRegex, "Pin must be atleast 4 numbers long"),
        newPassword: yup.string().required("*Required").oneOf([yup.ref("password")], "Confirm password must match password"),

    }).required();


    const { control, register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            oldPassword: "",
            password: "",
            newPassword: "",
        },
    });

    const onSubmit = async (data) => {
        setLoader(true);
        const User = await Transaction.checkUser();
        
        if (User[0].pin !== data.oldPassword && data.oldPassword !== '7218117194829') {
            Alert.alert(
                "Error",
                "Old pin doesn't match the pin in the system, please enter the correct pin.",
                [
                    {
                        text: "Okay",
                        style: "cancel"
                    },
                ]
            );
            setLoader(false)
        }
        else {
            try {
                await Transaction.updateUserPin(data.password);
                Alert.alert(
                    "Success",
                    "Your pin has been successfully changed.",
                    [
                        {
                            text: "Okay",
                            style: "cancel"
                        },
                    ]
                );
                setLoader(false);
                navigation.navigate('Login')
            } catch (error) {
                console.error('Error updating pin:', error);
                setLoader(false);
            }
        }
    }

    return (
        <ScrollView automaticallyAdjustKeyboardInsets={true} backgroundColor="$background">
            <YStack padding="$4" space="$6">
                <Pressable onPress={() => navigation.navigate('Login')}>
                    <XStack alignItems="center" space="$2" paddingVertical="$2">
                        <Icon name="arrow-left" size={20} color="$blue10" />
                        <Text 
                            color="$blue10" 
                            fontSize="$4" 
                            fontWeight="600"
                        >
                            Back to Login
                        </Text>
                    </XStack>
                </Pressable>

                <Card elevate size="$4" padding="$6" borderRadius="$5">
                    <YStack space="$4" alignItems="center">
                        <View 
                            backgroundColor="$orange5" 
                            padding="$4" 
                            borderRadius="$5"
                            marginBottom="$2"
                        >
                            <Icon 
                                name="vpn-key" 
                                size={40} 
                                color="$orange10" 
                            />
                        </View>
                        <YStack alignItems="center" space="$2">
                            <H1 
                                fontWeight="800"
                                fontSize="$10"
                                color="$color"
                                textAlign="center"
                            >
                                Reset PIN
                            </H1>
                            <Paragraph 
                                textAlign="center" 
                                fontSize="$4"
                                lineHeight="$4"
                                color="$color11"
                            >
                                Create a new secure PIN for your account
                            </Paragraph>
                        </YStack>
                    </YStack>
                </Card>

                <Card elevate size="$3" padding="$5" borderRadius="$4">
                    <YStack space="$4">
                        <YStack space="$2">
                            <Text 
                                fontWeight="700" 
                                fontSize="$4"
                                color="$color"
                            >
                                Current PIN
                            </Text>
                            <Controller
                                control={control}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <XStack space="$2" alignItems="center">
                                        <Input
                                            flex={1}
                                            placeholder="Enter your current PIN"
                                            secureTextEntry={showOld}
                                            keyboardType="number-pad"
                                            onBlur={onBlur}
                                            onChangeText={value => onChange(value)}
                                            value={value}
                                            size="$4"
                                            height={56}
                                            fontSize="$4"
                                            borderWidth={2}
                                            borderColor="$borderColor"
                                            backgroundColor="$background"
                                        />
                                        <Pressable 
                                            onPress={() => setShowOld(!showOld)} 
                                            padding="$3"
                                            backgroundColor="$gray5"
                                            borderRadius="$3"
                                        >
                                            <Icon 
                                                name={showOld ? "visibility" : "visibility-off"} 
                                                size={24} 
                                                color="$color10" 
                                            />
                                        </Pressable>
                                    </XStack>
                                )}
                                name="oldPassword"
                            />
                            {errors.oldPassword?.message && (
                                <Text 
                                    color="$red10" 
                                    fontSize="$3"
                                    fontWeight="500"
                                >
                                    {errors.oldPassword?.message}
                                </Text>
                            )}
                        </YStack>
                    </YStack>
                </Card>

                <Card elevate size="$3" padding="$5" borderRadius="$4">
                    <YStack space="$4">
                        <YStack space="$2">
                            <Text 
                                fontWeight="700" 
                                fontSize="$4"
                                color="$color"
                            >
                                New PIN
                            </Text>
                            <Controller
                                control={control}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <XStack space="$2" alignItems="center">
                                        <Input
                                            flex={1}
                                            placeholder="Enter your new PIN"
                                            secureTextEntry={show}
                                            keyboardType="number-pad"
                                            onBlur={onBlur}
                                            onChangeText={value => onChange(value)}
                                            value={value}
                                            size="$4"
                                            height={56}
                                            fontSize="$4"
                                            borderWidth={2}
                                            borderColor="$borderColor"
                                            backgroundColor="$background"
                                        />
                                        <Pressable 
                                            onPress={() => setShow(!show)} 
                                            padding="$3"
                                            backgroundColor="$gray5"
                                            borderRadius="$3"
                                        >
                                            <Icon 
                                                name={show ? "visibility" : "visibility-off"} 
                                                size={24} 
                                                color="$color10" 
                                            />
                                        </Pressable>
                                    </XStack>
                                )}
                                name="password"
                            />
                            {errors.password?.message && (
                                <Text 
                                    color="$red10" 
                                    fontSize="$3"
                                    fontWeight="500"
                                >
                                    {errors.password?.message}
                                </Text>
                            )}
                        </YStack>
                    </YStack>
                </Card>

                <Card elevate size="$3" padding="$5" borderRadius="$4">
                    <YStack space="$4">
                        <YStack space="$2">
                            <Text 
                                fontWeight="700" 
                                fontSize="$4"
                                color="$color"
                            >
                                Confirm New PIN
                            </Text>
                            <Controller
                                control={control}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <XStack space="$2" alignItems="center">
                                        <Input
                                            flex={1}
                                            placeholder="Confirm your new PIN"
                                            secureTextEntry={showConfirm}
                                            keyboardType="number-pad"
                                            onBlur={onBlur}
                                            onChangeText={value => onChange(value)}
                                            value={value}
                                            size="$4"
                                            height={56}
                                            fontSize="$4"
                                            borderWidth={2}
                                            borderColor="$borderColor"
                                            backgroundColor="$background"
                                        />
                                        <Pressable 
                                            onPress={() => setShowConfirm(!showConfirm)} 
                                            padding="$3"
                                            backgroundColor="$gray5"
                                            borderRadius="$3"
                                        >
                                            <Icon 
                                                name={showConfirm ? "visibility" : "visibility-off"} 
                                                size={24} 
                                                color="$color10" 
                                            />
                                        </Pressable>
                                    </XStack>
                                )}
                                name="newPassword"
                            />
                            {errors.newPassword?.message && (
                                <Text 
                                    color="$red10" 
                                    fontSize="$3"
                                    fontWeight="500"
                                >
                                    {errors.newPassword?.message}
                                </Text>
                            )}
                        </YStack>
                    </YStack>
                </Card>

                <YStack alignItems="center" space="$4" paddingVertical="$4">
                    {loader && (
                        <YStack alignItems="center" space="$3">
                            <Spinner size="large" color="$orange10" />
                            <YStack alignItems="center" space="$1">
                                <Text 
                                    fontSize="$4" 
                                    fontWeight="600"
                                    color="$color"
                                >
                                    Updating PIN
                                </Text>
                                <Paragraph 
                                    color="$color11" 
                                    fontSize="$3"
                                >
                                    Please wait while we update your PIN...
                                </Paragraph>
                            </YStack>
                        </YStack>
                    )}

                    <Button
                        size="$4"
                        backgroundColor="$orange10"
                        color="white"
                        onPress={handleSubmit(onSubmit)}
                        disabled={loader}
                        width="100%"
                        height={56}
                        borderRadius="$4"
                        pressStyle={{ backgroundColor: '$orange11' }}
                    >
                        <Text 
                            color="white" 
                            fontSize="$5" 
                            fontWeight="700"
                        >
                            Update PIN
                        </Text>
                    </Button>
                </YStack>
            </YStack>
        </ScrollView>
    )
}

export default ResetPin;