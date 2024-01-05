import { useState } from "react";
import { Text, View, StyleSheet, ScrollView, Pressable, Alert } from "react-native";
import { ActivityIndicator, Button, Checkbox, TextInput } from 'react-native-paper';
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import Transaction from "../services/transaction";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { userExists } from "./../action/auth"
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
            // console.log(error);
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
        <ScrollView automaticallyAdjustKeyboardInsets={true} style={styles.containerList}>
            <View style={styles.heading}>
                <Text style={{ fontSize: 30, color: 'blue' }}>Welcome</Text>
                <Text style={{ fontSize: 20, textAlign: 'center' }}>Please create a pin </Text>
            </View>



            <View style={styles.containerList}>
                <Text style={styles.texts}>PIN</Text>
                <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            mode='outlined'
                            style={{ backgroundColor: 'white' }}
                            placeholder="PIN"
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
                <Text style={styles.texts}>Confirm PIN</Text>
                <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            mode='outlined'
                            style={{ backgroundColor: 'white' }}
                            placeholder="Confirm PIN"
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
                    <Text style={{ color: 'white', textAlign: 'center', fontSize: 18 }}>Sign Up</Text>
                </Button>
            </View>

        </ScrollView>
    );

}


export default CreatePassword;


const styles = StyleSheet.create({
    heading: {
        marginTop: 70,
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
    }

})