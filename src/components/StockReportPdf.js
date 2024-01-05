import moment from 'moment';
import * as Sharing from 'expo-sharing'
import * as Print from 'expo-print';


async function StockReportPdf(props, toDate) {

    const row = props;

    // console.log(row);

    var table = `</br></br>
    <table style="width:100%" > 
    <tr align= "left">
    <th>LOCATION</th> 
        <th>R.DATE</th> 
        <th>ITEM</th> 
        <th>LOTNO</th> 
        <th>RECVD</th> 
        <th>UNIT</th> 
        <th>MARKA</th>
        <th>G.P.No</th>
        <th>G.P.DATE</th>
        <th>ISSUED</th>
        <th>BALANCE</th>

    </tr>`;


    var lotnumber = '';
    row.forEach(item => {
        if (lotnumber === '') {
            table += `<tr align= "left">
            <td>${item.location}</td>
            <td>${moment(item.receivedDate).format("DD/MM/YYYY")}</td>
            <td>${item.item}</td>
            <td>${item.lotnumber}</td>
            <td>${item.quantity}</td>
            <td>${item.unit}</td>
            <td>${item.marka}</td>`
            lotnumber = item.lotnumber


        }
        else if (lotnumber !== item.lotnumber) {
            table += `<tr align= "left">
            <td>${item.location}</td>
            <td>${moment(item.receivedDate).format("DD/MM/YYYY")}</td>
            <td>${item.item}</td>
            <td>${item.lotnumber}</td>
            <td>${item.quantity}</td>
            <td>${item.unit}</td>
            <td>${item.marka}</td>`
        }
        else {
            table += `<tr align= "left">
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>`
        }





        table += `<td>${item.gatepass ? item.gatepass : ''}</td>
                    <td>${item.gatePassDate ? moment(item.gatePassDate).format("DD/MM/YYYY") : ''}</td>
                    <td>${item.issued ? item.issued : ''}</td>
                    <td>${item.balance ? item.balance : ''}</td>
                 </tr>`;
        lotnumber = item.lotnumber;
    });


    const htmlContent = `<html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
    </head>
    <style> 
        @page { margin: 20px; } 
    </style>
    <body style="text-align: center;">
      <h1 style="font-size: 50px; font-family: Helvetica Neue; font-weight: normal;">
        Stock Position
      </h1>
      <h3 style="font-size: 30px; font-family: Helvetica Neue; font-weight: normal;">
        To Date: ${moment(toDate).format("DD/MM/YYYY")}
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



}

export default StockReportPdf;