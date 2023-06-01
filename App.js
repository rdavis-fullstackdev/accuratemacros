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
    activityLevel: 1, // 1=sedentary 1.2; 2=light activity 1.375; 3)moderate activity 1.55; 4)very active 1.725; 5)extra active
    goal: 1, // 1)lose weight 2)maintain weight 3)gain weight
    proteinRequired: 1.0, // higher bodyfat % 0.7; Lose 10-20 lbs 0.8; Lean but add more muscle 1.0; Build muscle 1-1.2
    fatLoss:0.5, // extreme fat loss 0.2; want to lose weight 0.3 - 0.35; maintain weight 0.4 - 0.45; build muscle 0.5 - 0.55
    macrosKey: [{'macro': 'protein', 'caloriesPerGram': 4}, 
                {'macro': 'carbs', 'caloriesPerGram': 4},
                {'macro': 'fat', 'caloriesPerGram': 9}],
  }
                          
  const [macrosInfo, setmacrosInfo] = useState(initialState);
  
  console.table(macrosInfo);
  
  const calcBMR = () => {
    //return 9.99 * macrosInfo.weight + 6.25 * macrosInfo.height - 4.92 * macrosInfo.age + 166;
    return Math.ceil(Math.round((447.6 + (9.2 * macrosInfo.weight) + (3.1 * macrosInfo.height * 2.54) - (4.3 * macrosInfo.age)) * 10)/10);
  }
  
  const calcProtein = () => {
    console.log(`calcProtein: ${(macrosInfo.weight * macrosInfo.proteinRequired)} Cals/gram: ${macrosInfo.macrosKey[0].caloriesPerGram}`)
    let proteinMultiplier = 1.0;
     // higher bodyfat % 0.7; Lose 10-20 lbs 0.8; Lean but add more muscle 1.0; Build muscle 1-1.2
    // switch(macrosInfo.proteinRequired){
    //   case 0.7:
    //   case 0.8:
    //   case 1.0:
    // }
    
    return Math.ceil(Math.round((macrosInfo.weight * macrosInfo.proteinRequired) * macrosInfo.macrosKey[0].caloriesPerGram * 10)/10);
  }
  
  const calcFat = () => {
    //console.log(`calcFat: BMR=${calcBMR()} Cal Deficit=${macrosInfo.calorieDeficit} FatLoss=${macrosInfo.fatLoss} Fat=${calcFat()} Cals/gram: ${macrosInfo.macrosKey[2].caloriesPerGram}`)
    //console.log(`calcFat: BMR=${calcBMR()} Cal Deficit=${macrosInfo.calorieDeficit} FatLoss=${macrosInfo.fatLoss} Cals/gram: ${macrosInfo.macrosKey[2].caloriesPerGram}`)
    const caloriesPerDay = calcBMR() - macrosInfo.calorieDeficit;
    //console.log(`calcFat caloriesPerDay: ${caloriesPerDay}`);
    const fatLossGoal = caloriesPerDay * macrosInfo.fatLoss;
    //console.log(`calcFat fatLossGoal: ${fatLossGoal}`)
    const caloriesPerGram = macrosInfo.macrosKey[2].caloriesPerGram;
    //console.log(`calcFat Step 3: ${caloriesPerGram}`)
    const fatGrams = Math.ceil(Math.round((fatLossGoal / caloriesPerGram) * 10)/10);
    console.log(`calcFat fatGrams: ${fatGrams}`);
    return fatGrams;
  }
  
  const calcCarbs = () => {
    console.log(`calcCarbs: BMR=${calcBMR()} Cal Deficit=${macrosInfo.calorieDeficit} Protein=${calcProtein()} Fat=${calcFat()} Cals/gram: ${macrosInfo.macrosKey[1].caloriesPerGram}`)
    return Math.ceil(Math.round(((calcBMR() - macrosInfo.calorieDeficit - calcProtein() - calcFat()) / macrosInfo.macrosKey[1].caloriesPerGram)*10)/10);
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
      <Text style={styles.basicText}>BMR: {calcBMR()}</Text>
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
