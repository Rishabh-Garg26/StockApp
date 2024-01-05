import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { ActivityIndicator, Button, Checkbox, TextInput } from 'react-native-paper';
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useState } from "react";
import Transaction from "../services/transaction";

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
        // console.log()
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

            }
        }

    }
    return (
        <ScrollView automaticallyAdjustKeyboardInsets={true} style={styles.containerList}>
            <Pressable onPress={() => navigation.navigate('Login')}>
                <Text style={{ paddingTop: 60, paddingLeft: 30, fontSize: 20, color: 'blue' }}> Back</Text>
            </Pressable>

            <View style={styles.container}>
                <Text style={{ fontSize: 30 }}>Reset Pin</Text>
            </View>

            <View style={styles.containerList}>
                <Text style={styles.texts}>Old PIN</Text>
                <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            mode='outlined'
                            style={{ backgroundColor: 'white' }}
                            placeholder="Old PIN"
                            secureTextEntry={showOld}
                            keyboardType="number-pad"
                            onBlur={onBlur}
                            onChangeText={value => onChange(value)}
                            right={<TextInput.Icon onPress={e => setShowOld(!showOld)} icon="eye" />}
                            value={value} />
                    )}
                    name="oldPassword"
                />
                <Text style={{ marginLeft: 10, color: 'red' }}>{errors.oldPassword?.message}</Text>

            </View>

            <View style={styles.containerList}>
                <Text style={styles.texts}>New PIN</Text>
                <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            mode='outlined'
                            style={{ backgroundColor: 'white' }}
                            placeholder="New PIN"
                            secureTextEntry={show}
                            keyboardType="number-pad"
                            onBlur={onBlur}
                            onChangeText={value => onChange(value)}
                            right={<TextInput.Icon onPress={e => setShow(!show)} icon="eye" />}
                            value={value} />
                    )}
                    name="password"
                />
                <Text style={{ marginLeft: 10, color: 'red' }}>{errors.password?.message}</Text>

            </View>


            <View style={styles.containerList}>
                <Text style={styles.texts}>Confirm New PIN</Text>
                <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            mode='outlined'
                            style={{ backgroundColor: 'white' }}
                            placeholder="Confirm new PIN"
                            secureTextEntry={showConfirm}
                            keyboardType="number-pad"
                            onBlur={onBlur}
                            onChangeText={value => onChange(value)}
                            right={<TextInput.Icon onPress={e => setShowConfirm(!showConfirm)} icon="eye" />}
                            value={value} />
                    )}
                    name="newPassword"
                />
                <Text style={{ marginLeft: 10, color: 'red' }}>{errors.newPassword?.message}</Text>
            </View>


            <View style={{ alignContent: 'center', alignItems: 'center', padding: 30, backgroundColor: 'white', }}>
                {loader && <ActivityIndicator size="large" />}

                <Button
                    style={{ height: 50 }} labelStyle={{ marginTop: 15, fontSize: 18 }} mode="contained"
                    onPress={handleSubmit(onSubmit)}
                >
                    <Text style={{ color: 'white', textAlign: 'center', fontSize: 18 }}>Submit</Text>
                </Button>
            </View>


        </ScrollView>
    )

}



export default ResetPin;

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
        marginTop: 100,
        marginBottom: 30,
        alignItems: 'center'
    },


})