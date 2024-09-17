/*
App: ForecastPatel

Author: Vedant Patel

Paragraph: This app gives the user the option to put in the coordinates of a location and get the weather forecast for that location. I have included features such as the current temperature and the
daily temperature for that location for the next 7 days. It also tells the user the location of the coordinates they entered. The weather forecast consists of the temperature (max and min for the day)
and the wind speed for that day. I noticed that the openweathermap api's wind speed was off by 3 mph compared to the one that shows up when you search up the wind speed on Google, so I adjusted the
wind speed accordingly so its hopefully more accurate. I have also made the background change depending on the type of weather. So for example, if the weather says "Clouds", then the background will
be cloudy. But I realized that the description of the weather is more precise and informative on what the exact weather is like, so I also have an icon pulled from the api itself (serves as a better
visual in case the background isn't the most accurate). Though there is one bug in the app which is that when the user enters their coordinates, the app gives an error saying "Each child in a list
should have a unique 'key' prop." I am not sure how to fix this issue exactly and whats causing it. Its not very severe in this situation because all the information still displays accurately and 
and the app doesn't crash, but it is an error nevertheless. Everything else is perfectly fine and it works as intended.
*/

import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View,TouchableOpacity, SafeAreaView, ImageBackground, TextInput, ScrollView, Alert, FlatList, Image, TouchableHighlight, ListViewBase } from 'react-native';

