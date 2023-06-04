import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

export default function App() {
  const initialState = {
    sex:'m',
    age:30,
    height:72,
    weight: 150,
    calorieDeficit: 0, // Number of calories to eat less than BMR
    activityLevel: 1, // 1=sedentary 1.2; 2=light activity 1.375; 3)moderate activity 1.55; 4)very active 1.725; 5)extra active 1.9
    goal: 1, // 1)lose weight 2)maintain weight 3)gain weight
    proteinRequired: 1.0, // higher bodyfat % 0.7; Lose 10-20 lbs 0.8; Lean but add more muscle 1.0; Build muscle 1-1.2
    macrosKey: [{'macro': 'protein', 'caloriesPerGram': 4}, 
                {'macro': 'carbs', 'caloriesPerGram': 4},
                {'macro': 'fat', 'caloriesPerGram': 9}],
  }
                          
  const [macrosInfo, setmacrosInfo] = useState(initialState);
  
  //console.table(macrosInfo);
  
  const calcBMR = () => {
    //return 9.99 * macrosInfo.weight + 6.25 * macrosInfo.height - 4.92 * macrosInfo.age + 166;
    return Math.ceil(Math.round((447.6 + (9.2 * macrosInfo.weight) + (3.1 * macrosInfo.height * 2.54) - (4.3 * macrosInfo.age)) * 10)/10);
  }
  
  const adjustedBMR = () => {
    const activityLevelAdjustment = getAdjustedActivityLevel();
    //console.log(`calcBMR: ${calcBMR()} activityLevelAdjustment: ${activityLevelAdjustment} adjustedBMR: ${calcBMR() * activityLevelAdjustment}`);
    return calcBMR() * activityLevelAdjustment;
  }
  
  const getAdjustedActivityLevel = () => {
    //console.log(`activityLevel: ${macrosInfo.activityLevel}`);
    switch (macrosInfo.activityLevel) {
      case '1': { // sedentary
        return 1.2;
      }
      case '2': { // light activity
        return 1.375;
      }
      case '3': { // moderate activity
        return 1.55;
      }
      case '4': { // very active
        return 1.725;
      }
      case '5': { // extra active
        return 1.9;
      }
      default: {
        return 1.0;
      }
    }
  }
  
  const getProteinRequiredMultiplier = () => {
    switch (macrosInfo.goal) {
      case '1': { // lose weight
        return 0.7;
      }
      case '2': { // lose 10-20 lbs
        return 0.8;
      }
      case '3': { // lean but add muscle
        return 1.0;
      }
      case '4': { // build muscle
        return 1.2;
      }
      default: {
        return 0.7;
      }
    }
  }
  
  const calcProtein = () => {
    let proteinMultiplier = getProteinRequiredMultiplier();
    // console.log(`calcProtein: ${(macrosInfo.weight * proteinMultiplier)} Cals/gram: ${macrosInfo.macrosKey[0].caloriesPerGram}`)
    return Math.ceil(Math.round((macrosInfo.weight * proteinMultiplier) * 10)/10);
  }
  
  const getProteinCalories = () => {
    return calcProtein() * macrosInfo.macrosKey[0].caloriesPerGram;
  }
  
  getFatCaloriesMultiplier = () => {
    switch (macrosInfo.goal) {
      case '1': { // lose weight
        console.log(`getFatCaloriesMultiplier: 0.2`)
        return 0.2;
      }
      case '2': { // lose 10-20 lbs
        console.log(`getFatCaloriesMultiplier: 0.325`)
        return 0.325;
      }
      case '3': { // lean but add muscle
        console.log(`getFatCaloriesMultiplier: 0.4`)
        return 0.4;
      }
      case '4': { // build muscle or horomone balance
        console.log(`getFatCaloriesMultiplier: 0.5`)
        return 0.5;
      }
      default: {
        console.log(`getFatCaloriesMultiplier: 0.4`)
        return 0.4;
      }
    }
  }
  
  const calcFat = () => {
    //console.log(`calcFat: BMR=${adjustedBMR()} Cal Deficit=${macrosInfo.calorieDeficit} FatLoss=${getFatCaloriesMultiplier()} Fat=${calcFat()} Cals/gram: ${macrosInfo.macrosKey[2].caloriesPerGram}`)
    const caloriesPerDay = adjustedBMR();
    console.log(`calcFat caloriesPerDay: ${caloriesPerDay}`);
    const fatLossMultiplier = getFatCaloriesMultiplier();
    const fatLossGoal = caloriesPerDay * fatLossMultiplier;
    console.log(`calcFat fatLossGoal: ${fatLossGoal}`)
    const caloriesPerGram = macrosInfo.macrosKey[2].caloriesPerGram;
    //console.log(`calcFat Step 3: ${caloriesPerGram}`)
    const fatGrams = Math.ceil(Math.round((fatLossGoal / caloriesPerGram) * 10)/10);
    console.log(`calcFat fatGrams: ${fatGrams}`);
    return fatGrams;
  }
  
  const getFatCalories = () => {
    return calcFat() * macrosInfo.macrosKey[2].caloriesPerGram;
  }
  
  const calcCarbs = () => {
    //console.log(`calcCarbs: BMR=${adjustedBMR()} Cal Deficit=${macrosInfo.calorieDeficit} Protein=${calcProtein()} Fat=${calcFat()} Cals/gram: ${macrosInfo.macrosKey[1].caloriesPerGram}`)
    return Math.ceil(Math.round(((adjustedBMR() - macrosInfo.calorieDeficit - getProteinCalories() - getFatCalories()) / macrosInfo.macrosKey[1].caloriesPerGram)*10)/10);
  }
  
  const displayMacros = () => {
    return `${calcProtein()}/${calcCarbs()}/${calcFat()}`;
  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Macros Calculator</Text>
      <Text style={styles.basicText}>Sex</Text>
      <TextInput
        style={styles.inp}
        placholder='Enter sex'
        onChangeText={(e) => setmacrosInfo({...macrosInfo, sex: e})}
        value={macrosInfo.sex}
      />
      <Text style={styles.basicText}>Age</Text>
      <TextInput
        style={styles.inp}
        placholder='Enter age'
        onChangeText={(e) => setmacrosInfo({...macrosInfo, age: e})}
        value={macrosInfo.age}
      />
      <Text style={styles.basicText}>Height in Inches</Text>
      <TextInput
        style={styles.inp}
        placholder='Enter height in inches'
        onChangeText={(e) => setmacrosInfo({...macrosInfo, height: e})}
        value={macrosInfo.height}
      />
      <Text style={styles.basicText}>Weight in Lbs</Text>
      <TextInput
        style={styles.inp}
        placholder='Enter weigth in lbs'
        onChangeText={(e) => setmacrosInfo({...macrosInfo, weight: e})}
        value={macrosInfo.weight}
      />
      <Text style={styles.basicText}>Calorie Deficit</Text>
      <TextInput
        style={styles.inp}
        placholder='Enter calorie deficit'
        onChangeText={(e) => setmacrosInfo({...macrosInfo, calorieDeficit: e})}
        value={macrosInfo.calorieDeficit}
      />
      <Text style={styles.basicText}>Activity Level</Text>
      <TextInput
        style={styles.inp}
        placholder='Enter activity level'
        onChangeText={(e) => setmacrosInfo({...macrosInfo, activityLevel: e})}
        value={macrosInfo.activityLevel}
      />
      <Text style={styles.basicText}>Goal</Text>
      <TextInput
        style={styles.inp}
        placholder='Enter goal'
        onChangeText={(e) => setmacrosInfo({...macrosInfo, goal: e})}
        value={macrosInfo.goal}
      />
      <Text style={styles.basicText}>BMR: {adjustedBMR()}</Text>
      <Text style={styles.basicText}>Macros Protein/Carbs/Fat</Text>
      <Text style={styles.basicText}>{displayMacros()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
  },
  titleText: {
    fontFamily: "sans-serif-light",
    fontSize:40
  },
  basicText: {
    fontFamily: "sans-serif-light",
    fontSize:18
  },
  container2: {
    flexDirection:'row',
    justifyContent:'flex-end',
    alignItems:'flex-start'
  },
  inp: {
    height: 32,
    margin: 8,
    borderWidth: 1,
    padding: 4,
  }
});
