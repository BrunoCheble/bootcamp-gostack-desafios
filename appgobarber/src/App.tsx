import 'react-native-gesture-handler';
import React from 'react';
import { View, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Routes from './routes';
import AppProvider from './hooks';

const App: React.FC = () => (
  <NavigationContainer>
    <StatusBar backgroundColor="#312e38" barStyle="light-content" />
    <AppProvider>
      <View style={{ backgroundColor: '#312e38', flex: 1 }}>
        <Routes />
      </View>
    </AppProvider>
  </NavigationContainer>
);
export default App;