export default function App() {
  const [update, setUpdate] = useState(false);
  const [lon, setLon] = useState();
  const [lat, setLat] = useState();
  const [mount, setMount] = useState(false);
  const [temp, setTemp] = useState();
  const [location, setLocation] = useState();
  const [weatherType, setWeatherType] = useState();
  const [windSpeed, setWindSpeed] = useState();
  const [tempHigh, setTempHigh] = useState();
  const [tempLow, setTempLow] = useState();
  const [dailyDay, setDailyDay] = useState();
  const [weatherCurrentImage, setWeatherCurrentImage] = useState();
  const [info, setInfo] = useState();
  const [weatherImage, setWeatherImage] = useState("https://i.pinimg.com/originals/50/7e/48/507e485b4e2685b1c4d763a725517d43.jpg");

  var URL1 = 'https://api.openweathermap.org/data/2.5/onecall?lat=';
  var URL2 = '&lon=';
  var URL3 = '&units=imperial&appid=6a1251f39a2967665f13715629d3025c';
  var GEOURL1 = 'http://api.positionstack.com/v1/reverse?access_key=21972469fdbb5865baba1ff58cce69d5&query=';
  
  useEffect (() => {
    if (mount && lat != null && lon != null){
      var URL = URL1 + lat + URL2 + lon + URL3;
      var GEOURL = GEOURL1 + lat + "," + lon; 
      var wrong = false;
      fetch(URL)
      .then(response => response.json())
      .then(data => {
        setInfo(data);
        setTemp(Math.round(data.current.temp) + "°");
        setWeatherType(data.current.weather[0].main + " / " + data.current.weather[0].description);
        setWindSpeed(Math.round(data.current.wind_speed) + " mph");
        setTempHigh(Math.round(data.daily[0].temp.max) + "°");
        setTempLow(Math.round(data.daily[0].temp.min) + "°");
        weatherIcon(data.current.weather[0].main);
        setDailyDay(data.daily);
        setWeatherCurrentImage(data.current.weather[0].icon);
        //gettingDailyInformation(data);
      })
      .catch (() => {
        if (wrong == false){
          wrong = true;
          showAlert();
        }
      })

      fetch(GEOURL)
      .then(response => response.json())
      .then(dataGeo => {
        setLocation(fixLocation(dataGeo.data[0].label) + ", " + dataGeo.data[0].region_code);
      })
      .catch (() => {
        if (wrong == false){
          wrong = true;
          showAlert();
        }
      })
      
      const showAlert = () => {
        if(wrong){
          Alert.alert(
            "Weather Error",
            "Unable to retrieve data"
          )
        }
      }
      
    }
    else{
      setMount(true);
    }
  }, [update])

  function updateScreen() {
    setUpdate(!update);
  }

  function weatherIcon (icon) {
    if (icon == "Clouds"){
      setWeatherImage("https://images.unsplash.com/photo-1603288967520-f3e04381dc02?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y2xvdWR5JTIwd2VhdGhlcnxlbnwwfHwwfHw%3D&w=1000&q=80");
    }
    else if (icon == "Thunderstorm"){
      setWeatherImage("https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8&w=1000&q=80");
    }
    else if (icon == "Drizzle"){
      setWeatherImage("https://wallup.net/wp-content/uploads/2019/05/10/11950-rain-weather-water-drops-condensation-rain-on-glass-748x468.jpg");
    }
    else if (icon == "Rain"){
      setWeatherImage("https://images.hdqwalls.com/download/catch-the-rain-4k-zv-2560x1440.jpg");
    }
    else if (icon == "Snow"){
      setWeatherImage("https://wallpaperaccess.com/full/1912330.jpg");
    }
    else if (icon == "Clear"){
      setWeatherImage("https://s7d2.scene7.com/is/image/TWCNews/untitled_png");
    }
    else if (icon == "Fog"){
      setWeatherImage("https://www.worldatlas.com/r/w1200/upload/58/76/1e/shutterstock-736023025.jpg");
    }
    else if (icon == "Mist"){
      setWeatherImage("https://www.advancednanotechnologies.com/wp-content/uploads/2019/05/iStock-1055906130-1080x675.jpg");
    }
    else{
      setWeatherImage("https://i.pinimg.com/originals/50/7e/48/507e485b4e2685b1c4d763a725517d43.jpg");
    }
  }

  function fixLocation (labelLocation) {
    let comma1 = 0;
    let comma2 = 0;
    comma1 = labelLocation.indexOf(",") + 1;
    labelLocation = labelLocation.substring(comma1);
    comma2 = labelLocation.indexOf(",");
    return labelLocation.substring(1, comma2);
  }

  /*function gettingDailyInformation (data){
    var dt = data.daily[0].dt;
    var dayNum = new Date(dt * 1000).toLocaleDateString("en-US", { weekday: 'long'});
    return dayNum
  }*/

  /*const renderItem = ({ item }) => {
    return(
      <View style={styles.dailyInformationStyle}>
        <Text>{generatingDays(item.id)}</Text>
        <ImageBackground
        source={{ uri: 'https://openweathermap.ord/img/wn/' + item.weather[0].icon + '@2x.png'}}
        resizeMode='cover' 
        style={styles.weatherIconStyle}       
        />
      </View>
    )
  }*/

  function generatingDays (dt) {
    var day = new Date(dt * 1000).toLocaleDateString("en-US", { weekday: 'long'});
    if (today(dt)){
      return "Today";
    }
    return day
  }

  const today = (dt) => {
    var date = new Date(dt * 1000).toLocaleDateString('en-US');
    var now = new Date().toLocaleDateString('en-US');
    return now == date;
  }

  const renderDaily = ({ item }) => {
    return(
      <View style={styles.dailyInformationStyle}>
        <View style={{flex: 1, alignSelf: 'center'}}>
          <Text style={styles.nameOfDayStyle}>{generatingDays(item.dt)}</Text>
        </View>
        
        <View style={{flex: 2, alignSelf: 'center'}}>
          <Image
          source={{ uri: 'http://openweathermap.org/img/wn/' + item.weather[0].icon + '@2x.png' }}
          resizeMode='cover' 
          style={styles.weatherIconStyle}       
          />
        </View>
        <View style={{flex: 2, alignSelf: 'center'}}>
          <Text style={styles.dailyWeatherMaxMinStyle}>Max: {Math.floor(item.temp.max)}{"°"}</Text>
          <Text style={styles.dailyWeatherMaxMinStyle}>Min: {Math.floor(item.temp.min)}{"°"}</Text>
          <Text style={styles.windSpeedTextStyle}>Wind: {Math.round(item.wind_speed - 3) + " mph"}</Text>
        </View>
      </View>
    )
  }

  return (
    <ImageBackground
    source={{ uri: weatherImage}} 
    resizeMode="cover"
    style={styles.backgroundImageStyle}
    >
      <SafeAreaView style={styles.container}>
        <View style={{flex: 1, width: '100%'}}>
          <Text style={styles.weatherForecast}>Weather Forecast</Text>
        </View>
        <View style={{flex: 1.5}}>
          <View style={styles.lonLatView}
            keyboardShouldPersistTaps='handled'
          >
            <TextInput 
              style={styles.lonLatInput}
              value={lat}
              onChangeText={lat => setLat(lat)}
              placeholder="Latitude"
              keyboardType="default"
              placeholderTextColor='white'
            />
            <TextInput 
              style={styles.lonLatInput}
              value={lon}
              onChangeText={lon => setLon(lon)}
              placeholder="Longitude"
              keyboardType="default"
              placeholderTextColor='white'
            />
            <TouchableOpacity
              style={styles.buttonGold}
              onPress={() => {updateScreen()}}
            >
              <Text style={styles.buttonCheck}>✓</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{flex: 10, width: '100%'}}>
          <View style={{flex: 1, width: '100%'}}>
            <View style={{flex: 10}}>
              <Text style={styles.locationStyle}>{location}</Text>
              <Text style={styles.weatherTypeStyle}>{weatherType}</Text>
              <Text style={styles.temperatureStyle}>{temp}</Text>
            </View>
            <View style={{height: '30%', width: '100%'}}>
              <ImageBackground
              source={{ uri: 'http://openweathermap.org/img/wn/' + weatherCurrentImage + '@2x.png' }}
              style={styles.currentWeatherIconStyle}       
              />
            </View>
          </View>
            
          <Text style={styles.dailyTextStyle}>The Next 7 Days</Text>
          <View style={{alignSelf: 'center' , flex: 1, width: '100%', flexDirection: 'row'}}>
            <FlatList
            data={dailyDay}
            keyExtractor={({ id }) => {
              return id;
            }}
            renderItem={renderDaily}
            horizontal
            />
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundImageStyle:{
    flex: 1,
    justifyContent: "center",
    width: '100%',
    height: '110%'
  },
  weatherTypeStyle:{
    color: 'white', 
    alignSelf: 'center', 
    marginTop: 10, 
    textAlign: 'center', 
    fontSize: 20, 
    textShadowColor: 'black', 
    textShadowOffset: {width: 1, height: 1}, 
    textShadowRadius: 5,
  },
  locationStyle:{
    color: 'white', 
    alignSelf: 'center', 
    marginTop: 10, 
    textAlign: 'center', 
    fontSize: 30, 
    fontWeight: 'bold', 
    textShadowColor: 'black', 
    textShadowOffset: {width: 1, height: 1}, 
    textShadowRadius: 5
  },
  weatherItemContainer: {
    height: '95%',
    width: '85%',
    alignSelf: 'center',
    opacity: 0.8,
    backgroundColor: '#18181b99',
    borderRadius: 10,
  },
  temperatureStyle:{
    color: 'white', 
    alignSelf: 'center', 
    marginTop: 15, 
    marginLeft: 37, 
    textAlign: 'center', 
    fontSize: 90, 
    fontWeight: 'bold', 
    textShadowColor: 'white', 
    textShadowOffset: {width: 2, height: 1}, 
    textShadowRadius: 10
  },
  lonLatView:{
    flexDirection: 'row', 
    width: '100%', 
    fontWeight: 'bold', 
    padding: 10, 
    justifyContent: 'center',
  },
  lonLatInput: {
    height: 40,
    width: '35%',
    margin: 12,
    borderWidth: 2,
    padding: 10,
    textAlign: 'center',
    alignSelf: 'center',
    backgroundColor: '#18181b99',
    color: 'white',
    borderColor: 'white',
    borderRadius: 10
  },
  buttonGold: {
    borderWidth: 2,
    borderColor:'white',
    alignItems:'center',
    justifyContent:'center',
    alignSelf: 'center',
    width: 40,
    height: 40,
    backgroundColor:'white',
    borderRadius:35,
    marginHorizontal: 10,
    marginVertical: 10,
    flexDirection: 'row',
  },
  weatherForecast: {
    textAlign: 'center', 
    fontWeight: 'bold', 
    fontSize: 30, 
    color: 'white', 
    textShadowColor: 'black', 
    textShadowOffset: {width: -1, height: 1}, 
    textShadowRadius: 10},
  buttonCheck: {
    fontSize: 20,
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
  },
  weatherIcon: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },
  highLowTempStyle: {
    width: 90,
    height: 90,
    marginTop: 5,
  },
  highLowTempTextStyle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
  },
  windSpeedTextStyle:{
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
  },
  windSpeedImageStyle: {
    height: 40,
    width: 65,
    marginTop: 36,
    marginLeft: 10,
  },
  dailyInformationStyle: {
    backgroundColor: '#18181a99',
    width: 130,
    height: 250,
    marginLeft: 15,
    marginRight: 15,
    alignSelf: 'center',
    marginTop: 15,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 10
  },
  buttonCheck: {
    fontSize: 15,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  dailyTextStyle:{
    fontWeight: 'bold',
    fontSize: 30,
    textAlign: 'center',
    marginTop: 7,
    color: 'white',
    textShadowColor: 'black',
    textShadowRadius: 5,
  },
  iconImageStyle:{
    width: 50,
    height: 50,
  },
  weatherIconStyle:{
    width: 120,
    height: 120,
    alignSelf: 'center'
  },
  nameOfDayStyle:{
    fontWeight: 'bold',
    fontSize: 20,
    color: 'white',
    textShadowColor: 'black', 
    textShadowOffset: {width: 1, height: 1}, 
    textShadowRadius: 5
  },
  dailyWeatherMaxMinStyle:{
    fontWeight: 'bold',
    fontSize: 20,
    color: 'white',
    textShadowColor: 'black', 
    textShadowOffset: {width: 1, height: 1}, 
    textShadowRadius: 5
  },
  currentWeatherIconStyle:{
    height: 70,
    width: 150,
    alignSelf: 'center'
  }
});
