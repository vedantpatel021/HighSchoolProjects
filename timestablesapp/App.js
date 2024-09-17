/*
TimesTablesPatel

Description: An app to help you practice your times tables from any range.

Author: Vedant Patel

Paragraph Outline: This app randomizes problems to give to the user depending on what range they pick the problems to be from (default is 0 through 12). 
It will give them every variation of the problem from the range they wish to generate from. The only problems occur when they try to generate problems in a range with decimals.
As long as the user picks int values for the range, they should be fine. It also has a slider on the bottom from which the user can select what they think the answer to the problem is. If the
answer is correct, then it will display the word "correct" on the screen, else it will deduct 1 point and display the word "incorrect" and give them another chance at getting the 
question correct. The score will not go in the negatives. So the least possible score is a 0. When they are done with all the possible combinations of numbers from the range, 
it will tell them that it is over and if they want more practice than they can reset 
the problems and generate the problems again from the given range. I also implemented the idea that the high score will be able to go higher if the user chooses a larger range of numbers. 
So in a range of 1-2 the highest possible score is 4, but in a higher such as 1-3, the highest possible score is 9 since there are more problems 
they have to get correct. Though something to keep in mind is that since the app does incorporate a slider, it means large ranges such as 1-100 will be buggy in 
the sense that moving the slider exactly to where you wish will be challenging. Since there is a much larger range for the silder to cover, 
moving side to side the slider to a specific number will be challenging. So a range of 1-20 seems to show to best result for the
range. Its not that the app wont generate the range given, its just that picking the correct answer might be of some challenge. An alternative to a slider would be a text input
perhaps, but I feel that the slider makes the design look a little better because its small and generally works great for most of the practical uses since most people wont
be testing their times tables skills for high numbers.
*/

import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ImageBackground, SafeAreaView, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import Slider from '@react-native-community/slider';


