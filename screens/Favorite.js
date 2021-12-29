import React, { useState, useEffect } from 'react'
import { View, Text, SafeAreaView, FlatList, TextInput, TouchableOpacity, Dimensions, ActivityIndicator, Image,TouchableWithoutFeedback } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default function Favorite(props) {
    const [favoriteLeagues, setFavoriteLeagues] = useState(Array);
    const [favoritePlayers, setFavoritePlayers] = useState(Array);
    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;

    useEffect(() => {
        props.navigation.addListener('focus', async () => {
            getFavorites();
        })
    }, []);

    const getFavorites = async () => {
        try {
            AsyncStorage.multiGet(['favoriteLeagues', 'favoritePlayers'], (err, result) => {
                if (result !== null) {
                    console.log('data Found', result);
                    const favoriteLeagues = JSON.parse(result[0][1]);
                    const favoritePlayers = JSON.parse(result[1][1]);
                    // console.log("favoriteLeagues ",favoriteLeagues);
                    // console.log("favoritePlayers ",favoritePlayers);
                    setFavoriteLeagues(favoriteLeagues);
                    setFavoritePlayers(favoritePlayers);
                } else {
                    console.log('Players Not Found in favorite');
                }
            });
        } catch (e) {
            alert(e);
        }
    }

    const addToFavorite = async (item) => {
        try {
            AsyncStorage.getItem('favoritePlayers', (err, result) => {
                if (result !== null) {
                    console.log('Data Found', result);
                    const jsonData = JSON.parse(result);
                    const newData = [...jsonData, item];
                    AsyncStorage.setItem('favoritePlayers', JSON.stringify(newData));
                    getFavoritePlayers();
                } else {
                    console.log('Data Not Found');
                    AsyncStorage.setItem('favoritePlayers', JSON.stringify([item]));
                    console.log(item);
                    getFavoritePlayers();
                }
            });
        } catch (e) {
            alert(e);
        }
    }

    const removeFromFavorite = async (props) => {
        try {
            console.log("removeFromFavorite called");
            AsyncStorage.getItem(props.key, (err, result) => {
                if (result !== null) {
                    console.log('Data Found', result);
                    const jsonData = JSON.parse(result);
                    jsonData.splice(jsonData.findIndex(i => i.idLeague === props.item.idPlayer || i.idPlayer === props.item.idPlayer), 1);
                    AsyncStorage.setItem(props.key, JSON.stringify(jsonData));
                    getFavorites();
                } else {
                    console.log('Data Not Found while removeFromFavorite');
                    // console.log(item);
                }
            });
        } catch (e) {
            alert(e);
        }
    }

    const onPressHeart = (props) => {
        if (props.isFav)
            removeFromFavorite(props);
        else
            addToFavorite(props);
    }

    const _isLeagueFav = (item) => {
        let iconName = false;
        for (let i = 0; i < favoriteLeagues.length; i++) {
            if (favoriteLeagues[i].idLeague == item.idLeague) {
                iconName = true;
            }
        }
        return iconName;
    }

    const _isPlayerFav = (item) => {
        let iconName = false;
        for (let i = 0; i < favoritePlayers.length; i++) {
            if (favoritePlayers[i].idPlayer == item.idPlayer) {
                iconName = true;
            }
        }
        return iconName;
    }

    const renderLeagues = ({ item }) => {
        const isFav = _isLeagueFav(item);
        return (
            <TouchableWithoutFeedback
            onPress={() => props.navigation.navigate("LeagueDetails", { item, isFav })}
            >
                <>
            <View style={{ borderWidth: 0.5, borderColor: "#000", marginVertical: 4, padding: 10, marginHorizontal: 10, borderRadius: 5, backgroundColor: "#FFF", justifyContent: "space-between", flexDirection: 'row' }}>
                <View style={{ width: (width - 70) }}>
                    {item.strLeague ? <Text>League : {item.strLeague}</Text> : null}
                    {item.strLeagueAlternate ? <Text>League Alternate : {item.strLeagueAlternate}</Text> : null}
                    {item.strSport ? <Text>Sport : {item.strSport}</Text> : null}
                </View>
                <FontAwesome
                    style={{ width: 30, margin: 5 }}
                    name={isFav ? "heart" : "heart-o"}
                    backgroundColor="#3b5998"
                    size={25}
                    onPress={() => onPressHeart({ key: "favoriteLeagues", item, isFav })}
                />
            </View>
            </>
            </TouchableWithoutFeedback>
        );
    }

    const renderPlayers = ({ item }) => {
        const isFav = _isPlayerFav(item);
        return (
            <TouchableWithoutFeedback
                onPress={() => props.navigation.navigate("PlayerDetails", { item, isFav })}
            >
            <View style={{ borderWidth: 0.5, borderColor: "#000", flexShrink: 1, marginVertical: 4, padding: 10, marginHorizontal: 10, borderRadius: 5, backgroundColor: "#FFF", flexDirection: "row" }}>
                <View style={{ flexShrink: 1, marginHorizontal: 5 }}>
                    <Image
                        style={{ width: 60, height: 80 }}
                        source={{
                            uri: item.strThumb,
                        }}
                    />
                    {item.strPlayer ? <Text style={{ alignSelf: "center" }}>{item.strPlayer}</Text> : null}
                </View>
                <View style={{ width: (width - 150) }}>
                    {/* {item.strRender ? <Text>League : {item.strRender}</Text> : null} */}
                    {item.strSport ? <Text>Sport : {item.strSport}</Text> : null}
                    {item.strTeam ? <Text>Team : {item.strTeam}</Text> : null}
                    {item.strPosition ? <Text>Position : {item.strPosition}</Text> : null}
                    {item.strDescriptionEN ? <Text style={{}}>About : {item.strDescriptionEN.substring(0, 50)}...</Text> : null}

                </View>
                <FontAwesome
                    style={{ width: 30, margin: 5 }}
                    name={isFav ? "heart" : "heart-o"}
                    backgroundColor="#3b5998"
                    size={25}
                    onPress={() => onPressHeart({ key: "favoritePlayers", item, isFav })}
                />
            </View>
            </TouchableWithoutFeedback>
        );
    }

    return (
        <View>
            <View style={{ height: (height - 40) / 2 }}>
                <Text style={{ margin: 5, fontWeight: "bold" }}>LEAGUES</Text>
                <FlatList
                    data={favoriteLeagues}
                    renderItem={renderLeagues}
                    keyExtractor={item => item.idLeague}
                />
            </View>
            <View style={{ height: (height - 90) / 2 }}>
                <Text style={{ margin: 5, fontWeight: "bold" }}>PLAYERS</Text>
                <FlatList
                    data={favoritePlayers}
                    renderItem={renderPlayers}
                    keyExtractor={item => item.idPlayer}
                />
            </View>
        </View>
    )
}
