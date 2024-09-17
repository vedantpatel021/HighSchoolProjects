/*
GlobalGuesserPatel

Description: A game where you guess the location of an image on the map

Author: Vedant Patel

Outline of game: This is a game that gives you and image from the world and a map. The user has to click on the map and guess 
where they think the image is and the game will tell them how far they were off, their score, and where the actual location
was with a line between the location of the image's location and their guess. There are basically two different screens and
when the app is just loaded for the first time, it will show them the map and a small image of the location on the bottom left.
The user can click on the image and see the image enlarged, guessing and next level buttons, along with the score and distance
between their previous guess and the actual location. I utilize the react native MapView component to render the map and 
links for images. I made sure that the links are accessible on school wifi and it is not blocked. I also have made an option
for the pin that appears when the user guesses where they can click on the blue pin to see the distance between their guess
and the correct location. When they have made their guess, it no longer allows them to click on another location until they 
move onto the next level. When the game ends, all buttons will be disabled and the user will see their final score on the screen.
There are no bugs that I have found in this app. The only issue that might come could be with the loading of the images on school
WiFi, but I checked over and over (without any VPN) and there was zero issue loading up the images.
*/

import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";

export default function App() {
  const [viewSelected, setViewSelected] = useState("map");
  const [guess, setGuess] = useState(false);
  const [index, setIndex] = useState(0);
  const [guessed, setGuessed] = useState(false);
  const [score, setScore] = useState(0);
  const [distance, setDistance] = useState(0);
  const [nextClicked, setNextClicked] = useState(true);
  const [initialLat, setInitialLat] = useState(37.0902);
  const [initialLon, setInitialLon] = useState(-95.7129);
  const [initialLatDelta, setInitialLatDelta] = useState(30);
  const [initialLonDelta, setInitialLonDelta] = useState(60.0099);
  const [polylineCoord, setPolylineCoord] = useState({
    latitude: 40.8478,
    longitude: -74.5747,
  });

  const [arrayOfPlaces, setArrayOfPlaces] = useState([
    {
      image: {
        uri: "https://www.blankrome.com/sites/default/files/styles/max_1000px/public/2019-04/1271_avenue_of_americas-.jpg?itok=Xo2KIm8H",
      },
      latitude: 40.760556,
      longitude: -73.981111,
    },
    {
      image: {
        uri: "https://www.brightviewseniorliving.com/-/media/images/brightview-community-gallery/randolph/randolph-ext.jpg",
      },
      latitude: 40.741895,
      longitude: -73.989308,
    },
    {
      image: {
        uri: "https://www.usnews.com/dims4/USNEWS/cf1a1c4/2147483647/resize/1200x%3E/quality/85/?url=http%3A%2F%2Fmedia.beam.usnews.com%2F9d%2F9b%2Fd8dc8f3747b9b147d5c0a7fa1888%2F2-angkor-wat-getty.jpg",
      },
      latitude: 13.412441,
      longitude: 103.866584,
    },
    {
      image: {
        uri: "https://www.usnews.com/dims4/USNEWS/3aa5ddb/2147483647/resize/1200x%3E/quality/85/?url=http%3A%2F%2Fmedia.beam.usnews.com%2Fc2%2Fb4%2Fe67fc0a24e499fe7b7f11bba0fb9%2F3-sydney-opera-house-submitted-masaru-kitano-snak-productions-tourism-australia-4.jpg",
      },
      latitude: -33.8567198,
      longitude: 151.215123,
    },
    {
      image: {
        uri: "https://www.usnews.com/dims4/USNEWS/26485ec/2147483647/resize/1200x%3E/quality/85/?url=http%3A%2F%2Fmedia.beam.usnews.com%2F42%2F18%2Ffea6243e41c7bbe827610a48028c%2F4-eiffel-tower-getty.jpg",
      },
      latitude: 48.85826,
      longitude: 2.294499,
    },
    {
      image: {
        uri: "https://www.usnews.com/dims4/USNEWS/126b6c9/2147483647/resize/1200x%3E/quality/85/?url=http%3A%2F%2Fmedia.beam.usnews.com%2F64%2F19%2Fd8122751475db89d12259ae2876a%2F5-taj-mahal-getty.jpg",
      },
      latitude: 27.175012,
      longitude: 78.042097,
    },
    {
      image: {
        uri: "https://www.usnews.com/dims4/USNEWS/12e9f5c/2147483647/resize/1200x%3E/quality/85/?url=http%3A%2F%2Fmedia.beam.usnews.com%2F05%2F1e%2F64ddf58e4c1abb699bfcc2dfa741%2F6-burj-khalifa-getty.jpg",
      },
      latitude: 25.197031,
      longitude: 55.274222,
    },
    {
      image: {
        uri: "https://www.usnews.com/dims4/USNEWS/269e567/2147483647/resize/1200x%3E/quality/85/?url=http%3A%2F%2Fmedia.beam.usnews.com%2F40%2F0f%2F8a0161cd4d4bad5943204c182549%2F9-mount-rushmore-getty.jpg",
      },
      latitude: 43.87582,
      longitude: -103.453838,
    },
    {
      image: {
        uri: "https://www.usnews.com/dims4/USNEWS/a883f71/2147483647/resize/1200x%3E/quality/85/?url=http%3A%2F%2Fmedia.beam.usnews.com%2Fb0%2F84%2F575e32d74bf69772ff08c3a988e3%2F10-mont-saint-michel-getty.jpg",
      },
      latitude: 48.635523,
      longitude: -1.510257,
    },
    {
      image: {
        uri: "https://www.usnews.com/dims4/USNEWS/a238721/2147483647/resize/1200x%3E/quality/85/?url=http%3A%2F%2Fmedia.beam.usnews.com%2F15%2F85%2F2c4473ac46229e5ae1b127e9d0c9%2F12-acropolis-getty.jpg",
      },
      latitude: 37.9717,
      longitude: 23.72635,
    },
    {
      image: {
        uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Aerial_view_of_Lincoln_Memorial_-_east_side_EDIT.jpeg/1200px-Aerial_view_of_Lincoln_Memorial_-_east_side_EDIT.jpeg",
      },
      latitude: 38.8900377,
      longitude: -77.0509374,
    },
    {
      image: {
        uri: "https://www.aoc.gov/sites/default/files/styles/social_standard/public/2020-06/U.S._Capitol_Building_%402x.jpg?h=1325a2b6&itok=ZNmLrCgt",
      },
      latitude: 38.889939,
      longitude: -77.009051,
    },
    {
      image: {
        uri: "https://blog.trekaroo.com/wp-content/uploads/2020/07/Things-to-do-in-Arches-National-Park.jpg",
      },
      latitude: 38.733081,
      longitude: -109.592514,
    },
    {
      image: {
        uri: "https://www.trucknews.com/wp-content/uploads/2019/09/iStock-1070039302.jpg",
      },
      latitude: 45.425119,
      longitude: -75.699951,
    },
    {
      image: {
        uri: "https://cdn1.parksmedia.wdprapps.disney.com/resize/mwImage/1/1600/900/75/dam/wdpro-assets/gallery/attractions/epcot/spaceship-earth/spaceship-earth-gallery00.jpg?1559892180952",
      },
      latitude: 28.3642756,
      longitude: -81.5318037,
    },
  ]);

  const [markers, setMarkers] = useState([]);

  const [coordinates, setCoordinates] = useState({
    latitude: 40.8478,
    longitude: -74.5747,
  });

  useEffect(() => {
    let array = arrayOfPlaces;
    let currentIndex = array.length;
    while (currentIndex != 0) {
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
    setArrayOfPlaces(array);
    setIndex(0);
  }, []);

  function submitCheck(lat1, lon1, lat2, lon2, unit) {
    if (index != arrayOfPlaces.length - 1){
      if (lat1 == lat2 && lon1 == lon2) {
        setDistance(0);
        setScore(score + 5000);
      } else {
        var R = 6371; // km
        var dLat = toRad(lat2 - lat1);
        var dLon = toRad(lon2 - lon1);
        var lat1 = toRad(lat1);
        var lat2 = toRad(lat2);
  
        var a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.sin(dLon / 2) *
            Math.sin(dLon / 2) *
            Math.cos(lat1) *
            Math.cos(lat2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        setDistance(Math.floor(d));
        setScore(Math.floor(score + (5000 - 40 * Math.sqrt(d))));
      }
      setGuessed(true);
      setNextClicked(false);
      var markersTemp = markers;
      markersTemp.push({
        latlon: {
          latitude: arrayOfPlaces[index].latitude,
          longitude: arrayOfPlaces[index].longitude,
        },
      });
      setPolylineCoord({
        latitude: arrayOfPlaces[index].latitude,
        longitude: arrayOfPlaces[index].longitude,
      });
    }
    else {
      setGuessed(true);
    }
  }

  function toRad(Value) {
    return (Value * Math.PI) / 180;
  }

  function nextLevel() {
    if (index < arrayOfPlaces.length - 1) {
      setIndex(index + 1);
    }
    setGuessed(false);
    setNextClicked(true);
    var markersTemp = markers;
    markersTemp.pop();
    setMarkers(markersTemp);
    setPolylineCoord(coordinates);
  }

  function changeView() {
    if (viewSelected == "map") {
      setViewSelected("level");
    } else if (viewSelected == "level") {
      setViewSelected("map");
    }
  }

  const onLocationSelect = (event) => {
    if (!guessed) {
      setCoordinates(event.nativeEvent.coordinate);
      setPolylineCoord(event.nativeEvent.coordinate);
    }
  };

  function changeMapView(region) {
    setInitialLat(region.latitude);
    setInitialLon(region.longitude);
    setInitialLatDelta(region.latitudeDelta);
    setInitialLonDelta(region.longitudeDelta);
  }

  if (viewSelected == "map") {
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          mapType="standard"
          onPress={onLocationSelect}
          onRegionChange={(region) => changeMapView(region)}
          initialRegion={{
            latitude: initialLat,
            longitude: initialLon,
            latitudeDelta: initialLatDelta,
            longitudeDelta: initialLonDelta,
          }}
        >
          <Marker coordinate={coordinates} />
          <Polyline
          strokeWidth={3}
          strokeColor='black'
          coordinates={[polylineCoord, coordinates]}
          />
          {markers.map((marker, index) => (
            <Marker
              key={markers}
              coordinate={markers[index].latlon}
              pinColor={"blue"}
              title={distance + 'km'}
            />
          ))}
        </MapView>
        <View
          style={{
            height: 100,
            width: 100,
            borderRadius: 5,
            backgroundColor: "#0DBC7F",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            bottom: 30,
            right: 20,
            alignSelf: "flex-end",
          }}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              width: "100%",
              height: "100%",
            }}
            onPress={changeView}
          >
            <ImageBackground
              resizeMode="cover"
              style={{
                width: "95%",
                height: "95%",
                marginHorizontal: 5,
                marginVertical: 5,
              }}
              source={arrayOfPlaces[index].image}
            />
          </TouchableOpacity>
        </View>
        <StatusBar style="auto" />
      </View>
    );
  } else if (viewSelected == "level") {
    return (
      <View style={styles.container}>
        <View
          style={{ flex: 2.5, width: "100%", height: "100%", paddingTop: 70 }}
        >
          <View
            style={{
              width: "90%",
              height: "80%",
              backgroundColor: "#257E7B",
              alignSelf: "center",
            }}
          >
            <ImageBackground
              resizeMode="cover"
              style={styles.backgroundImageStyle}
              source={arrayOfPlaces[index].image}
            />
          </View>
        </View>
        <View style={{ flex: 0.5 }}>
          <Text style={styles.scoreTextStyle}>Score: {score}</Text>
          <Text style={styles.scoreTextStyle}>Distance: {distance}</Text>
        </View>
        <View style={{ flex: 1, flexDirection: "row" }}>
          <TouchableOpacity
            style={styles.buttonGold}
            disabled={guessed}
            onPress={() => {
              submitCheck(
                arrayOfPlaces[index].latitude,
                arrayOfPlaces[index].longitude,
                coordinates.latitude,
                coordinates.longitude,
                "K"
              );
            }}
          >
            <Text style={styles.buttonCheck}>Guess</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonGold}
            disabled={nextClicked}
            onPress={() => {
              nextLevel();
            }}
          >
            <Text style={styles.buttonCheck}>Next</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            height: 100,
            width: 100,
            borderRadius: 5,
            backgroundColor: "#0DBC7F",
            borderColor: "rgba(0,0,0,0.2)",
            alignSelf: "flex-end",
            bottom: 30,
            right: 20,
          }}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              width: "100%",
              height: "100%",
            }}
            onPress={changeView}
          >
            <ImageBackground
              resizeMode="cover"
              style={{
                width: "95%",
                height: "95%",
                marginHorizontal: 5,
                marginVertical: 5,
              }}
              source={{ uri: "https://www.mapsofworld.com/maps/world-map.jpg" }}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1D6865",
    alignItems: "center",
    justifyContent: "center",
  },
  scoreTextStyle: {
    color: "black",
    alignSelf: "center",
    textAlign: "center",
    fontSize: 40,
    fontWeight: "bold",
    textShadowColor: "black",
    textShadowRadius: 5,
  },
  map: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  buttonGold: {
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    width: "30%",
    height: "30%",
    backgroundColor: "#0DBC7F",
    borderRadius: 35,
    marginHorizontal: 10,
    marginVertical: 10,
    flexDirection: "row",
  },
  backgroundImageStyle: {
    flex: 1,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    left: 8,
    top: 17,
    width: "95%",
    height: "90%",
  },
});