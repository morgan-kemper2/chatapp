import 'react-native-gesture-handler';
import React, { Component } from 'react';
import Start from './components/start';
import Chat from './components/chat';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


const Stack = createStackNavigator();

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator
        initialRouteName="Start"
        >
          <Stack.Screen
          name="Start"
          component={Start}
          />
          <Stack.Screen
          name="Chat"
          component={Chat}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}



