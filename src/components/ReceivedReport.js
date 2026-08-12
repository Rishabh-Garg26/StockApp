import { useEffect } from "react";
import { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Dropdown } from "react-native-element-dropdown";
import { Icon } from "@rneui/themed";
import { 
  Card, YStack, XStack, Button, Text, H2, Paragraph, Spinner, View, Label, Switch 
} from 'tamagui';
import Transaction from "../services/transaction";
import ReceivedReportPdf from "./ReceivedReportPdf";
import moment from "moment";

const ReceivedReport = () => {
  const [isFocusOrder, setIsFocusOrder] = useState(false);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [showFromDate, setShowFromDate] = useState(false);
  const [showToDate, setShowToDate] = useState(false);
  const maxDate = new Date();
  const [groupBy, setGroupBy] = useState(false);
  const [orderby, setOrderby] = useState("id");
  const [loader, setLoader] = useState(false);

  const getReceivedReportPdf = async () => {
    try {
      const res = await Transaction.getInwardReport(
        moment.utc(fromDate).valueOf(),
        moment.utc(toDate).valueOf(),
        groupBy,
        orderby
      );
      setLoader(true);
      if (res.length === 0) {
        Alert.alert(
          "No data found",
          "There is no data for the dates you selected",
          [
            {
              text: "Okay",
              style: "cancel",
            },
          ]
        );
        setLoader(false);
      } else {
        await ReceivedReportPdf(res, fromDate, toDate);
        setLoader(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    var today = new Date();
    var todayDate = "04-01-" + today.getFullYear();

    if (today.getMonth() + 1 <= 3) {
      todayDate = "04-01-" + (today.getFullYear() - 1);
      setFromDate(moment(todayDate, "MM-DD-YYYY").toDate());
    } else {
      setFromDate(moment(todayDate, "MM-DD-YYYY").toDate());
    }
  }, []);

  const onChangeToDate = (e, date) => {
    if (Platform.OS === "android") {
      setShowToDate(false);
    }
    const to = moment(date, "DD/MM/YYYY").toDate();
    const from = new Date(fromDate);
    if (fromDate !== "" && from.getTime() > to.getTime()) {
      setToDate(fromDate);
    } else {
      setToDate(moment(date, "DD/MM/YYYY").toDate());
    }
  };

  const onChangeFromDate = (e, date) => {
    if (Platform.OS === "android") {
      setShowFromDate(false);
    }
    const to = new Date(toDate);
    const from = moment(date, "DD/MM/YYYY").toDate();
    if (toDate !== "" && from.getTime() > to.getTime()) {
      setFromDate(toDate);
    } else {
      setFromDate(moment(date, "DD/MM/YYYY").toDate());
    }
  };

  return (
    <ScrollView 
      style={{ flex: 1, backgroundColor: '#f5f5f5' }}
      contentContainerStyle={{ paddingBottom: 50 }}
      showsVerticalScrollIndicator={false}
    >
      <YStack p="$4" space="$4" paddingTop="$6">
        {/* Header */}
        <Card elevate size="$4" padding="$5" borderRadius="$5" marginTop="$2">
          <YStack space="$5" alignItems="center">
            <Icon name="assessment" size={40} color="$blue10" />
            <H2 fontWeight="800" fontSize="$10" padding="$2" color="$color" textAlign="center">
              Received Report
            </H2>
            <Paragraph textAlign="center" fontSize="$4" color="$color11">
              Generate and download received items report for selected date range.
            </Paragraph>
          </YStack>
        </Card>

        {/* Date Selection */}
        <Card elevate size="$4" padding="$5" borderRadius="$5">
          <YStack space="$4">
            <H2 fontWeight="700" fontSize="$6" color="$color" textAlign="center" marginBottom="$2">
              Select Date Range
            </H2>

            {/* From Date */}
            <Label fontWeight="700" fontSize="$4" color="$color">Date From</Label>
            <Card elevate size="$2" padding="$3" borderRadius="$3" backgroundColor="white">
              <Button
                backgroundColor="transparent"
                color="$blue10"
                onPress={() => setShowFromDate(true)}
                icon={<Icon name="event" size={20} color="$blue10" />}
                borderRadius="$3"
                height={44}
                justifyContent="flex-start"
                pressStyle={{ backgroundColor: '$blue5' }}
              >
                <Text color="$blue10" fontSize="$4" fontWeight="600">
                  {moment(fromDate).format("DD-MM-YYYY")}
                </Text>
              </Button>
            </Card>
            {showFromDate && (
              <DateTimePicker
                testID="dateTimePicker"
                value={fromDate}
                maximumDate={toDate}
                display={Platform.OS === "android" ? "default" : "spinner"}
                mode="date"
                onChange={onChangeFromDate}
                style={{ marginBottom: 10 }}
              />
            )}
            {showFromDate && Platform.OS === "ios" && (
              <XStack justifyContent="center" space="$3">
                <Button
                  size="$3"
                  backgroundColor="$blue10"
                  color="white"
                  onPress={() => setShowFromDate(false)}
                  borderRadius="$3"
                  pressStyle={{ backgroundColor: '$blue11' }}
                >
                  <Text color="white" fontSize="$3" fontWeight="600">Confirm</Text>
                </Button>
              </XStack>
            )}

            {/* To Date */}
            <Label fontWeight="700" fontSize="$4" color="$color">Date To</Label>
            <Card elevate size="$2" padding="$3" borderRadius="$3" backgroundColor="white">
              <Button
                backgroundColor="transparent"
                color="$blue10"
                onPress={() => setShowToDate(true)}
                icon={<Icon name="event" size={20} color="$blue10" />}
                borderRadius="$3"
                height={44}
                justifyContent="flex-start"
                pressStyle={{ backgroundColor: '$blue5' }}
              >
                <Text color="$blue10" fontSize="$4" fontWeight="600">
                  {moment(toDate).format("DD-MM-YYYY")}
                </Text>
              </Button>
            </Card>
            {showToDate && (
              <DateTimePicker
                testID="dateTimePicker"
                value={toDate}
                maximumDate={maxDate}
                minimumDate={fromDate}
                mode="date"
                display={Platform.OS === "android" ? "default" : "spinner"}
                onChange={onChangeToDate}
                style={{ marginBottom: 10 }}
              />
            )}
            {showToDate && Platform.OS === "ios" && (
              <XStack justifyContent="center" space="$3">
                <Button
                  size="$3"
                  backgroundColor="$blue10"
                  color="white"
                  onPress={() => setShowToDate(false)}
                  borderRadius="$3"
                  pressStyle={{ backgroundColor: '$blue11' }}
                >
                  <Text color="white" fontSize="$3" fontWeight="600">Confirm</Text>
                </Button>
              </XStack>
            )}
          </YStack>
        </Card>

        {/* Options */}
        <Card elevate size="$4" padding="$5" borderRadius="$5">
          <YStack space="$4">
            <H2 fontWeight="700" fontSize="$6" color="$color" textAlign="center" marginBottom="$2">
              Report Options
            </H2>

            {/* Group By Switch */}
            <XStack alignItems="center" space="$3" padding="$3" backgroundColor="$gray5" borderRadius="$3">
              <Switch
                id="groupBy"
                checked={groupBy}
                onCheckedChange={(checked) => {
                  setGroupBy(checked);
                }}
                size="$4"
                backgroundColor="$gray8"
                borderColor="$gray10"
              >
                <Switch.Thumb animation="quick" />
              </Switch>
              <Label htmlFor="groupBy" fontWeight="600" fontSize="$4" color="$color" flex={1}>
                Group by Item
              </Label>
            </XStack>

            {/* Order By Dropdown */}
            <Label fontWeight="700" fontSize="$4" color="$color">Order By</Label>
            <Card elevate size="$2" padding="$3" borderRadius="$3" backgroundColor="white">
              <Dropdown
                style={{
                  height: 44,
                  borderWidth: 0,
                  borderRadius: 8,
                  paddingHorizontal: 8,
                }}
                placeholderStyle={{
                  fontSize: 16,
                  color: '#666',
                }}
                selectedTextStyle={{
                  fontSize: 16,
                  color: '#333',
                  fontWeight: '600',
                }}
                inputSearchStyle={{
                  height: 40,
                  fontSize: 16,
                }}
                data={[
                  { label: "As Entered", value: "id" },
                  { label: "Lotwise", value: "lotnumber" },
                  { label: "DateWise", value: "receivedDate" },
                ]}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder="Select Order"
                searchPlaceholder="Search..."
                value={orderby}
                itemTextStyle={{ textTransform: "capitalize" }}
                onFocus={() => setIsFocusOrder(true)}
                onBlur={() => setIsFocusOrder(false)}
                onChange={(item) => {
                  setOrderby(item.value);
                  setIsFocusOrder(false);
                }}
              />
            </Card>
          </YStack>
        </Card>

        {/* Download Button */}
        <Card elevate size="$3" padding="$3" borderRadius="$4" backgroundColor="$green10" marginTop="$4">
          <Button
            size="$6"
            backgroundColor="transparent"
            color="white"
            onPress={getReceivedReportPdf}
            borderRadius="$4"
            icon={<Icon name="download" size={24} color="white" />}
            disabled={loader}
            pressStyle={{ backgroundColor: '$green11' }}
          >
            {loader ? (
              <Spinner color="white" />
            ) : (
              <Text color="white" fontSize="$5" fontWeight="700">
                Download Report
              </Text>
            )}
          </Button>
        </Card>
      </YStack>
    </ScrollView>
  );
};

export default ReceivedReport;
