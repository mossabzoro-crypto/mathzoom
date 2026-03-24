import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { Colors } from '../constants/colors';

// ✅ Noms corrects
import AdminDashboard from '../screens/admin/Dashboard';
import AdminEtudiants from '../screens/admin/Etudiants';
import AdminPaiements from '../screens/admin/Paiements';
import AdminEmploi    from '../screens/admin/Emploi';

const Tab = createBottomTabNavigator();

export default function AdminNav(){
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
                        Dashboard  : '📊',
                        Étudiants  : '👨‍🎓',
                        Paiements  : '💰',
                        Emploi     : '📅',
                    };
                    return <Text style={{ fontSize: focused ? 24 : 20 }}>{icons[route.name]}</Text>;
                },
            })}
        >
            <Tab.Screen name="Dashboard" component={AdminDashboard} />
            <Tab.Screen name="Étudiants" component={AdminEtudiants} />
            <Tab.Screen name="Paiements" component={AdminPaiements} />
            <Tab.Screen name="Emploi"    component={AdminEmploi} />
        </Tab.Navigator>
    );
}