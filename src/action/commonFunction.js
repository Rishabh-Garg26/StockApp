import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import Papa from "papaparse";
import { openDatabase } from "expo-sqlite/legacy";
import moment from "moment";
import { Alert } from "react-native";
// const db = openDatabase("db");
const db = openDatabase("db");

export const pickDocument = async (setIsLoading) => {
  try {
    // Pick a CSV file
    setIsLoading(true); // Start loading
    let result = await DocumentPicker.getDocumentAsync({
      type: "text/csv", // Limit file type to CSV
      copyToCacheDirectory: true,
    });
    if (result.assets) {
      // Read the file content
      const fileUri = result.assets[0].uri;
      const fileContent = await FileSystem.readAsStringAsync(fileUri);

      // Parse the CSV content
      Papa.parse(fileContent, {
        header: true, // Adjust according to whether you have headers
        complete: (results) => {
          db.transaction((tx) => {
            results.data.forEach((element) => {
              tx.executeSql(
                "insert into Inward (receivedDate, paymentDate,location,lotnumber,item,quantity,unit,marka,balance, imageExist, imageName) values (?,?,?,?,?,?,?,?,?,?,?);",
                [
                  element.receivedDate
                    ? moment.utc(element.receivedDate, "DD/MM/YYYY").valueOf()
                    : null,
                  element.paymentDate
                    ? moment.utc(element.paymentDate, "DD/MM/YYYY").valueOf()
                    : null,
                  element.location,
                  element.lotnumber?.toString(),
                  element.item,
                  element.quantity,
                  element.unit,
                  element.marka,
                  element.quantity,
                  element.false,
                  [],
                ],
                () => {},
                (err) => {
                  console.log(err);
                }
              );
            });
          });

          Alert.alert("Success", "Data has been uploaded successfully", [
            {
              text: "Okay",
              style: "cancel",
            },
          ]);
        },
        error: (error) => {
          Alert.alert("OOPs!! Something went wrong", error, [
            {
              text: "Okay",
              style: "cancel",
            },
          ]);
        },
      });
    }
  } catch (error) {
    console.error("Error picking document:", error);
  } finally {
    setIsLoading(false); // Stop loading
  }
};
