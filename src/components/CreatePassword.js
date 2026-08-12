import { useState } from "react";
import { ScrollView, Pressable, Alert } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import Transaction from "../services/transaction";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { userExists } from "./../action/auth";
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

const CreatePassword = () => {

    const [show, setShow] = useState(true);
    const [showConfirm, setShowConfirm] = useState(true);
    const [loader, setLoader] = useState(false);
    const dispatch = useDispatch();

    const strongRegex = new RegExp("^(?=.*[0-9])(?=.{4,})");
    const schema = yup.object({
        password: yup.string().required("*Required").matches(strongRegex, "Pin must be atleast 4 numbers long"),
        newPassword: yup.string().required("*Required").oneOf([yup.ref("password")], "Confirm password must match password"),

    }).required();


    const { control, register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });


    const onSubmit = async (data) => {
        setLoader(true);
        try {
            await Transaction.createDatabase(data.password, data.email);

            Alert.alert(
                "Success",
                "Pin created successfully.",
                [
                    {
                        text: "Okay",
                        style: "cancel"
                    },
                ]
            );

            dispatch(userExists());
            setLoader(false);
        } catch (error) {
            Alert.alert(
                "Failure",
                "Something went wrong please try again later.",
                [
                    {
                        text: "Okay",
                        style: "cancel"
                    },
                ]
            );
            setLoader(false);
        }
    }

    return (
        <ScrollView automaticallyAdjustKeyboardInsets={true} backgroundColor="$background">
            <YStack padding="$4" space="$6">
                <Card elevate size="$4" padding="$6" borderRadius="$5">
                    <YStack space="$5" alignItems="center">
                        <View 
                            backgroundColor="$blue5" 
                            padding="$4" 
                            borderRadius="$5"
                            marginBottom="$2"
                        >
                            <Icon 
                                name="security" 
                                size={40} 
                                color="$blue10" 
                            />
                        </View>
                        <YStack alignItems="center" space="$2">
                            <H1 
                                color="$blue10" 
                                fontWeight="800"
                                fontSize="$10"
                                textAlign="center"
                            >
                                Welcome
                            </H1>
                            <Paragraph 
                                textAlign="center" 
                                fontSize="$4"
                                lineHeight="$4"
                                color="$color11"
                            >
                                Please create a secure PIN to get started
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
                                PIN
                            </Text>
                            <Controller
                                control={control}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <XStack space="$2" alignItems="center">
                                        <Input
                                            flex={1}
                                            placeholder="Enter your PIN"
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
                                Confirm PIN
                            </Text>
                            <Controller
                                control={control}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <XStack space="$2" alignItems="center">
                                        <Input
                                            flex={1}
                                            placeholder="Confirm your PIN"
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
                            <Spinner size="large" color="$blue10" />
                            <YStack alignItems="center" space="$1">
                                <Text 
                                    fontSize="$4" 
                                    fontWeight="600"
                                    color="$color"
                                >
                                    Creating Account
                                </Text>
                                <Paragraph 
                                    color="$color11" 
                                    fontSize="$3"
                                >
                                    Please wait while we set up your account...
                                </Paragraph>
                            </YStack>
                        </YStack>
                    )}

                    <Button
                        size="$4"
                        backgroundColor="$blue10"
                        color="white"
                        onPress={handleSubmit(onSubmit)}
                        disabled={loader}
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
                            Create Account
                        </Text>
                    </Button>
                </YStack>
            </YStack>
        </ScrollView>
    );
}

export default CreatePassword;