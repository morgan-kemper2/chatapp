import React from 'react';
import { View, Platform, KeyboardAvoidingView, } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';

//create screen 2 chat screen
export default class Chat extends React.Component {
  constructor() {
    super();
    this.state= {
      messages: [],
    }
  }

  componentDidMount(){
    let { name }  = this.props.route.params;

    this.setState({
      messages: [
        {
          _id:1,
          text:'Welcome to the Chat',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
        {
          _id:2,
          text: name + ' has entered the chat', 
          // static message can be anything
          createdAt: new Date(),
          system: true,
        },
      ]
    })
      // pulls the name you typed from the first page
      this.props.navigation.setOptions({ title: name });
}

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
}

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