import React from 'react';
import { View, Platform, KeyboardAvoidingView, } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from '@react-native-community/async-storage';



const firebase = require('firebase');
require('firebase/firestore');

//create screen 2 chat screen
export default class Chat extends React.Component {
  constructor() {
    super();

    if(!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: "AIzaSyBilLnaFHgvjwksk3IU-dnucO9_YO1aQIA",
        authDomain: "chat-app-c3861.firebaseapp.com",
        projectId: "chat-app-c3861",
        storageBucket: "chat-app-c3861.appspot.com",
        messagingSenderId: "429300359538",
        appId: "1:429300359538:web:d51de51b931e1fdde6bdeb",
        measurementId: "G-EV3T988YLK"
      });
    }

    this.referenceChatMessages = firebase.firestore().collection('messages');

    this.state= {
      messages: [],
    };
  };

  getMessages = async () => {
    let messages = "";
    try {
      messages = (await AsyncStorage.getItem("messages")) || [];
      this.setState({
        messages: JSON.parse(messages),
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  saveMessages = async () => {
    try {
      await AsyncStorage.setItem(
        "messages",
        JSON.stringify(this.state.messages)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  deleteMessages = async () => {
    try {
      await AsyncStorage.removeItem("messages");
    } catch (error) {
      console.log(error.message);
    }
  };

  componentDidMount() {
    let { name }  = this.props.route.params;
    this.props.navigation.setOptions({ title: name });


  NetInfo.fetch().then((state) => {
    const isConnected = state.isConnected;
    if (isConnected) {
      this.setState({
        isConnected: true,
      });
      console.log('online');

      this.authUnsubscribe = firebase
        .auth()
        .onAuthStateChanged(async (user) => {
          if (!user) {
            await firebase.auth().signInAnonymously();
          }

          this.setState({
            uid: user.uid,
            messages: [],
          });

          this.unsubscribe = this.referenceChatMessages
            .orderBy("createdAt", "desc")
            .onSnapshot(this.onCollectionUpdate);
        });
    } else {
      this.setState({
        isConnected: false,
      });
      this.getMessages();
    }
    console.log('offline');
  });
}

   

    onCollectionUpdate = (querySnapshot) => {
      const messages = [];
      querySnapshot.forEach((doc) => {
        var data = doc.data(); 
        messages.push({
          _id:data._id,
          text: data.text || "",
          createdAt: data.createdAt.toDate(),
          user: data.user,
        });
      });
      this.setState({
        messages,
      });
    };



    // this.setState({
    //   messages: [
    //     {
    //       _id:1,
    //       text:'Welcome to the Chat',
    //       createdAt: new Date(),
    //       user: {
    //         _id: 2,
    //         name: 'React Native',
    //         avatar: 'https://placeimg.com/140/140/any',
    //       },
    //     },
    //     {
    //       _id:2,
    //       text: name + ' has entered the chat', 
    //       // static message can be anything
    //       createdAt: new Date(),
    //       system: true,
    //     },
    //   ]
    // })


  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
}

addMessage() {
  const message=this.state.messages[0];
  this.referenceChatMessages.add({
    _id:message._id,
    text:message.text,
    createdAt:message.createdAt,
    user:message.user
  });
}

onSend(messages=[]) {
  this.setState(
    (previousState)=>({
      messages:GiftedChat.append(previousState.messages, messages),
    }),
  ()=>{
    this.addMessage();
    this.saveMessages();
    }
  );
}

renderInputToolbar = (props) => {
  if (props.isConnected === false) {
  } else {
    return <InputToolbar {...props} />;
  }
};

// changes the color of your speech bubble
renderBubble(props) {
  return (
    <Bubble
    {...props}
    wrapperStyle={{
      right: {
        backgroundColor:'#000'
      },
    }}
    />
  );
}

  render() {
    let {color} = this.props.route.params;


    return (
      <View style={{flex:1, backgroundColor: color}}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          renderInputToolbar={this.renderInputToolbar}
          onSend={messages=>this.onSend(messages)}
          user={{
            _id:1,
          }}
          />  
          {/* keeps android keyboard from hiding your text */}
          { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}    
        </View>
    );
  };
}

