import React, { useState, useEffect, Component } from "react";
import {View, Animated, StyleSheet, Dimensions, Image} from 'react-native';
import { Accelerometer } from "expo-sensors";

export default function Sonic_Ring({sonic, sonicToApp, gameOver, pointUpdate}){
  const [Coin1, setCoin1] = useState({top: 40, left: 0})
  const [Mounted, setMounted] = useState(false);
  const [Coin1Speed, setCoin1Speed] = useState(0);
  
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;

  useEffect(() => {
    let temp = Coin1;
    temp.left = Math.floor(Math.random() * (windowWidth - 80)) + 20;
    setCoin1(temp);
    setMounted(true)
    setCoin1Speed(Math.floor(Math.random() * (6)) + 2);
  }, [])

  function round(n) {
    if (!n) {
      return 0;
    }
    return Math.floor(n * 100) / 100;
  }

  function checkGameOver (temp) {
    if (temp.top > windowHeight - 40){
      sonicToApp(true);
    }
  }

  function checkPointUpdate(){
    pointUpdate();
  }

  useEffect(() => {
    let interval = 0;
    if (Mounted && !gameOver){
      interval = setInterval(() => {
        let temp = Coin1;
        temp.top = temp.top + 1 * Coin1Speed;
        if (temp.top > windowHeight - 130 && temp.top < windowHeight - 40 && temp.left + 25 >= sonic - 20 && temp.left - 25 <= sonic + 20){
          temp.top = 40;
          checkPointUpdate();
          temp.left = Math.floor(Math.random() * (windowWidth - 80)) + 20;
          setCoin1(temp)
          setCoin1Speed(Math.floor(Math.random() * (4)) + 1);
        }
        checkGameOver(temp);
        setCoin1(temp)
      }, 1);
    }
    else{
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  })

  return (
    <View style={styles.container}>
      <View style={{top: Coin1.top, left: Coin1.left, position: 'absolute', alignItems: 'flex-start'}}>
        <Image
        source={require('./assets/sonic_ring.png')}
        style={{height: 50, width: 50}}
        />
      </View>
    </View>
  );
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});