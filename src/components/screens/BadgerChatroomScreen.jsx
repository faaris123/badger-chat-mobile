import { StyleSheet, Text, View, FlatList, Modal, Pressable, TextInput, Alert } from "react-native";
import { useState, useEffect } from "react";
import * as SecureStore from 'expo-secure-store';
import BadgerChatMessage from "../helper/BadgerChatMessage"

function BadgerChatroomScreen(props) {
    // state variables
    const [messages, setMessages] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [modalVisible, setModalVisible] = useState(false)

    // Copied this function from HW6
    const loadMessages = () => {
        fetch(`https://cs571api.cs.wisc.edu/rest/f24/hw9/messages?chatroom=${props.name}`, {
            method: "GET",
            headers: {
                "X-CS571-ID": "bid_847d09ed085dacaedc451fd225893d7a6d17095344e4ca85c2843d44093da7cb",
            }
        })
        .then(res => res.json()).then(json => {
            setMessages(json.messages)
            setIsLoading(false);
        })
    }

    useEffect(loadMessages, [props])

    // Also copied from HW6
    // setModalVisibile becomes false and the other state variables are made empty strings after a post has been made
    function post() {
        if (!title || !content) {
            Alert.alert("You must provide both a title and content!")
            return
        }

        fetch(`https://cs571api.cs.wisc.edu/rest/f24/hw9/messages?chatroom=${props.name}`, {
            method: "POST",
            credentials: "include",
            headers: {
                "X-CS571-ID": "bid_847d09ed085dacaedc451fd225893d7a6d17095344e4ca85c2843d44093da7cb",
                "Authorization": "Bearer " + SecureStore.getItem("JWT"),
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title: title,
                content: content
            }),           
        })
        .then(res => {
            if (res.status === 200) {
                Alert.alert("Successfully posted")
                setContent("")
                setTitle("")
                setModalVisible(false)
                loadMessages()
            }
        })
    }

    // Copied from HW6
    function deletePost(id) {
        fetch(`https://cs571api.cs.wisc.edu/rest/f24/hw9/messages?id=${id}`, {
            method: "DELETE",
            credentials: "include",
            headers: {
                "X-CS571-ID": "bid_847d09ed085dacaedc451fd225893d7a6d17095344e4ca85c2843d44093da7cb",
                "Authorization": "Bearer " + SecureStore.getItem("JWT"),
            },          
        })
        .then(res => {
            if (res.status === 200) {
                Alert.alert("Successfully deleted the post!")
                loadMessages()
            }
        })
    }

    // Got this snippet from ChatGPT in order to make the Create Post Button look the one in the demo
    // Will disable the post button and change the styling to be greyed out if any of these conditions are met 
    let isDisabled = content.length === 0 || title.length === 0

    // Got help from Office Hours for the FlatList 
    // Used this lecture code example for FlatList as well: https://snack.expo.dev/@ctnelson1997/flatlist
    // Used this source to help with the Modal design: https://reactnative.dev/docs/modal
    // Used the guest state variable to determine if the user is the owner and should be able to delete posts or not 
    return <View style={{ flex: 1 }}>
        <FlatList
            data={messages}
            onRefresh={loadMessages}
            refreshing={isLoading}
            renderItem={(renderObj) => (
                <View>
                    <BadgerChatMessage
                        {...renderObj.item}
                        owner={SecureStore.getItem("username") === renderObj.item.poster}
                        deletePost={deletePost}
                    ></BadgerChatMessage>
                </View>
            )}
        ></FlatList>
        {props.isGuest === false && <View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Create A Post</Text>
                        <Text style={styles.modalText}>Title</Text>
                        <TextInput style={styles.title} onChangeText={setTitle} value={title}/>
                        <Text style={styles.modalText}>Content</Text>
                        <TextInput style={styles.content} onChangeText={setContent} value={content}/>
                        
                        <Pressable style={[styles.button, isDisabled ? styles.buttonDisabled : styles.buttonOpen]} disabled={isDisabled} onPress={post}>
                            <Text style={styles.textStyle}>Create Post</Text>
                        </Pressable>
                        
                        <Pressable style={[styles.button, styles.buttonClose]} onPress={() => setModalVisible(!modalVisible)}>
                            <Text style={styles.textStyle}>Cancel</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
            <Pressable style={[styles.button, styles.buttonOpen]} onPress={() => setModalVisible(true)}>
                <Text style={styles.textStyle}>Add Post</Text>
            </Pressable>
        </View>}
    </View>
}

// Copied styling from source listed above and included extra one for the greyed out button
const styles = StyleSheet.create({
    title: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        width: 200
    },
    content: {
        height: 100,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        width: 200
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonDisabled: {
        backgroundColor: "#ccc",
    },
    buttonOpen: {
        backgroundColor: 'crimson',
    },
    buttonClose: {
        backgroundColor: 'grey',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
});
  

export default BadgerChatroomScreen;
