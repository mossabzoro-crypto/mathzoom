import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { getUser, logout } from '../../services/auth';
import { getEtudiants, getPaiements } from '../../services/api';
import { Colors } from '../../constants/colors';

export default function AdminDashboard({ navigation }){
    const [stats, setStats]   = useState({ total:0, payes:0, nonPay:0 });
    const [loading, setLoading] = useState(true);

    useEffect(()=>{ loadStats(); }, []);

    const loadStats = async () => {
        try {
            const data = await getEtudiants();
            const etudiants = Array.isArray(data) ? data : [];
            const payes  = etudiants.filter(e => e.paiement_statut === 'payé').length;
            setStats({ total: etudiants.length, payes, nonPay: etudiants.length - payes });
        } catch(e){}
        setLoading(false);
    };

    const handleLogout = () => {
        Alert.alert('Déconnexion', 'Voulez-vous vous déconnecter ?', [
            { text: 'Annuler', style:'cancel' },
            { text: 'Déconnecter', style:'destructive', onPress: async () => {
                await logout();
                navigation.replace('Login');
            }}
        ]);
    };

    return (
        <ScrollView style={styles.container}
            refreshControl={<RefreshControl refreshing={loading} onRefresh={loadStats} />}
        >
            <View style={styles.header}>
                <Text style={styles.title}>⚙️ Administration</Text>
                <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
                    <Text style={{ fontSize:20 }}>🚪</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.statsGrid}>
                {[
                    { label:'Total Étudiants', value: stats.total,  color: Colors.primary, icon:'👨‍🎓' },
                    { label:'Payés',           value: stats.payes,  color: Colors.accent,  icon:'✅' },
                    { label:'Non Payés',       value: stats.nonPay, color: Colors.danger,  icon:'❌' },
                ].map((s, i) => (
                    <View key={i} style={[styles.statCard, { borderTopColor: s.color }]}>
                        <Text style={{ fontSize:28 }}>{s.icon}</Text>
                        <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
                        <Text style={styles.statLabel}>{s.label}</Text>
                    </View>
                ))}
            </View>

            <View style={styles.menuSection}>
                <Text style={styles.sectionTitle}>Navigation rapide</Text>
                {[
                    { icon:'👨‍🎓', label:'Gérer les Étudiants',  tab:'Étudiants' },
                    { icon:'💰', label:'Gérer les Paiements', tab:'Paiements' },
                    { icon:'📅', label:'Emploi du Temps',      tab:'Emploi'    },
                ].map((m, i) => (
                    <View key={i} style={styles.menuCard}>
                        <Text style={styles.menuIcon}>{m.icon}</Text>
                        <Text style={styles.menuLabel}>{m.label}</Text>
                        <Text style={styles.menuArrow}>→</Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container    : { flex:1, backgroundColor: Colors.background },
    header       : { backgroundColor: Colors.secondary, padding:25, paddingTop:50, flexDirection:'row', justifyContent:'space-between', alignItems:'center' },
    title        : { fontSize:22, fontWeight:'bold', color:'white' },
    logoutBtn    : { backgroundColor:'rgba(255,255,255,0.2)', padding:12, borderRadius:12 },
    statsGrid    : { flexDirection:'row', margin:15, gap:10 },
    statCard     : { flex:1, backgroundColor:'white', borderRadius:12, padding:15, alignItems:'center', borderTopWidth:3, elevation:2 },
    statValue    : { fontSize:26, fontWeight:'bold', marginTop:5 },
    statLabel    : { fontSize:11, color: Colors.gray, marginTop:3, textAlign:'center' },
    menuSection  : { margin:15, marginTop:5 },
    sectionTitle : { fontSize:17, fontWeight:'bold', color: Colors.text, marginBottom:12 },
    menuCard     : { backgroundColor:'white', borderRadius:12, padding:16, marginBottom:10, flexDirection:'row', alignItems:'center', elevation:2 },
    menuIcon     : { fontSize:24, marginRight:12 },
    menuLabel    : { flex:1, fontSize:15, fontWeight:'600', color: Colors.text },
    menuArrow    : { fontSize:18, color: Colors.gray },
});