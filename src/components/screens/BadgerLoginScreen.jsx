import { Alert, Button, StyleSheet, Text, View, TextInput } from "react-native";
import { useState } from "react";

function BadgerLoginScreen(props) {
    // state variables
    const [username, setUsername] = useState("")
    const [pin, setPin] = useState("")

    // Used this source for the TextInputs: https://reactnative.dev/docs/textinput
    // Used logic from HW6
    // Added guest button which sets the guest state variable to true 
    return <View style={styles.container}>
        <Text style={{ fontSize: 36 }}>BadgerChat Login</Text>
        <Text>Username</Text>
        <TextInput style={styles.input} onChangeText={setUsername} value={username} autoCapitalize="none"/>
        <Text>PIN</Text>
        <TextInput style={styles.input} onChangeText={setPin} value={pin} autoCapitalize="none" keyboardType="number-pad" maxLength="7" secureTextEntry/>
        <Button color="crimson" title="Login" onPress={() => {
            if (!username || !pin) {
                Alert.alert("You must provide both a username and pin!")
                return
            }
            props.handleLogin(username, pin)
        }} />
        <Button color="grey" title="Signup" onPress={() => props.setIsRegistering(true)} />
        <Button color="grey" title="Continue As Guest" onPress={() => props.setIsGuest(true)}/>
    </View>;
}

const styles = StyleSheet.create({
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default BadgerLoginScreen;