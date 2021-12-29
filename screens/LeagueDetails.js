import React, { useState, useEffect } from 'react'
import { View, Text,StyleSheet } from 'react-native'

export default function LeagueDetails(props) {
    const [leagueDetails, setLeagueDetails] = useState(Object)
    const [isFav, setIsFav] = useState(false)
    useEffect(() => {
        props.navigation.addListener('focus', async () => {
            setLeagueDetails(props.route.params.item);
            setIsFav(props.route.params.isFav);
        })
    }, []);
    return (
        <View style={style.container}>
            <View style={{ flexDirection: "row",alignItems:"center",justifyContent:'center' }}>
                <Text style={style.title}>idLeague : </Text>
                <Text style={style.text}>{leagueDetails.idLeague}</Text>
            </View>
            <View style={{ flexDirection: "row",alignItems:"center",justifyContent:'center' }}>
                <Text style={style.title}>strLeague : </Text>
                <Text style={style.text}>{leagueDetails.strLeague}</Text>
            </View>
            <View style={{ flexDirection: "row",alignItems:"center",justifyContent:'center' }}>
                <Text style={style.title}>strLeagueAlternate : </Text>
                <Text style={style.text}>{leagueDetails.strLeagueAlternate}</Text>
            </View>
            <View style={{ flexDirection: "row",alignItems:"center",justifyContent:'center' }}>
                <Text style={style.title}>strSport : </Text>
                <Text style={style.text}>{leagueDetails.strSport}</Text>
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    container:{
        flex:1,
        alignItems:"flex-start",
        justifyContent:"center",
        marginStart:10
    },
    title:{
        fontWeight:"bold",
        fontSize:18,
    },
    text:{
        fontSize:15
    }
})
