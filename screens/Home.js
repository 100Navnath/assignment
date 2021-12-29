import React from 'react'
import { View, Text } from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Leagues from './Leagues'
import Players from './Players'
import Favorite from './Favorite'
const Tab = createMaterialTopTabNavigator();

export default function home() {
    return (
        <Tab.Navigator
            initialRouteName="Leagues"
            screenOptions={{
                tabBarActiveTintColor: '#e91e63',
                tabBarLabelStyle: { fontSize: 12, color: "#000" },
                tabBarStyle: { backgroundColor: 'powderblue' },
            }}
        >
            <Tab.Screen
                name="Leagues"
                component={Leagues}
                options={{ tabBarLabel: 'Leagues' }}
            />
            <Tab.Screen
                name="Players"
                component={Players}
                options={{ tabBarLabel: 'Players' }}
            />
            <Tab.Screen
                name="Favorite"
                component={Favorite}
                options={{ tabBarLabel: 'Favorite' }}
            />
        </Tab.Navigator>
    )
}
