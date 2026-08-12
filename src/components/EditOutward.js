import React, { useEffect, useState } from "react";
import { Alert } from "react-native";
import OutwardForm from "./OutwardForm";
import Transaction from "../services/transaction";

const EditOutward = ({ route }) => {
    const { id } = route.params;
    const [initialValues, setInitialValues] = useState(null);

    useEffect(() => {
        getOutwardById();
    }, []);

    const getOutwardById = async () => {
        try {
            const item = await Transaction.getOutwardById(id);
            const balanceResult = await Transaction.getInwardById(item[0].receivedId);
            const initialData = {
                ...item[0],
                quantity: balanceResult[0].quantity,
                balance: balanceResult[0].balance
            }
            setInitialValues(initialData);
        } catch (error) {

        }
    }

    const handleSubmit = async (data) => {
        try {
            await Transaction.updateOutwards(data.receivedDate, data.gatePassDate, data.location, data.lotnumber, data.item, data.quantity, data.issued, data.unit, data.marka, data.balance, id, data.receivedId);

            Alert.alert(
                "Success",
                "Outward updated successfully",
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
        <OutwardForm initialValues={initialValues} onSubmit={handleSubmit} isEdit={true} />
    );
}

export default EditOutward;