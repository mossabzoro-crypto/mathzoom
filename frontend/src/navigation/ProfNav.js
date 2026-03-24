import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { Colors } from '../constants/colors';

import DashboardScreen    from '../screens/professor/Dashboard';
import StudentsScreen     from '../screens/professor/Students';
import EmploiManageScreen from '../screens/professor/Emploi';
import PDFManageScreen    from '../screens/professor/PDF';
import SendNotifScreen    from '../screens/professor/Notifs';

const Tab = createBottomTabNavigator();

export default function ProfNav(){
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
                tabBarIcon: ({ focused }) => {
                    const icons = {
                        Dashboard : '📊',
                        Étudiants : '👨‍🎓',
                        Emploi    : '📅',
                        Cours     : '📚',
                        Notifs    : '📢',
                    };
                    return <Text style={{ fontSize: focused ? 24 : 20 }}>{icons[route.name]}</Text>;
                },
            })}
        >
            <Tab.Screen name="Dashboard" component={DashboardScreen} />
            <Tab.Screen name="Étudiants" component={StudentsScreen} />
            <Tab.Screen name="Emploi"    component={EmploiManageScreen} />
            <Tab.Screen name="Cours"     component={PDFManageScreen} />
            <Tab.Screen name="Notifs"    component={SendNotifScreen} />
        </Tab.Navigator>
    );
}