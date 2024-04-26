import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, {createContext, useEffect, useState} from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [userToken, setUserToken] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [splashLoading, setSplashLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const bcrypt = require('bcryptjs');
 
  const login = async (username, password,schoolid) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('schoolid', schoolid);
    formData.append('disabled',false);
    formData.append('access_token',null);
    
      try {
        const response = await axios.post(
            "https://7c9f-111-92-123-42.ngrok-free.app/login",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data" // Set Content-Type to multipart/form-data for FormData
                }
            }
        );
        const { access_token, token_type } = response.data;
        
        // if (response.status >= 200 && response.status < 300)
        if (response.status == 200) {
          const userToken = response.data.access_token;
          setUserToken(userToken);
          console.log("Login Successful");
          AsyncStorage.setItem('userToken', userToken);
          console.log(response.data);
          setIsLoading(false);
      Loading(false);
      
      }else {
            console.log("Login Failed");
       }
      
    }catch (error) {
          console.error("Login Error:", error);
         }
         setIsLoading(false);
        }
      
  const logout = () => {
    setIsLoading(true);
    setUserToken(null);
    AsyncStorage.removeItem('userToken');
    setIsLoading(false);
  }

  const isLoggedIn = async () => {
    try {
      setSplashLoading(true);
      setIsLoading(true);
      let userToken = await AsyncStorage.getItem('userToken');
      setUserToken(userToken);
      setIsLoading(false);
      setSplashLoading(false);
    } catch (e) {
      setSplashLoading(false);
      console.log(`is logged in error ${e}`);
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        userToken,
        setUserToken,
        splashLoading,
        // register,
        login,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
  };
