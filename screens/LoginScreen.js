import React, {useContext, useState} from 'react';
import {
  Button,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  View,
  StyleSheet,
  Keyboard,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import {AuthContext} from '../context/AuthContext';

const LoginScreen = ({navigation}) => {
  const [username, setUsername ] = useState("")
  const [Password, setPassword ] = useState("")
  const [schoolid, setSchoolid ] = useState("")
  const {isLoading, login} = useContext(AuthContext);
 
 
    const dismissKeyboard = () => {
      Keyboard.dismiss();
    }

    
    const [errors, setErrors ] = useState({})
   

    const validateForm = ()=>{
      let errors= {};

      if(!username) errors.username = "username is required";
      if(!Password) errors.Password = "password is required";
      if(!schoolid) errors.schoolid = "School-id is required";

      setErrors(errors);

      return Object.keys(errors).length ===0;

    };

    const handleSubmit = ()=>{
      if (validateForm()) {
         login(username,Password,schoolid);
        // console.log("Submitted", username, Password, schoolid);
        setUsername("");
        setPassword("");
        setSchoolid("");
        setErrors({});
      
      }
    }

  return (
   
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
    <KeyboardAvoidingView behavior= "padding" style={styles.container}>
    

      <View style={styles.form}>
      <Spinner visible={isLoading} />

        <Text style= {styles.label}>login</Text>
       
        <TextInput style= {styles.input} placeholder='Username' value={username} onChangeText={text => setUsername(text)}/>

        {
          errors.username ? <Text style= {styles.errorText}>{errors.username}</Text> : null
        }
    
        <TextInput style= {styles.input} placeholder='Password' secureTextEntry value={Password} onChangeText={text=>setPassword(text)}/>

        {
          errors.Password ? <Text style= {styles.errorText}>{errors.Password}</Text> : null
        }
        <TextInput style= {styles.input} placeholder='schoolid' secureTextEntry value={schoolid} onChangeText={text=>setSchoolid(text)}/>

        {
          errors.Password ? <Text style= {styles.errorText}>{errors.schoolid}</Text> : null
        }
        
        <Button title='Submit'  onPress= {handleSubmit}/>
     </View>
     </KeyboardAvoidingView>
     </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  form: {
    backgroundColor: 'white',
    padding: 20,
    height: 400,
    width:300 ,
    marginLeft: 25,
    borderRadius: 10,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 20
    },
    shadowOpacity: 0.25,
    shadowRadius:4,
    elevation: 5
  },
  label: {
    marginTop:30,
    marginLeft:95,
    fontSize: 30,
    marginBottom: 50,
    fontWeight: "bold",
    color: "#F98B88"
  },
  input: {
    height:40,
    width:250,
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
    borderRadius: 30,
    shadowOpacity: 0.25,
    shadowRadius:4,
    shadowColor: "black",
    marginLeft: 0
   
  },

  errorText: {
    color: "red",
    marginBottom: 10
  }
});
export default LoginScreen;


