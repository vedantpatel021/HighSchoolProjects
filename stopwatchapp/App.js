import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';

export default function App() {
  const [stopMinute, setStopMinute] = useState("00");
  const [stopSecond, setStopSecond] = useState("00");
  const [stopMs, setStopMs] = useState("000");
  const [deciSeconds, setDeciSeconds] = useState(0);
  const [stopwatchStart, setStopWatchStart] = useState(false);
  const [stopwatchStopState, setStopwatchStopState] = useState("Start");
  const [stopLap, setStopLap] = useState([]);
  const [stopLapCount, setStopLapCount] = useState(1);
  const [stopDate, setStopDate] = useState(0);
  const [timeStopped, setTimeStopped] = useState(0);
 
  useEffect(() => {
    let interval = 0;
    let tempStopDate = Date.now();
    if (stopwatchStart){
      interval = setInterval(() => {
        setDeciSeconds(tempStopDate - stopDate + timeStopped);
        showStopWatch(tempStopDate - stopDate + timeStopped);
      }, 10);
    }
    else{
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [stopwatchStart, deciSeconds]);

  function startStopwatch () {
    if (stopwatchStopState == "Start"){
      setStopwatchStopState("Stop");
      setStopDate(Date.now());
    }
    else{
      setStopwatchStopState("Start");
      setTimeStopped(deciSeconds);
    }
    setStopWatchStart(previousState => !previousState);
  }

  function resetStopwatch () {
    setDeciSeconds(0);
    showStopWatch(0);
    setStopMs("000");
    setStopMinute("00");
    setStopSecond("00");
    setStopLap([]);
    setStopLapCount(1);
    setTimeStopped(0);
    if (stopwatchStart){
      setStopWatchStart(previousState => !previousState);
      if (stopwatchStopState == "Start"){
        setStopwatchStopState("Stop");
      }
      else{
        setStopwatchStopState("Start");
      }
    }
  }

  function showStopWatch (stopwatchTime) {
    let tempStopwatchTime = stopwatchTime;
    if (Math.floor(stopwatchTime / 60000) < 10){
      setStopMinute("0" + Math.floor(stopwatchTime / 60000));
    }
    else{
      setStopMinute(Math.floor(stopwatchTime / 60000));
    }
    stopwatchTime %= 60000;
    if (Math.floor(stopwatchTime / 1000) < 10){
      setStopSecond("0" + Math.floor(stopwatchTime / 1000));
    }
    else{
      setStopSecond(Math.floor(stopwatchTime / 1000));
    }
    stopwatchTime %= 1000;
    if (stopwatchTime < 10){
      setStopMs("00" + stopwatchTime);
    }
    else if (stopwatchTime < 100){
      setStopMs("0" + stopwatchTime);
    }
    else {
      setStopMs(stopwatchTime);
    }
  }

  function lapStopwatch () {
    if (!(stopMs == "000" && stopSecond == "00" & stopMinute == "00")){
      setStopLapCount(stopLapCount + 1);
      setStopLap(stopLap => [stopLap, "Lap " + stopLapCount + ": \t" + stopMinute + " : " + stopSecond + " : " + stopMs + "\n"]);
    }
  }

  return (
    <SafeAreaView style={styles.stopwatchTimer}>

      <View style={{flex: 2, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginHorizontal: 20}}>
        <View style={{padding: 5, flex: 3, alignSelf: 'center'}}>
          <Text style={styles.stopwatchDisplay}>{stopMinute}</Text>
        </View>
        <View style={{flex: 1, alignSelf: 'center'}}>
          <Text style={styles.stopwatchDisplay}> : </Text>
        </View>
        <View style={{padding: 5, flex: 3, alignSelf: 'center'}}>
          <Text style={styles.stopwatchDisplay}> {stopSecond}</Text>
        </View>
        <View style={{flex: 1, alignSelf: 'center'}}>
          <Text style={styles.stopwatchDisplay}>. </Text>
        </View>
        <View style={{padding: 5, flex: 4, alignSelf: 'center'}}>
          <Text style={styles.stopwatchDisplay}>{stopMs}</Text>
        </View>
      </View>

      <View style={styles.checkButtons}>
        <TouchableOpacity
          style={styles.stopwatchButtons}
          onPress={() => {startStopwatch()}}
        >
          <Text style={styles.stopwatchButtonText}>{stopwatchStopState}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.stopwatchButtons}
          onPress={() => {lapStopwatch()}}
        >
          <Text style={styles.stopwatchButtonText}>Lap</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.stopwatchButtons}
          onPress={() => {resetStopwatch()}}
        >
          <Text style={styles.stopwatchButtonText}>Reset</Text>
        </TouchableOpacity>
      </View>

      <View style={{flex: 6}}>
        <View style={[styles.card, styles.shadowProp]}>
          <ScrollView style={{height: '100%'}}>
            <Text style={styles.stopwatchLapScrollView}>{stopLap}</Text>
          </ScrollView>
        </View>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#97B5CC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopwatchTimer: {
    flex: 1,
    backgroundColor: '#ABCBE2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stopwatchDisplay: {
    fontSize: 50,
    textAlign: 'center',
  },
  stopwatchLapScrollView: {
    fontSize: 20,
    fontWeight: '600',
  },
  card: {
    borderRadius: 15,
    paddingVertical: 30,
    paddingHorizontal: 25,
    width: 300,
    height: '95%',
    marginVertical: 10,
    backgroundColor: '#FFF',
  },
  shadowProp: {
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  stopwatchButtons: {
    borderWidth:1,
    borderColor:'rgba(0,0,0,0.2)',
    alignItems:'center',
    alignContent: 'space-between',
    justifyContent:'center',
    width:90,
    height:50,
    backgroundColor:'#5B8DB1',
    borderRadius:15,
    marginHorizontal: 13,
    marginVertical: 10,
  },
  stopwatchButtonText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
  },
  checkButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  }
});