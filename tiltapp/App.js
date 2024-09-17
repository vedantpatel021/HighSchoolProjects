/*
TiltAppPatel

Description: A 2d Sonic game where the user tilts the phone to move Sonic and collect his rings

Author: Vedant Patel

Outline: This app is a 2d Sonic game where the user tilts the phone to move Sonic left and right and collect rings for points. I use the 
accelerometer to move Sonic on the bottom of the screen. The user has to move sonic with a tilt of the phone left and right to move sonic
accordingly. The user has to try to not let the rings hit the ground. Their goal is to collect as many rings as possible by having sonic
touch them. If sonic is able to come in contact with the ring, then they will be teleported back up, else the game will end. Upon the game
ending, the user will see their high score and a scrollable view of their scores according to the number of the game they played. The 
user can then choose to restart the game and play another. If they lose, then they will go back to the result screen. 

At first it might seem that the user can just tilt the phone all the way to its side and have sonic move really fast in one direction and
collect all the coins without losing, but this will not always work. The rings spawn randomly from left to right on the top and at a 
random speed when falling down, so using that "cheat" strategy will not work, so it really isn't considered cheating.

The only things that I would consider a bug is that the rings when falling lag a little. This is because I am using setInterval for updating
their position. I would have tried to learn the "Animate" feature, but I had to miss 4 days of work because of NJGPA and 2 long blocks
because of no internet. I tried to make the most I could with the time I had and I think it's pretty nice. Its functional and the aesthetics
for the most part are quite pleasing.
*/
import { StatusBar } from "expo-status-bar";
import { Accelerometer } from "expo-sensors";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
  SafeAreaView,
  ImageBackground,
} from "react-native";
import Sonic_Ring from './Sonic_Ring'

