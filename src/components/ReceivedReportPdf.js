import moment from "moment";
import * as Sharing from "expo-sharing";
import * as Print from "expo-print";
import { Platform } from "react-native";

const ReceivedReportPdf = async (props, fromDate, toDate) => {
  const row = props;

  var total = 0;
  var totalBalance = 0;

  var table = `</br></br>
    <table style="width:100%" > 
    <tr align= "left">
        <th>DATE</th> 
        <th>ITEM</th> 
        <th>LOTNO</th> 
        <th>RECEIPT</th> 
        <th>UNIT</th> 
        <th>BALANCE</th> 
        <th>MARKA</th>
        <th>LOCATION</th>
    </tr>`;

  row.forEach((item) => {
    table += `<tr align= "left">
        <td>${moment(item.receivedDate).format("DD/MM/YYYY")}</td>
        <td>${item.item}</td>
        <td>${item.lotnumber}</td>
        <td>${item.quantity}</td>
        <td>${item.unit}</td>
        <td>${item.balance}</td>
        <td>${item.marka}</td>
        <td>${item.location}</td>

         </tr>`;

    total += +item.quantity;
    totalBalance += +item.balance;
  });
  table += `
    <tr align= "left" style="margin-top:: 20px; font-weight: bold; outline: thin solid">
        <td></td>
        <td>TOTAL:</td>
        <td></td>
        <td>${total}</td>
        <td></td>
        <td>${totalBalance}</td>
        <td></td>
        <td></td
     </tr>
    
    </table>
    
    `;

  const htmlContent = `<html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
    </head>
    <style> 
        @page { margin: 20px; } 
    </style>
    <body style="text-align: center;">
      <h1 style="font-size: 50px; font-family: Helvetica Neue; font-weight: normal;">
        Inward Report
      </h1>
      <h3 style="font-size: 30px; font-family: Helvetica Neue; font-weight: normal;">
      From Date: ${moment(fromDate).format(
        "DD/MM/YYYY"
      )} &emsp;&emsp; To Date: ${moment(toDate).format("DD/MM/YYYY")}
    </h3>
      ${table}
    </body>
  </html>`;

  const createAndSavePDF = async (html) => {
    try {
      const { uri } = await Print.printToFileAsync({ html });
      if (Platform.OS === "ios") {
        await Sharing.shareAsync(uri);
      } else {
        const permission = await MediaLibrary.requestPermissionsAsync();

        if (permission.granted) {
          await MediaLibrary.createAssetAsync(uri);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  try {
    await createAndSavePDF(htmlContent);
  } catch (error) {
    // console.log(error)
  }
};

export default ReceivedReportPdf;
