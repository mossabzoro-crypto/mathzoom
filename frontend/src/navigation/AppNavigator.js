import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { getUser } from '../services/auth';
import { Colors } from '../constants/colors';

import PublicScreen     from '../screens/PublicScreen';
import LoginScreen      from '../screens/auth/LoginScreen';
import FirstLoginScreen from '../screens/auth/FirstLoginScreen';
import StudentNav       from './StudentNav';
import ProfNav          from './ProfNav';
import AdminNav         from './AdminNav';

const Stack = createStackNavigator();

export default function AppNavigator(){
    const [user, setUser]       = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        getUser().then(u => {
            setUser(u);
            setLoading(false);
        });
    }, []);

    if(loading){
        return (
            <View style={{ flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'#1a73e8' }}>
                <ActivityIndicator size="large" color="white" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator
                // ✅ Toujours commencer par Public si pas connecté
                initialRouteName={!user ? 'Public' :
                    user.role === 'etudiant'   ? 'Student' :
                    user.role === 'professeur' ? 'Prof'    : 'Admin'}
                screenOptions={{ headerShown: false }}
            >
                {/* ✅ Page publique — toujours disponible */}
                <Stack.Screen
                    name="Public"
                    children={(props) => (
                        <PublicScreen
                            onLogin={() => props.navigation.navigate('Login')}
                        />
                    )}
                />

                {/* Auth */}
                <Stack.Screen name="Login"      component={LoginScreen} />
                <Stack.Screen name="FirstLogin" component={FirstLoginScreen} />

                {/* Espaces connectés */}
                <Stack.Screen name="Student" component={StudentNav} />
                <Stack.Screen name="Prof"    component={ProfNav} />
                <Stack.Screen name="Admin"   component={AdminNav} />

            </Stack.Navigator>
        </NavigationContainer>
    );
}