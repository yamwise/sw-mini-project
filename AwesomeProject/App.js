import React, { useState } from 'react';
import { ScrollView, Text } from 'react-native';

import firebase from 'firebase/app'
import "firebase/database"
import "firebase/firestore"
//import firestore from '@react-native-firebase/firestore';
import { Appbar, TextInput, Button } from 'react-native-paper';

import XMLHttpRequest from 'xhr2'

function App() {
    // firebase credentials
    const firebaseConfig = {
      apiKey: 'AIzaSyAaNsy4kFdXIuz1LUTKcPob1b9hIyDD9js',
      authDomain: 'sw-mini-project-88e60.firebaseapp.com',
      databaseURL: 'https://sw-mini-project-88e60-default-rtdb.firebaseio.com/',
      projectId: 'sw-mini-project-88e60',
      storageBucket: 'sw-mini-project-88e60.appspot.com',
    };

    // check if firebase app already initialized
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    } else {
      firebase.app()
    }

    const [ recipe, setRecipe] = useState('');
    const [ ingr, setIngr ] = useState('');
    let numCalories = 0;

    // params for search query
    const params = {
        api_key: "XBwGjHHbxdHo5vHqUehrGIKh1k5mgo27txZJeifS",
        query: ingr,
        dataType: ["Branded"],
        pagesize: 1
    }

    const api_url = 
    `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${encodeURIComponent(params.api_key)}&query=${encodeURIComponent(params.query)}&dataType=${encodeURIComponent(params.dataType)}&pagesize=${encodeURIComponent(1)}`
    

    function storeData(recipeName, calories) {
      firebase
        .database()
        .ref('recipes/' + recipeName + '/' + ingr)
        .set({
          title: ingr,
          calories: calories
        });
    }


    async function getFDCData() {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', api_url);

         xhr.onload = (response) => {
          const data = JSON.parse(xhr.response);
          numCalories = data.foods[0].foodNutrients[3].value;
          
          storeData(recipe, numCalories)
          
          console.log(`Inputted Ingredient: ${ingr}`)
          console.log(`Calories per Serving (KCAL): ${numCalories}`)

          setIngr('');
        };

        xhr.send();
    }


  return (
    <>
      <Appbar>
        <Appbar.Content title={'FDC API Checker'} />
      </Appbar>
      <ScrollView style={{flex: 1}}>
        <Text>Calorie Checker! Input ingredient name below.</Text>
      </ScrollView>
      <TextInput label={'Enter Recipe Name'} value={recipe} onChangeText={setRecipe} />
      <TextInput label={'Check Ingredient'} value={ingr} onChangeText={setIngr} />
      <Button onPress={() => getFDCData()}>SUBMIT</Button>
    </>
  );
}

export default App;