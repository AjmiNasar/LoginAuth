import React, {useContext,useEffect} from 'react';
import {Text, View} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import {AuthContext} from '../context/AuthContext';
import SplashScreen from '../screens/SplashScreen';

const Stack = createNativeStackNavigator();

const Navigation = () => {
  const {userToken, setUserToken,splashLoading} = useContext(AuthContext);
  // useEffect(() => {
  //   // Function to load user token from AsyncStorage on app startup
  //   const loadUserToken = async () => {
  //     try {
  //       const token = await AsyncStorage.getItem('userToken');
  //       if (token) {
  //         setUserToken(token);
  //       }
  //     } catch (error) {
  //       console.error('Error loading user token:', error);
  //     }
  //   };

  //   loadUserToken(); // Call the function
  // }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {splashLoading ? (
          <Stack.Screen
            name="Splash Screen"
            component={SplashScreen}
            options={{headerShown: false}}
          />
        ) : userToken ? (
          <Stack.Screen name="Home" component={HomeScreen} />
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{headerShown: false}}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;