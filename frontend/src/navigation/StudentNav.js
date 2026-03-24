import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { Colors } from '../constants/colors';

import HomeScreen    from '../screens/student/Home';
import EmploiScreen  from '../screens/student/Emploi';
import PDFScreen     from '../screens/student/PDF';
import NotifScreen   from '../screens/student/Notifs';
import ProfileScreen from '../screens/student/Profile';

const Tab = createBottomTabNavigator();

export default function StudentNav(){
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: Colors.primary,
                tabBarInactiveTintColor: Colors.gray,
                tabBarStyle: {
                    backgroundColor: Colors.white,
                    borderTopWidth: 1,
                    borderTopColor: Colors.border,
                    paddingBottom: 5,
                    height: 60,
                },
                tabBarIcon: ({ focused, color }) => {
                    const icons = {
                        Accueil  : '🏠',
                        Emploi   : '📅',
                        Cours    : '📚',
                        Notifs   : '🔔',
                        Profil   : '👤',
                    };
                    return <Text style={{ fontSize: focused ? 24 : 20 }}>{icons[route.name]}</Text>;
                },
            })}
        >
            <Tab.Screen name="Accueil" component={HomeScreen} />
            <Tab.Screen name="Emploi"  component={EmploiScreen} />
            <Tab.Screen name="Cours"   component={PDFScreen} />
            <Tab.Screen name="Notifs"  component={NotifScreen} />
            <Tab.Screen name="Profil"  component={ProfileScreen} />
        </Tab.Navigator>
    );
}