export default function App() {
  const [Mounted, setMounted] = useState(false);
  const [LEFT, setLEFT] = useState(0);
  const [subscription, setSubscription] = useState(null);
  const [SpeedMultiplier, setSpeedMultiplier] = useState(9);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [view, setView] = useState("homeScreen");
  const [GameRunning, setGameRunning] = useState(false);
  const [scoresArray, setScoresArray] = useState([]);
  const [numGames, setNumGames] = useState(1);

  const [sonicGif, setSonicGif] =  useState(require('./assets/sonic-sonic-running.gif'));

  const [Coin1, setCoin1] = useState({left: 0, top: 40});
  const [Coin2, setCoin2] = useState({left: 0, top: 40});
  const [Coin3, setCoin3] = useState({left: 0, top: 40});
  const [Coin4, setCoin4] = useState({left: 0, top: 40});
  const [Coin5, setCoin5] = useState({left: 0, top: 40});
  
  const [DATA, setDATA] = useState({
    x: 0,
    y: 0,
    z: 0,
  });

  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;

  
  const [gameOver, setGameOver] = useState(false);
  const sonicToApp = (s) => {
    setGameOver(s);
    _unsubscribe;
    setView("results");
    let arr = scoresArray;
    arr.push([numGames + ".   \t" + score + "\n"]);
    setScoresArray(arr);
    setNumGames(numGames + 1);
  }

  const pointUpdate = () => {
    setScore(score + 1);
    if (score + 1 > highScore){
      setHighScore(score + 1);
    }
  }

  //let randomInt = Math.floor(Math.random() * (windowWidth - 40)) + 40; //random location for the debris to start falling at (x-axis)

  useEffect(() => {
    Accelerometer.setUpdateInterval(16);
    setGameRunning(true);
    let temp = Coin1;
    setScore(0);
    // temp.left = Math.floor(Math.random() * (windowWidth - 80)) + 20;
    // setCoin1(temp);
    // let temp2 = Coin2
    // temp2.left = Math.floor(Math.random() * (windowWidth - 80)) + 20;
    // setCoin2(temp2);
    // let temp3 = Coin3
    // temp3.left = Math.floor(Math.random() * (windowWidth - 80)) + 20;
    // setCoin3(temp3);
    // let temp4 = Coin4
    // temp4.left = Math.floor(Math.random() * (windowWidth - 80)) + 20;
    // setCoin4(temp4);
    // let temp5 = Coin5
    // temp5.left = Math.floor(Math.random() * (windowWidth - 80)) + 20;
    // setCoin5(temp5);
    setMounted(true);
  }, []);

  useEffect(() => {
    let interval = 0;
    if (Mounted){
      interval = setInterval(() => {
        let temp = Coin1;
        temp.top = temp.top + 1;
      }, 1);
    }
    else{
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  })

  useEffect(() => {
    if (LEFT < -36) {
      setLEFT(windowWidth + 35);
    } else if (LEFT > windowWidth + 36) {
      setLEFT(-35);
    } else {
      setLEFT(LEFT + round(x) * SpeedMultiplier);
    }
    if (round(x) > -0.03 && round(x) < 0.03){
      setSonicGif(require('./assets/sonic-run.gif'))
    }
    else if (round(x) < 0){
      setSonicGif(require('./assets/sonic-sonic-running-left.gif'));
    }
    else{
      setSonicGif(require('./assets/sonic-sonic-running.gif'));
    }
  }, [DATA]);

  const _subscribe = () => {
    setSubscription(
      Accelerometer.addListener((accelerometerData) => {
        setDATA(accelerometerData);
      })
    );
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  useEffect(() => {
    _subscribe();
    return () => _unsubscribe();
  }, []);

  const { x, y, z } = DATA;

  function round(n) {
    if (!n) {
      return 0;
    }
    return Math.floor(n * 100) / 100;
  }

  function resetGame() {
    _subscribe
    setView("game")
    setScore(0)
    setLEFT(windowWidth / 2 - 30)
  }

  if (view == "results"){
    return (
      <SafeAreaView style={styles.container}>
        <View style={{flex: 0.5, width: windowWidth, height: windowHeight / 20, flexDirection: 'row', justifyContent: 'center'}}>
          <View style={{width: windowWidth / 2 - 30, height: windowWidth / 2 - 30, backgroundColor: 'white', borderColor: 'grey', borderWidth: 5, borderRadius: 20, marginHorizontal: 10, alignSelf: 'center'}}>
            <Text style={{textAlign: 'center', fontWeight: 'bold', fontSize: 25}}>Scores</Text>
            <ScrollView>
              <Text style={{fontSize: 25, marginLeft: 20}}>{scoresArray}</Text>
            </ScrollView>
          </View> 
          <View style={{width: windowWidth / 2 - 30, height: windowWidth / 2 - 30, backgroundColor: 'white', borderColor: 'grey', borderWidth: 5, borderRadius: 20, marginHorizontal: 10, alignSelf: 'center'}}>
          <Text style={{textAlign: 'center', fontWeight: 'bold', fontSize: 25}}>High Score</Text>
            <Text style={{textAlign: 'center', fontSize: 40, fontWeight: 'bold'}}>{highScore}</Text> 
          </View>      
        </View>
        <View style={{flex: 1}}>
          <Image
          style={{height: windowHeight / 2 - 80, width: windowWidth / 1.08}}
          source={require('./assets/sonic-gameover.png')}
          resizeMode='cover'
          />
        </View>
        <View style={{position: 'absolute', justifyContent: 'center', backgroundColor: 'white', opacity: 0.8, borderColor: 'black', borderWidth: 5, width: windowWidth - 60, height: windowHeight / 8, top: windowHeight / 1.2, borderRadius: 30}}>
          <TouchableOpacity style={{width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center'}} onPress={() => resetGame()}>
            <Text style={{fontWeight: 'bold', fontSize: 50, textAlign: 'center', color: 'black'}}>Restart</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }
  else if (view == "homeScreen"){
    return (
      <View style={styles.container}>
        <ImageBackground
          source={require('./assets/sonicBackgroundImage.jpg')}
          style={{
            resizeMode: 'cover',
            height: windowHeight,
            width: windowWidth,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View style={{position: 'absolute', justifyContent: 'center', backgroundColor: 'white', borderColor: 'black', borderWidth: 5, width: windowWidth - 60, height: windowHeight / 8, top: windowHeight / 1.2, borderRadius: 30}}>
            <TouchableOpacity style={{width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center'}} onPress={() => setView("game")}>
              <Text style={{fontWeight: 'bold', fontSize: 50, textAlign: 'center', color: 'black'}}>Start</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
        
      </View>
    )
  }
  else if (view == "game"){
    return (
      <ImageBackground 
      style={{height: windowHeight, width: windowWidth}}
      source={require('./assets/sonicGameBackground.png')}
      resizeMode='cover'
      >
        <StatusBar style="auto" 
        />
        <View style={{flex: 1, flexDirection: 'row', width: windowWidth}}>
  
          <View style={{position: 'absolute'}}>
            <Sonic_Ring sonic={LEFT} gameOver={gameOver} sonicToApp={() => sonicToApp()} pointUpdate={() => pointUpdate()}></Sonic_Ring>
          </View>
          <View style={{position: 'absolute'}}>
            <Sonic_Ring sonic={LEFT} gameOver={gameOver} sonicToApp={() => sonicToApp()} pointUpdate={() => pointUpdate()}></Sonic_Ring>
          </View>
          <View style={{position: 'absolute'}}>
            <Sonic_Ring sonic={LEFT} gameOver={gameOver} sonicToApp={() => sonicToApp()} pointUpdate={() => pointUpdate()}></Sonic_Ring>
          </View>
          <View style={{position: 'absolute'}}>
            <Sonic_Ring sonic={LEFT} gameOver={gameOver} sonicToApp={() => sonicToApp()} pointUpdate={() => pointUpdate()}></Sonic_Ring>
          </View>
          <View style={{position: 'absolute'}}>
            <Sonic_Ring sonic={LEFT} gameOver={gameOver} sonicToApp={() => sonicToApp()} pointUpdate={() => pointUpdate()}></Sonic_Ring>
          </View>
          <View style={{position: 'absolute'}}>
            <Sonic_Ring sonic={LEFT} gameOver={gameOver} sonicToApp={() => sonicToApp()} pointUpdate={() => pointUpdate()}></Sonic_Ring>
          </View>
  
        </View>
        <View style={{flex: 4}}></View>
        <View
          style={{
            flex: 1,
            position: "absolute",
            justifyContent: "flex-end",
            bottom: 40,
            backgroundColor: 'orange',
            borderRadius: 20,
            right: 0,
            left: LEFT,
            right: Math.abs(windowWidth - LEFT)
          }}
        >
          <Image
            source={sonicGif}
            style={{
              resizeMode: 'stretch',
              height: 50,
              width: 50,
              alignItems: "center",
              justifyContent: "center",
            }}
          />
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
});
