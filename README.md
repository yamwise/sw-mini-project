# sw-mini-project
software mini project for ec463 at BU

Demo video: https://youtu.be/VyjkayBrSbQ

The main objective of this project was to learn how to use REST APIs, create our own REST API, and to utilize a cross-platform environment (react-native, expo) to build a mobile application. Other objectives included working effectively using Github and Agile software development strategies.

The application allows a user to enter a recipe name, then returns the number of calories per serving in a food based on its barcode. The app uses the smartphone's camera to scan the barcode and fetch information from the FDC API, which contains information about food items. Using Google Firebase, the information for the recipe and ingredients for the user is stored and can be fetched whenever the user wishes to review their recently scanned foods.

Unfortunately due to time constraints and an unexpected PC wipe, Google Authentication was not incorporated into the app. Ideally, a user would login with their Gmail information, and their recipes would be stored to their individual account, thus allowing multiple users. Displaying the recipes and ingredients in app was also not incorporated for similar reasons, and because the attempted methods resulted in the app crashing. These would be the next steps of the project given more time.

Design Decisions:
We decided to use the expo framework. Expo allows for the easy development of react native applications and quickly implementing changes. In addition, expo comes with a multitude of available libraries. For instance, we used the expo-barcode-scanner library to implement a barcode scanner in app. The user interface was connected using the react-navigation library. 

Challenges:
One of the biggest challenges we faced included missing dependencies which were difficult to resolve. The solution we pursued was to restart with a brand new development environment by wiping and factore resetting the OS. Other challenges we faced included having trouble formatting the API requests, implementing google auth without removing the navigation functionality, and displaying the data store on firebase in the app. 
_____

# Additional Required Dependencies:
Install using ```npm install``` :
- expo-barcode-scanner
- @react-navigation

Install using ```expo install``` :
- firebase

# To Run:
expo start
