import { Pressable, Text } from "react-native";
import BadgerCard from "./BadgerCard"

function BadgerChatMessage(props) {

    const dt = new Date(props.created);

    // Added Pressable Text to delete posts if the user is the owner
    // Copied from HW6
    return <BadgerCard style={{ marginTop: 16, padding: 8, marginLeft: 8, marginRight: 8 }}>
        <Text style={{fontSize: 28, fontWeight: 600}}>{props.title}</Text>
        <Text style={{fontSize: 12}}>by {props.poster} | Posted on {dt.toLocaleDateString()} at {dt.toLocaleTimeString()}</Text>
        <Text></Text>
        <Text>{props.content}</Text>
        
        {props.owner && 
            <Pressable style={{backgroundColor: "red"}} onPress={() => props.deletePost(props.id)}>
                <Text style={{color: "white"}}>Delete</Text>
            </Pressable>
        }
    </BadgerCard>
}

export default BadgerChatMessage;
