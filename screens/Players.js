import React, { useState, useEffect } from 'react'
import { View, Text, SafeAreaView, FlatList, TextInput, TouchableOpacity, Dimensions, ActivityIndicator, Image, TouchableWithoutFeedback, StyleSheet } from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Players({ navigation }) {
    const [players, setPlayers] = useState([])
    const [searchText, setSearchText] = useState(undefined)
    const [favoritePlayers, setFavoritePlayers] = useState(Array)
    const [loading, setLoading] = useState(false)
    React.useEffect(() => {
        getPlayers();
        getFavoritePlayers();
    }, [searchText])
    const width = Dimensions.get('window').width;

    const getPlayers = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `https://www.thesportsdb.com/api/v1/json/2/searchplayers.php?p=${searchText}`
            );
            const json = await response.json();
            setPlayers(json.player);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error(error);
        }
    };

    const getFavoritePlayers = async () => {
        try {
            AsyncStorage.getItem('favoritePlayers', (err, result) => {
                if (result !== null) {
                    console.log('Players Found', result);
                    const jsonData = JSON.parse(result);
                    console.log('Players Found Count', jsonData.length);
                    setFavoritePlayers(jsonData);
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

    const removeFromFavorite = async (item) => {
        try {
            console.log("removeFromFavorite called");
            AsyncStorage.getItem('favoritePlayers', (err, result) => {
                if (result !== null) {
                    console.log('Data Found', result);
                    const jsonData = JSON.parse(result);
                    jsonData.splice(jsonData.findIndex(league => league.idPlayer === item.idPlayer), 1);
                    AsyncStorage.setItem('favoritePlayers', JSON.stringify(jsonData));
                    getFavoritePlayers();
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
            removeFromFavorite(props.item);
        else
            addToFavorite(props.item);
    }

    // const deleteFavorite=async(item)=>{
    //         try {
    //             await AsyncStorage.removeItem("favoritePlayers");
    //             return true;
    //         }
    //         catch(exception) {
    //             return false;
    //         }
    // }
    // deleteFavorite();

    const _isFav = (item) => {
        let isFavorite = false;
        for (let i = 0; i < favoritePlayers.length; i++) {
            if (favoritePlayers[i].idPlayer == item.idPlayer) {
                isFavorite = true;
            }
        }
        return isFavorite;
    }

    const renderPlayers = ({ item }) => {
        const isFav = _isFav(item);
        return (
            <TouchableWithoutFeedback
                onPress={() => navigation.navigate("PlayerDetails", { item, isFav })}
            >
                <View style={styles.itemContainer}>
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
                        onPress={() => onPressHeart({ item, isFav })}
                    />
                </View>
            </TouchableWithoutFeedback>
        );
    }
    return (
        <SafeAreaView>
            <ActivityIndicator style={styles.loading} animating={loading} size={"large"} />
            <View style={{ flexDirection: "row", borderWidth: 0.5, margin: 5, justifyContent: "space-between" }}>
                <TextInput
                    style={{ height: 50, width: (width - 20) }}
                    placeholder='Search by player name...'
                    onChangeText={text => setSearchText(text)}
                />
                {/* <TouchableOpacity
                    style={{ height: 40, width: 70, alignSelf: 'center', alignItems: 'center', justifyContent: "center", marginHorizontal: 5, position: 'absolute', end: 0, backgroundColor: "#fff", borderRadius: 5 }}
                    onPress={() => getPlayers()}
                >
                    <Text style={{ color: "#000" }}>Search</Text>
                </TouchableOpacity> */}
            </View>
            {players ? <Text style={{ alignSelf: "flex-end" }}>{players.length} Players Found</Text> : null}
            <FlatList
                style={{ marginBottom: 100 }}
                data={players}
                renderItem={renderPlayers}
                keyExtractor={item => item.idPlayer}
            />
            {!players ? <View style={{ marginTop: 100, alignSelf: "center" }}>
                <Text>Players not found with keyword '{searchText}'</Text>
            </View> : null}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    itemContainer: {
        borderWidth: 0.5,
        borderColor: "#000",
        flexShrink: 1,
        marginVertical: 4,
        padding: 10,
        marginHorizontal: 10,
        borderRadius: 5,
        backgroundColor: "#FFF",
        flexDirection: "row"
    },
    loading: {
        position: "absolute",
        top: "50%",
        start: "50%",
        end: "50%",
        bottom: "50%",
        elevation: 600
    }
});
