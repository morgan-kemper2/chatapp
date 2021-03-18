import React, { Component } from 'react';
import { View, Platform, KeyboardAvoidingView, Button, StyleSheet, } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from '@react-native-community/async-storage';
import MapView from 'react-native-maps';
import CustomActions from './CustomActions';


const firebase = require('firebase');
require('firebase/firestore');

//create screen 2 chat screen
export default class Chat extends React.Component {
  constructor() {
    super();

    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: "AIzaSyBilLnaFHgvjwksk3IU-dnucO9_YO1aQIA",
        authDomain: "chat-app-c3861.firebaseapp.com",
        projectId: "chat-app-c3861",
        storageBucket: "chat-app-c3861.appspot.com",
        messagingSenderId: "429300359538",
        appId: "1:429300359538:web:d51de51b931e1fdde6bdeb",
        measurementId: "G-EV3T988YLK",
      });
    }

    this.referenceChatMessages = firebase.firestore().collection('messages');

    this.state = {
      messages: [],
      image: null,
      uid: 0,
      isConnected: false,
      location: null
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
    let { name } = this.props.route.params;
    this.props.navigation.setOptions({ title: name });



    NetInfo.fetch().then((state) => {
      const isConnected = state.isConnected;
      if (isConnected) {
        this.setState({
          isConnected: true,
        });

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
    });
  }

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    querySnapshot.forEach((doc) => {
      var data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text || "",
        createdAt: data.createdAt.toDate(),
        user: data.user,
        image: data.image || null,
        location: data.location || null
      });
    });
    this.setState({
      messages,
    });
  };

  addMessage() {
    const message = this.state.messages[0];
    this.referenceChatMessages.add({
      _id: message._id,
      text: message.text || "",
      createdAt: message.createdAt,
      user: message.user,
      image: message.image || null,
      location: message.location || null
    });
  }

  onSend(messages = []) {
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
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
            backgroundColor: '#000'
          },
        }}
      />
    );
  }

      renderCustomActions = (props) => {
        return <CustomActions {...props} />;
      };

      renderCustomView (props) {
        const { currentMessage} = props;
        if (currentMessage.location) {
          return (
              <MapView
                style={{width: 150,
                  height: 100,
                  borderRadius: 13,
                  margin: 3}}
                region={{
                  latitude: currentMessage.location.latitude,
                  longitude: currentMessage.location.longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
              />
          );
        }
        return null;
      }

  render() {
    let { color } = this.props.route.params;

    return (
      <View style={{ flex: 1, backgroundColor: color }}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          renderInputToolbar={this.renderInputToolbar}
          onSend={messages => this.onSend(messages)}
          renderActions={this.renderCustomActions}
          renderCustomView={this.renderCustomView}
          user={{
            _id: this.state.uid,
          }}
        />
        {/* keeps android keyboard from hiding your text */}
        { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}

      </View>

    );
  };
}

const styles = StyleSheet.create({});


