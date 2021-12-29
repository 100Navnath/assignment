import React, { useState, useEffect } from 'react'
import { View, Text, SafeAreaView, FlatList, TextInput, TouchableOpacity, Dimensions, ActivityIndicator, Image, TouchableWithoutFeedback, StyleSheet, ScrollView } from 'react-native'

export default function PlayerDetails(props) {
    const [playerDetails, setPlayerDetails] = useState(Object)
    const [isFav, setIsFav] = useState(false)
    useEffect(() => {
        props.navigation.addListener('focus', async () => {
            setPlayerDetails(props.route.params.item);
            setIsFav(props.route.params.isFav);
        })
    }, []);
    return (
        <ScrollView>
            <View style={{ borderWidth: 0.5, borderColor: "#000", flexShrink: 1, marginVertical: 4, padding: 10, marginHorizontal: 10, borderRadius: 5, backgroundColor: "#FFF", }}>
                <Image
                    style={{ width: "100%", height: 200 }}
                    source={{
                        uri: playerDetails.strBanner,
                    }}
                />
                <View style={{ flexShrink: 1, marginHorizontal: 5, flexDirection: "row", justifyContent: "space-evenly", marginVertical: 5 }}>
                    <Image
                        style={{ width: 100, height: 150 }}
                        source={{
                            uri: playerDetails.strThumb,
                        }}
                    />
                    <Image
                        style={{ width: 100, height: 150 }}
                        source={{
                            uri: playerDetails.strCutout,
                        }}
                    />
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>

                    <Image
                        style={{ width: 100, height: 150 }}
                        source={{
                            uri: playerDetails.strFanart2,
                        }}
                    />
                    <Image
                        style={{ width: 100, height: 150 }}
                        source={{
                            uri: playerDetails.strFanart3,
                        }}
                    />
                </View>
                <View style={{marginTop:10}}>
                    {playerDetails.strDescriptionEN ? <Text style={style.text}>{playerDetails.strDescriptionEN}</Text> : null}
                    <View style={{ flexDirection: "row", alignItems: "center",  }}>
                        <Text style={style.title}>Player Name : </Text>
                        <Text style={style.text}>{playerDetails.strPlayer}</Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Text style={style.title}>strRender : </Text>
                        <Text style={style.text}>{playerDetails.strRender}</Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Text style={style.title}>Sport : </Text>
                        <Text style={style.text}>{playerDetails.strSport}</Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center"}}>
                        <Text style={style.title}>Team : </Text>
                        <Text style={style.text}>{playerDetails.strTeam}</Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center",  }}>
                        <Text style={style.title}>Position : </Text>
                        <Text style={style.text}>{playerDetails.strPosition}</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}
const style = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "flex-start",
        justifyContent: "center",
        marginStart: 10
    },
    title: {
        fontWeight: "bold",
        fontSize: 18,
    },
    text: {
        fontSize: 15
    }
})
