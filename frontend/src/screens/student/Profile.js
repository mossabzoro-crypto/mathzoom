import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { getUser, logout } from '../../services/auth';
import { Colors } from '../../constants/colors';

export default function ProfileScreen({ navigation }){
    const [user, setUser] = useState(null);

    useEffect(()=>{
        getUser().then(setUser);
    }, []);

    const handleLogout = () => {
        Alert.alert('Déconnexion', 'Voulez-vous vous déconnecter ?', [
            { text: 'Annuler', style: 'cancel' },
            { text: 'Déconnecter', style: 'destructive', onPress: async () => {
                await logout();
                navigation.replace('Login');
            }}
        ]);
    };

    if(!user) return null;

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarTxt}>
                        {user.prenom ? user.prenom[0].toUpperCase() : '?'}
                    </Text>
                </View>
                <Text style={styles.name}>{user.prenom} {user.nom}</Text>
                <Text style={styles.niveau}>{user.niveau}</Text>
            </View>

            <View style={styles.infoSection}>
                {[
                    { label:'📧 Email',    value: user.email || 'Non défini' },
                    { label:'🎓 Niveau',   value: user.niveau || 'Non défini' },
                    { label:'🔑 Code',     value: user.username || '-' },
                    { label:'💳 Paiement', value: user.paiement_statut === 'payé' ? '✅ Payé' : '❌ Non Payé' },
                ].map((item, i) => (
                    <View key={i} style={styles.infoRow}>
                        <Text style={styles.infoLabel}>{item.label}</Text>
                        <Text style={styles.infoValue}>{item.value}</Text>
                    </View>
                ))}
            </View>

            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                <Text style={styles.logoutTxt}>🚪 Se Déconnecter</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container   : { flex:1, backgroundColor: Colors.background },
    header      : { backgroundColor: Colors.primary, padding:30, paddingTop:60, alignItems:'center' },
    avatar      : { width:80, height:80, borderRadius:40, backgroundColor:'rgba(255,255,255,0.3)', justifyContent:'center', alignItems:'center', marginBottom:12 },
    avatarTxt   : { fontSize:36, fontWeight:'bold', color:'white' },
    name        : { fontSize:22, fontWeight:'bold', color:'white' },
    niveau      : { fontSize:14, color:'rgba(255,255,255,0.8)', marginTop:4 },
    infoSection : { backgroundColor:'white', margin:15, borderRadius:15, elevation:3 },
    infoRow     : { flexDirection:'row', justifyContent:'space-between', padding:16, borderBottomWidth:1, borderBottomColor: Colors.lightGray },
    infoLabel   : { fontSize:14, color: Colors.gray, fontWeight:'600' },
    infoValue   : { fontSize:14, color: Colors.text, fontWeight:'500' },
    logoutBtn   : { backgroundColor: Colors.danger, margin:15, padding:16, borderRadius:12, alignItems:'center' },
    logoutTxt   : { color:'white', fontWeight:'bold', fontSize:16 },
});