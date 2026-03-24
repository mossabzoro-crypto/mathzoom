import { registerRootComponent } from 'expo';
import React from 'react';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigator from './src/navigation/AppNavigator';

function App() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <StatusBar barStyle="light-content" backgroundColor="#1a73e8" />
            <AppNavigator />
        </GestureHandlerRootView>
    );
}

registerRootComponent(App);
export default App;