export default function App() {
  const [useBottom, setUseBottom] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  const [useTop, setUseTop] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  const [correct, setCorrect] = useState("Good Luck!");
  const [answerNumber, setAnswerNumber] = useState(0)
  const [indexMemory, setIndexMemory] = useState(0);
  const [currentTop, setCurrentTop] = useState("-");
  const [currentBottom, setCurrentBottom] = useState("-");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [checkButtonStatus, setCheckButtonStatus] = useState("Check!");
  const [lowerBound, setLowerBound] = useState(0);
  const [upperBound, setUpperBound] = useState(12);
  var bottomNumber = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  var topNumber = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  useEffect(() => {
    generateRange()
    setCorrect("Good Luck!")
    setAnswerNumber(0)
    setScore(0)
    setLowerBound(0)
    setUpperBound(12)
    setCheckButtonStatus("Check!")
  }, []);

  function generateRange() {
    let tempLower = parseInt(lowerBound);
    topNumber = [];
    bottomNumber = [];
    for (let i = 0; i < (upperBound - lowerBound + 1); i++){
      for (let j = 0; j < (upperBound - lowerBound + 1); j++){
        topNumber.push(tempLower);
      }
      tempLower++;
    }
    tempLower = parseInt(lowerBound);
    for (let i = 0; i < (upperBound - lowerBound + 1); i++){
      for (let j = 0; j < (upperBound - lowerBound + 1); j++){
        bottomNumber.push(tempLower);
        tempLower++;
      }
      tempLower -= (upperBound - lowerBound + 1)
    }
    tempLower = parseInt(lowerBound);
    setUseTop(topNumber);
    setUseBottom(bottomNumber);
    setScore(0)
    createLists();
  }
  
  function createLists (){
    setCorrect("Good Luck!")
    setIndexMemory(0)
    for (let i = topNumber.length - 1; i > 0; i--) {
      const k = Math.floor(Math.random() * (i + 1));
      const j = Math.floor(Math.random() * (i + 1));
      [topNumber[k], topNumber[j]] = [topNumber[j], topNumber[k]];
      [bottomNumber[k], bottomNumber[j]] = [bottomNumber[j], bottomNumber[k]];
    }
    setUseTop(topNumber)
    setCurrentTop(topNumber[0]);
    setUseBottom(bottomNumber)
    setCurrentBottom(bottomNumber[0]);
  }

  function submitCheck (){
    if (indexMemory < useTop.length - 1){
      if (answerNumber == currentTop * currentBottom){
        var tempIndex = indexMemory;
        setScore(score + 1);
        setIndexMemory(tempIndex + 1);
        setCurrentTop(useTop[tempIndex + 1]);
        setCurrentBottom(useBottom[tempIndex + 1]);
        highScoreCheck();
        setCorrect("Correct");
      }
      else {
        setCorrect("Incorrect");
        if (score - 1 < 0){
          setScore(0);
        }
        else{
          setScore(score - 1);
        }
      }
    }
    else {
      if (answerNumber == currentTop * currentBottom){
        setScore(score + 1)
      }
      else{
        setScore(score - 1)
      }
      highScoreCheck()
      setCorrect("Good Job! Reset to play again!")
    }
  }

  function highScoreCheck (){
    if (score + 1 >= highScore){
      setHighScore(score + 1);
    }
  }

  return (
    <ImageBackground
      source={{ uri: 'https://e7.pngegg.com/pngimages/634/538/png-clipart-creative-background-blackboard-blackboard-chalk.png'}} 
      resizeMode="cover"
      style={styles.backgroundImageStyle}
    >
      <SafeAreaView style={{height: '100%'}}>
        <ScrollView>
          <View style={{alignSelf: 'center'}}>
            <Text style={styles.numberRangeStyle}>
              What is the range for the problems?
            </Text>
            <View style={{flexDirection: 'row', width: '100%', alignSelf: 'center', fontWeight: 'bold'}}>
              <TextInput
                style={styles.input}
                onChangeText={setLowerBound}
                placeholder="Lower Bound"
                keyboardType="numeric"
                placeholderTextColor='black'
              />
              <TextInput
                style={styles.input}
                onChangeText={setUpperBound}
                placeholder="Upper Bound"
                keyboardType="numeric"
                placeholderTextColor='black'
              />
            </View>
            <View>
              <TouchableOpacity
                style={styles.buttonGold}
                onPress={() => {generateRange()}}
              >
                <Text style={styles.buttonCheck}>Generate</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.imageWrapper}>
            <ImageBackground 
            source={{ uri: 'https://b.kisscc0.com/20180813/taq/kisscc0-post-it-note-paper-musical-note-computer-icons-dow-nota-con-sombra-5b71327680f4c5.4056717315341451425282.png' }}
            style={styles.questionsBackground}>
              <Text style={styles.imageText}>Score: {"\n"}{score}</Text>
            </ImageBackground>
            <ImageBackground 
            source={{ uri: 'https://b.kisscc0.com/20180813/taq/kisscc0-post-it-note-paper-musical-note-computer-icons-dow-nota-con-sombra-5b71327680f4c5.4056717315341451425282.png' }}
            style={styles.questionsBackground}>
              <Text style={styles.imageText}>High Score: {"\n"}{highScore}</Text>
            </ImageBackground>
          </View>
          <View>
            <Text style={styles.questions}>{currentTop}</Text>
            <Text style={styles.questions}>X  {currentBottom}</Text>
          </View>
          <View>
            <ImageBackground
            source={{ uri: 'https://pngimg.com/d/ruler_PNG43.png'}}
            style={styles.ruler}>
            </ImageBackground>
            <Text style={styles.questions}>{answerNumber}</Text>
          </View>
          <View>
            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
              <TouchableOpacity
                style={styles.buttonGold}
                onPress={() => {submitCheck()}}
              >
                <Text style={styles.buttonCheck}>{checkButtonStatus}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonGold}
                onPress={() => {generateRange()}}
              >
                <Text style={styles.buttonCheck}>RESET</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.correctStyle}>
            <Text style={styles.resultMessage}>{correct}</Text>
          </View>
          <Slider style={styles.sliderStlye}
            minimumValue={0}
            maximumValue={upperBound*upperBound}
            step={1}
            minimumTrackTintColor="#f9f967"
            maximumTrackTintColor="#000000"
            selectedValue={answerNumber}
            onValueChange={sliderValue => setAnswerNumber(sliderValue)}
          />
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundImageStyle:{
    flex: 1,
    justifyContent: "center",
    width: '100%',
    height: '110%'
  },
  questionsBackground:{
    alignSelf: 'center',
    width: 200,
    height: 200,
    marginHorizontal: -10,
  },
  imageText: {
    fontSize: 15,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 80,
    marginRight: 10,
  },
  numberRangeStyle: {
    fontSize: 20,
    color: '#f9f967',
    fontWeight: 'bold',
    textAlign: 'center',
    alignSelf: 'center',
    marginTop: 15,
  },
  imageWrapper: {
    alignSelf: 'center',
    flexDirection: 'row',
    marginLeft: 10,
  },
  ruler: {
    height: 40,
    width: 300,
    alignSelf: 'center',
  },
  buttonGold: {
    borderWidth:1,
    borderColor:'rgba(0,0,0,0.2)',
    alignItems:'center',
    justifyContent:'center',
    alignSelf: 'center',
    width: 100,
    height: 50,
    backgroundColor:'#f9f967',
    borderRadius:35,
    marginHorizontal: 10,
    marginVertical: 10,
    flexDirection: 'row',
  },
  buttonCheck: {
    fontSize: 15,
    textAlign: 'center',
  },
  numberStyle: {
    flex: 1,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'right',
    fontSize: 50,
  },
  correct: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 30,
  },
  sliderStlye:{
    height: 40,
    width: 350,
    alignSelf: 'center',
  },
  questions:{
    fontWeight: 'bold',
    textAlign: 'right',
    fontSize: 50,
    color: 'white',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 2,
    textShadowColor: 'black',
    marginRight: 50,
  },
  checkResetStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultMessage: {
    fontWeight: 'bold',
    fontSize: 50,
    color: 'white',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 2,
    textShadowColor: 'black',
    textAlign: 'center',
  },
  input: {
    height: 40,
    width: '30%',
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
