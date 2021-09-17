import React, { useState, setState, useEffect } from 'react';
import {Text, View, Button, TextInput, StyleSheet } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

import firebase from 'firebase/app'
import "firebase/database"
import "firebase/firestore"

import XMLHttpRequest from 'xhr2'

import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

const Stack = createNativeStackNavigator();

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
    let foodName = '';

    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [text, setText] = useState('Not yet scanned')

    // params for search query
    const params = {
        api_key: "XBwGjHHbxdHo5vHqUehrGIKh1k5mgo27txZJeifS",
        query: text,
        dataType: ["Branded"],
        pagesize: 1
    }

    const api_url = 
    `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${encodeURIComponent(params.api_key)}&query=${encodeURIComponent(params.query)}&dataType=${encodeURIComponent(params.dataType)}&pagesize=${encodeURIComponent(1)}`
    

    function LoginScreen({ navigation }) {
      return(
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Button title="Login" onPress={() => navigation.push('Main Menu')} />
        </View>
      );
    }


    function MainMenu({ navigation }) {
      return(
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-evenly' }}>
          <Button title="Camera Screen" onPress={() => navigation.push('Open Camera')} />
          <Button title="View Ingredients" onPress={() => navigation.navigate('Saved Ingredients')} />
        </View>
      );
    }


    function CameraScreen({ navigation }) {
      const askForCameraPermission = () => {
        (async () => {
          const { status } = await BarCodeScanner.requestPermissionsAsync();
          setHasPermission(status === 'granted');
        })()
      }
    
      // Request Camera Permission
      useEffect(() => {
        askForCameraPermission();
      }, []);
    
      // What happens when we scan the bar code
      const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        setText(data);
        getFDCData();
        console.log('Type: ' + type + '\nData: ' + data)
      };
    
      // Check permissions and return the screens
      if (hasPermission === null) {
        return (
          <View style={styles.container}>
            <Text>Requesting for camera permission</Text>
          </View>)
      }
      if (hasPermission === false) {
        return (
          <View style={styles.container}>
            <Text style={{ margin: 10 }}>No access to camera</Text>
            <Button title={'Allow Camera'} onPress={() => askForCameraPermission()} />
          </View>)
      }
    
      // Return the View
      return (
        <View style={styles.container}>
          <View style={styles.barcodebox}>
            <BarCodeScanner
              onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
              style={{ height: 400, width: 400 }} />
          </View>
          <Text style={styles.maintext}>{text}</Text>
        
          {scanned && <Button title={'Scan again?'} onPress={() => setScanned(false)} color='tomato' />}
        </View>
      );
    }


    function IngredientsScreen({ navigation }) {
      var ingrObj = {}
      ingrObj = getFirebaseData();
      for (var key of Object.keys(ingrObj)) {
        console.log(key + ': ' + ingrObj[key])
      }
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-evenly' }}>
        </View>
      );
    }


    function storeData(name, calories) {
      firebase
        .database()
        .ref('ingredients/' + name)
        .set({
          calories: calories
        });
    }


    function getFirebaseData() {
      var output = {}
      firebase.database()
      .ref('ingredients/')
      .on('value', function (snapshot) {
        var ingrJSON = snapshot.toJSON()
        for (var key of Object.keys(ingrJSON)) {
          output[key] = ingrJSON[key].calories
        }
      });
      return output;
    }


    async function getFDCData() {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', api_url);

         xhr.onload = (response) => {
          const data = JSON.parse(xhr.response);
          numCalories = data.foods[0].foodNutrients[3].value;
          foodName = data.foods[0].description;
          
          storeData(foodName, numCalories)

          setIngr('');
        };

        xhr.send();
    }


  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login Screen" component={LoginScreen} />
        <Stack.Screen name="Main Menu" component={MainMenu} />
        <Stack.Screen name="Camera Screen" component={CameraScreen} />
        <Stack.Screen name="Saved Ingredients" component={IngredientsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold"
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  maintext: {
    fontSize: 16,
    margin: 20,
  },
  barcodebox: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
    width: 300,
    overflow: 'hidden',
    borderRadius: 30,
    backgroundColor: 'tomato'
  },
});

export default App;
