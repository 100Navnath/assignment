import React from 'react'
import { View, Text } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';


import Home from './screens/Home';
import LeagueDetails from './screens/LeagueDetails';
import PlayerDetails from './screens/PlayerDetails';
const Stack = createStackNavigator();
function TotTabNavigation() {

}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="LeagueDetails" component={LeagueDetails} />
        <Stack.Screen name="PlayerDetails" component={PlayerDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
