import { Text, View, StyleSheet, Pressable } from "react-native";
import { Dimensions, TouchableOpacity } from 'react-native'
import { Icon } from '@rneui/themed';
import { Divider, IconButton, List } from "react-native-paper";
const DeviceWidth = Dimensions.get('window').width
const DeviceHeight = Dimensions.get('window').height
const HomeScreen = ({ navigation }) => {






    return (
        <View style={{ height: DeviceHeight, backgroundColor: 'white' }}>
            {/* <Pressable onPress={() => { navigation.navigate('Company'); }}>
                <View style={styles.top_container}>

                </View>

                <View style={{ flexDirection: 'row' }}>
                    <IconButton
                        icon="home"
                        iconColor={'purple'}
                        size={40}
                        onPress={() => console.log('Pressed')}
                    />
                    <Text style={{ fontSize: 40, marginTop: 10 }}>Company</Text>
                </View>
            </Pressable>
            <Divider /> */}


            <Pressable onPress={() => { navigation.navigate('Inwards'); }}>
                <View style={styles.top_container}></View>
                <View style={{ flexDirection: 'row' }}>
                    <IconButton
                        icon="arrow-bottom-left"
                        iconColor={'purple'}
                        size={40}
                    />
                    <Text style={{ fontSize: 40, marginTop: 10 }}>Inwards</Text>
                </View>
                <Divider />
            </Pressable>

            <Pressable onPress={() => { navigation.navigate('Outwards'); }}>
                <View style={styles.top_container}></View>
                <View style={{ flexDirection: 'row' }}>
                    <IconButton
                        icon="arrow-top-right"
                        iconColor={'purple'}
                        size={40}
                    />
                    <Text style={{ fontSize: 40, marginTop: 10 }}>Outwards</Text>
                </View>
                <Divider />
            </Pressable>


            <Pressable onPress={() => { navigation.navigate('Stock Position'); }}>
                <View style={styles.top_container}></View>
                <View style={{ flexDirection: 'row' }}>
                    <IconButton
                        icon="book-open-variant"
                        iconColor={'purple'}
                        size={40}
                    />
                    <Text style={{ fontSize: 40, marginTop: 10 }}>Stock Position</Text>
                </View>
                <Divider />
            </Pressable>


            <Pressable onPress={() => { navigation.navigate('Backup & Restore'); }}>
                <View style={styles.top_container}></View>
                <View style={{ flexDirection: 'row' }}>
                    <IconButton
                        icon="cloud-upload"
                        iconColor={'purple'}
                        size={40}
                    />
                    <Text style={{ fontSize: 40, marginTop: 10 }}>Backup & Restore</Text>
                </View>
                <Divider />
            </Pressable>


        </View>
    );


}

export default HomeScreen;

const styles = StyleSheet.create({
    top_container: {
        paddingTop: 10,
    },
    flexrow_container: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    cell: {
        backgroundColor: "#ebedf0",
        height: DeviceWidth * 0.3,
        width: DeviceWidth * 0.3,
        margin: 5,
        flexGrow: 1,
        alignContent: 'center',
        alignItems: 'center',
    },
    text: {
        alignContent: 'center',
    },
    icon: {
        marginTop: 20,

    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    buttonClose: {
        backgroundColor: "blue",
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
});