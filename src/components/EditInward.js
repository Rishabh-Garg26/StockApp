import React, { useEffect, useState } from "react";
import { Alert } from "react-native";
import InwardForm from "./InwardForm";
import Transaction from "../services/transaction";

const EditInward = ({ route }) => {
    const { id } = route.params;
    const [initialValues, setInitialValues] = useState(null);

    useEffect(() => {
        getInwardById();
    }, []);

    const getInwardById = async () => {
        const result = await Transaction.getInwardById(id);
        setInitialValues(result[0]);
    }

    const handleSubmit = async (data) => {
        try {
            await Transaction.updateInward(data.receivedDate, data.paymentDate, data.location, data.lotnumber, data.item, data.quantity, data.unit, data.marka, data.balance, id, data.imageExist, data.imageName);

            Alert.alert(
                "Success",
                "Inward updated successfully",
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
        <InwardForm initialValues={initialValues} onSubmit={handleSubmit} isEdit={true} />
    );
}

export default EditInward;