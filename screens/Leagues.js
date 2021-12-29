import React, { useState, useEffect } from 'react'
import { View, Text, SafeAreaView, FlatList, TextInput, TouchableOpacity, Dimensions, ActivityIndicator, TouchableWithoutFeedback, StyleSheet } from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Leagues({ navigation }) {
    const [allLeagues, setAllLeagues] = useState(null)
    const [searchText, setSearchText] = useState(String)
    const [loading, setLoading] = useState(false)
    const [favLeagues, setFavLeagues] = useState(Array)
    React.useEffect(() => {
        getAllLeagues();
        getFavoriteLeagues();
    }, []);

    const width = Dimensions.get('window').width;

    const getAllLeagues = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                'https://www.thesportsdb.com/api/v1/json/2/all_leagues.php'
            );
            const json = await response.json();
            setAllLeagues(json.leagues);
            setLoading(false);
            // console.log(json.leagues[0]);
        } catch (error) {
            setLoading(false);
            console.error(error);
        }
    };

    const getAllLeaguesByCountry = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `https://www.thesportsdb.com/api/v1/json/2/search_all_leagues.php?c=${searchText}`
            );
            const json = await response.json();
            setAllLeagues(json.countrys);
            console.log(json.leagues);
            // console.log(json.leagues[0]);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error(error);
        }
    };

    const onSearchPress = () => {
        if (searchText.trim(" ") == "")
            getAllLeagues();
        else
            getAllLeaguesByCountry();
    }

    const getFavoriteLeagues = async () => {
        try {
            AsyncStorage.getItem('favoriteLeagues', (err, result) => {
                if (result !== null) {
                    console.log('Leagues Found', result);
                    const jsonData = JSON.parse(result);
                    console.log('Leagues Found Count', jsonData.length);
                    setFavLeagues(jsonData);
                } else {
                    console.log('Leagues Not Found in favorite');
                }
            });
        } catch (e) {
            alert(e);
        }
    }

    const addToFavorite = async (item) => {
        try {
            AsyncStorage.getItem('favoriteLeagues', (err, result) => {
                if (result !== null) {
                    console.log('Data Found', result);
                    const jsonData = JSON.parse(result);
                    const newData = [...jsonData, item];
                    AsyncStorage.setItem('favoriteLeagues', JSON.stringify(newData));
                    getFavoriteLeagues();
                } else {
                    console.log('Data Not Found');
                    AsyncStorage.setItem('favoriteLeagues', JSON.stringify([item]));
                    console.log(item);
                    getFavoriteLeagues();
                }
            });
        } catch (e) {
            alert(e);
        }
    }

    const removeFromFavorite = async (item) => {
        try {
            console.log("removeFromFavorite called");
            AsyncStorage.getItem('favoriteLeagues', (err, result) => {
                if (result !== null) {
                    console.log('Data Found', result);
                    const jsonData = JSON.parse(result);
                    jsonData.splice(jsonData.findIndex(league => league.idLeague === item.idLeague), 1);
                    AsyncStorage.setItem('favoriteLeagues', JSON.stringify(jsonData));
                    getFavoriteLeagues();
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
    //             await AsyncStorage.removeItem("favoriteLeagues");
    //             return true;
    //         }
    //         catch(exception) {
    //             return false;
    //         }
    // }
    // deleteFavorite();

    const _isFav = (item) => {
        let iconName = false;
        for (let i = 0; i < favLeagues.length; i++) {
            if (favLeagues[i].idLeague == item.idLeague) {
                iconName = true;
            }
        }
        return iconName;
    }
    const renderLeagues = ({ item }) => {
        const isFav = _isFav(item);
        return (
            <TouchableWithoutFeedback
                onPress={() => navigation.navigate("LeagueDetails", { item, isFav })}
            >
                <View style={styles.leagueContainer}>
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
                    style={{ height: 50, width: (width - 90) }}
                    placeholder='Search by country...'
                    onChangeText={text => setSearchText(text)}
                />
                <TouchableOpacity
                    style={styles.searchBtn}
                    onPress={() => onSearchPress()}
                >
                    <Text style={{ color: "#000" }}>Search</Text>
                </TouchableOpacity>
            </View>
            {allLeagues ? <Text style={{ alignSelf: "flex-end" }}>{allLeagues.length} Leagues Found</Text> : null}

            <FlatList
                data={allLeagues}
                renderItem={renderLeagues}
                keyExtractor={item => item.idLeague}
            />
            {!allLeagues ? <View style={{ marginTop: 100, alignSelf: "center" }}>
                <Text>Leagues not found with country '{searchText}'</Text>
            </View> : null}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    leagueContainer: {
        borderWidth: 0.5,
        borderColor: "#000",
        marginVertical: 4,
        padding: 10,
        marginHorizontal: 10,
        borderRadius: 5,
        backgroundColor: "#FFF",
        justifyContent: "space-between",
        flexDirection: 'row'
    },
    searchBtn: {
        height: 40,
        width: 70,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: "center",
        marginHorizontal: 5,
        position: 'absolute',
        end: 0,
        backgroundColor: "#fff",
        borderRadius: 5
    },
    loading: {
        position: "absolute",
        top: "50%",
        start: "50%",
        end: "50%",
        bottom: "50%",
        elevation: 600
    }
})
