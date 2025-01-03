import { Alert, Button, StyleSheet, Text, View, TextInput } from "react-native";
import { useState } from "react";

function BadgerRegisterScreen(props) {
    // state variables
    const [username, setUsername] = useState("")
    const [pin, setPin] = useState("")
    const [confirmPin, setConfirmPin] = useState("")

    // Used this source for the TextInputs: https://reactnative.dev/docs/textinput
    // Used logic from HW6
    return <View style={styles.container}>
        <Text style={{ fontSize: 36 }}>Join BadgerChat!</Text>
        <Text>Username</Text>
        <TextInput style={styles.input} onChangeText={setUsername} value={username} autoCapitalize="none"/>
        <Text>Password</Text>
        <TextInput style={styles.input} onChangeText={setPin} value={pin} autoCapitalize="none" keyboardType="number-pad" maxLength="7" secureTextEntry/>
        <Text>Confirm PIN</Text>
        <TextInput style={styles.input} onChangeText={setConfirmPin} value={confirmPin} autoCapitalize="none" keyboardType="number-pad" maxLength="7" secureTextEntry/>
        <Button color="crimson" title="Signup" onPress={() => {
            if (!pin || !confirmPin) {
                Alert.alert("Please enter a pin")
                return
            }
            if (pin !== confirmPin) {
                Alert.alert("Pins do not match")
                return
            }
            if (pin.length !== 7 || confirmPin.length !== 7) {
                Alert.alert("A pin must be 7 digits")
                return
            }
            props.handleSignup(username, pin)
        }} />
        <Button color="grey" title="Nevermind!" onPress={() => props.setIsRegistering(false)} />
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

export default BadgerRegisterScreen;