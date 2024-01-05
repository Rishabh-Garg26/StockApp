import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View, Image, Alert, Pressable } from "react-native";
import { ActivityIndicator, Button, Switch, TextInput } from "react-native-paper";
import Transaction from "../services/transaction";
import * as LocalAuthentication from 'expo-local-authentication';
import { useDispatch } from "react-redux";
import { login } from "./../action/auth"
const Login = ({ navigation }) => {
    const [password, setPassword] = useState('');
    const [faceId, setIsFaceId] = useState(false);
    const [isBiometricSupported, setIsBiometricSupported] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const onToggleSwitch = () => setIsFaceId(!faceId);
    const dispatch = useDispatch();

    useEffect(() => {
        (async () => {
            const compatible = await LocalAuthentication.hasHardwareAsync();
            setIsBiometricSupported(compatible);
            loginUsingBiometric()


        })();
    }, [loginUsingBiometric]);




    const loginUsingBiometric = async () => {

        const tokenUser = await Transaction.checkUser();
        // console.log(tokenUser);
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
                    // console.log('here')
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
    }


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
                // console.log(result);
                // console.log(expoToken);
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
                        // console.log(faceId);
                        await Transaction.updateBiometric(1);
                    }
                    else {
                        // console.log(faceId);
                        await Transaction.updateBiometric(0);
                    }
                    setIsLoading(false);
                    // console.log(res);
                    // navigation.navigate('/')

                    dispatch(login())
                    console.log('success');
                }
            } catch (error) {
                console.log(error);
            }






            // console.log(err);

        }

        // console.log(response);
        // navigation.navigate('Register')
    }


    return (


        <ScrollView automaticallyAdjustKeyboardInsets={true} style={styles.containerList}>
            <View style={styles.container}>
                <Image source={require("../../assets/login.png")} />
            </View>
            <View style={styles.heading}>
                <Text style={{ fontSize: 30, color: 'blue' }}>Sign In</Text>
            </View>

            <TextInput
                label="PIN"
                value={password}
                mode="outlined"
                keyboardType="number-pad"
                secureTextEntry
                right={<TextInput.Icon icon="eye" />}
                onChangeText={text => setPassword(text)}
            />

            {isBiometricSupported && <View style={[styles.containerList, { flexDirection: 'row', paddingVertical: 20 }]}>
                <Switch value={faceId} onValueChange={onToggleSwitch} />
                <Text style={{ fontSize: 20 }}> Use FaceId to login from next time</Text>
            </View>}

            <Pressable style={{ paddingVertical: 20, alignItems: 'center' }} onPress={() => navigation.navigate('ResetPin')}>
                <Text style={{ fontSize: 20, color: 'blue' }}> Reset Pin</Text>
            </Pressable>


            {isLoading &&
                <ActivityIndicator size="large" />}
            <Button
                style={{ height: 50, marginTop: 30 }} labelStyle={{ marginTop: 15, fontSize: 18 }} mode="contained"
                onPress={submit}
            >
                <Text style={{ color: 'white', textAlign: 'center', fontSize: 18 }}>Sign In</Text>
            </Button>

        </ScrollView>

    )
}

export default Login;


const styles = StyleSheet.create({
    heading: {
        marginTop: 20,
        alignContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 25,
    },
    containerList: {
        backgroundColor: 'white',
        padding: 10,
    },
    texts: {
        marginLeft: 5,
        fontWeight: "900"
    },
    container: {
        alignItems: 'center'
    },


})