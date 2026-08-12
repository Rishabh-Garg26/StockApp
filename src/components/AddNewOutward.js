import React from "react";
import { Alert } from "react-native";
import OutwardForm from "./OutwardForm";
import Transaction from "../services/transaction";

const AddNewOutward = () => {

    const handleSubmit = async (data) => {
        try {
            await Transaction.insertOutward(data.receivedDate, data.gatePassDate, data.location, data.lotnumber, data.item, data.quantity, data.issued, data.unit, data.marka, data.balance, data.receivedId, data.gatepass);

            Alert.alert(
                "Success",
                "Outward added successfully",
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
        <OutwardForm onSubmit={handleSubmit} />
    );
}

export default AddNewOutward;