import React, {Component} from 'react';
import { View, TextInput, Button, Text, ImageBackground, StyleSheet, ScrollView } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

const image = require('../assets/Background_Image.png')

// creates your main page 
export default class Start extends React.Component {

  constructor(props) {
    super(props);
    this.state={text:"", color:""};
  }

  render() {
    return (
      <ImageBackground source={image} style={{flex:1}}>
        {/* scollview allows you to scroll vs standard view */}
      <ScrollView>
        <View style={{alignSelf:'center'}}>
          <Text style={{fontWeight:'bold', fontSize:60, color:'green'}}>Chat</Text>
        </View>
        <TextInput
        style={{height:40, borderColor: "blue", borderWidth: 1, margin:10}}
        onChangeText={(text)=>this.setState({text})}
        value={this.state.text}
        placeholder="Type here"
        />
        <Text style={{fontWeight:'bold', marginBottom: 70, alignSelf:'center'}}>Type Your Name Here</Text>
        <Text style={{marginBottom: 50, alignSelf:'center', fontWeight: 'bold', fontSize: 16}}>Choose a Background Color for your Chat</Text>
        <View style={{flex:1, flexDirection:'row', alignSelf: 'center'}}>
          {/* touchable opacity allows for selection when not using a button */}
        <TouchableOpacity
          accessible={true}
          accessibilityLabel='green'
          accessibilityHint='lets you change the chat background to green'
          style={styles.box1}
          onPress={()=>{this.setState({color:'green'})}}>
        </TouchableOpacity>
        <TouchableOpacity 
          accessible={true}
          accessibilityLabel='purple'
          accessibilityHint='lets you change the chat background to purple'
          style={styles.box2}
          onPress={()=>{this.setState({color:'purple'})}}></TouchableOpacity>
        <TouchableOpacity
          accessible={true}
          accessibilityLabel='yellow'
          accessibilityHint='lets you change the chat background to yellow'
          style={styles.box3}
          onPress={()=>{this.setState({color:'yellow'})}}></TouchableOpacity>
        <TouchableOpacity 
          accessible={true}
          accessibilityLabel='teal'
          accessibilityHint='lets you change the chat background to teal'
          style={styles.box4}
          onPress={()=>{this.setState({color:'teal'})}}></TouchableOpacity>
        </View>
        <View style={styles.button}>
        <Button 
          color='black'
          title="Go to Chat"
          onPress={() => this.props.navigation.navigate('Chat', {name: this.state.text, color: this.state.color})}
        />
        </View>
      </ScrollView>
      </ImageBackground>
    )
  }
}

const styles = StyleSheet.create({
  box1: {
    width: 60,
    height: 60,
    backgroundColor: 'green',
    padding: 10,
    margin: 5,
    borderRadius: 30
  },
  box2: {
    height: 60,
    width: 60,
    backgroundColor: 'purple',
    padding: 10,
    margin: 5,
    borderRadius: 30
  },
  box3: {
    height: 60,
    width: 60,
    backgroundColor: 'yellow',
    padding: 10,
    margin: 5,
    borderRadius: 30
  },
  box4: {
    height: 60,
    width: 60,
    backgroundColor: 'teal',
    padding: 10,
    margin: 5,
    borderRadius: 30
  },
  button: {
    height: 60,
    borderColor: 'green',
    borderWidth: 1,
    alignSelf: 'center', 
    paddingTop: 5,
    marginTop: 150,
    backgroundColor: 'green',
  }
})