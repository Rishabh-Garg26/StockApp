import React from "react";
import { Alert } from "react-native";
import InwardForm from "./InwardForm";
import Transaction from "../services/transaction";

const AddNewInward = () => {

    const handleSubmit = async (data) => {
        try {
            await Transaction.insertInward(data.receivedDate, data.paymentDate, data.location, data.lotnumber, data.item, data.quantity, data.unit, data.marka, data.balance, data.imageExist, data.imageName);

            Alert.alert(
                "Success",
                "Inward added successfully",
                [
                    {
                        text: "Okay",
                        style: "cancel"
                    },
                ]
            );
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
        }
    }

    return (
        <InwardForm onSubmit={handleSubmit} />
    );
}

export default AddNewInward;