import { Alert, Button, StyleSheet, Text, View } from "react-native";
import * as SecureStore from 'expo-secure-store';

function BadgerLogoutScreen(props) {
    // Delete the items stored in SecureStore
    // Then set the state variables to false
    // setIsRegistering is included in case someone started a guest session and then decided to signup
    return <View style={styles.container}>
        <Text style={{fontSize: 24, marginTop: -100}}>Are you sure you're done?</Text>
        <Text>Come back soon!</Text>
        <Text/>
        <Button title="Logout" color="darkred" onPress={async () => {
            try {
                await SecureStore.deleteItemAsync("JWT");
                await SecureStore.deleteItemAsync("username");
                props.setIsLoggedIn(false)
                props.setIsRegistering(false)
                Alert.alert("You have been logged out!");
            }
            catch(error) {
                console.log(error)
            }
        }}/>

    </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        height: 40,
        width: "50%",
        margin: 12,
        borderWidth: 1,
        padding: 10,
    }
});

export default BadgerLogoutScreen;