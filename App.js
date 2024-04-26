
import React from 'react';
import {StatusBar, Text, View} from 'react-native';
import Navigation from './components/navigation';
import {AuthProvider} from './context/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <StatusBar backgroundColor="#F98B88" />
      <Navigation />
    </AuthProvider>
  );
};

export default App;
