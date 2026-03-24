import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { getUser, logout } from '../../services/auth';
import { getEtudiants } from '../../services/api';
import { Colors } from '../../constants/colors';

export default function DashboardScreen({ navigation }){
    const [user, setUser]         = useState(null);
    const [etudiants, setEtudiants] = useState([]);
    const [loading, setLoading]   = useState(true);

    useEffect(()=>{ loadData(); }, []);

    const loadData = async () => {
        const u = await getUser();
        setUser(u);
        try {
            const data = await getEtudiants();
            setEtudiants(Array.isArray(data) ? data : []);
        } catch(e){}
        setLoading(false);
    };

    const handleLogout = () => {
        Alert.alert('Déconnexion', 'Voulez-vous vous déconnecter ?', [
            { text: 'Annuler', style: 'cancel' },
            { text: 'Déconnecter', style: 'destructive', onPress: async () => {
                await logout();
                navigation.replace('Login');
            }}
        ]);
    };

    const total  = etudiants.length;
    const payes  = etudiants.filter(e => e.paiement_statut === 'payé').length;
    const nonPay = total - payes;

    return (
        <ScrollView style={styles.container}
            refreshControl={<RefreshControl refreshing={loading} onRefresh={loadData} />}
        >
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Bonjour 👋</Text>
                    <Text style={styles.name}>Prof {user?.nom}</Text>
                </View>
                <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
                    <Text>🚪</Text>
                </TouchableOpacity>
            </View>

            {/* Stats */}
            <View style={styles.statsRow}>
                {[
                    { label:'Étudiants', value: total,  color: Colors.primary, icon:'👨‍🎓' },
                    { label:'Payés',     value: payes,  color: Colors.accent,  icon:'✅' },
                    { label:'Non Payés', value: nonPay, color: Colors.danger,  icon:'❌' },
                ].map((s, i) => (
                    <View key={i} style={[styles.statCard, { borderTopColor: s.color }]}>
                        <Text style={styles.statIcon}>{s.icon}</Text>
                        <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
                        <Text style={styles.statLabel}>{s.label}</Text>
                    </View>
                ))}
            </View>

            {/* Derniers inscrits */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>📋 Derniers Étudiants</Text>
                {etudiants.slice(0,5).map((e, i) => (
                    <View key={i} style={styles.etudiantCard}>
                        <View style={styles.etudiantAvatar}>
                            <Text style={styles.avatarTxt}>{e.prenom?.[0]?.toUpperCase()}</Text>
                        </View>
                        <View style={styles.etudiantInfo}>
                            <Text style={styles.etudiantNom}>{e.prenom} {e.nom}</Text>
                            <Text style={styles.etudiantNiveau}>{e.niveau}</Text>
                        </View>
                        <View style={[styles.badge, { backgroundColor: e.paiement_statut==='payé'?'#e8fdf0':'#fde8e8' }]}>
                            <Text style={{ fontSize:11, color: e.paiement_statut==='payé'?Colors.accent:Colors.danger }}>
                                {e.paiement_statut === 'payé' ? '✅ Payé' : '❌ Non Payé'}
                            </Text>
                        </View>
                    </View>
                ))}
            </View>
            <View style={{ height:30 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container      : { flex:1, backgroundColor: Colors.background },
    header         : { backgroundColor: Colors.primary, padding:25, paddingTop:50, flexDirection:'row', justifyContent:'space-between', alignItems:'center' },
    greeting       : { fontSize:14, color:'rgba(255,255,255,0.8)' },
    name           : { fontSize:22, fontWeight:'bold', color:'white' },
    logoutBtn      : { backgroundColor:'rgba(255,255,255,0.2)', padding:12, borderRadius:12 },
    statsRow       : { flexDirection:'row', margin:15, gap:10 },
    statCard       : { flex:1, backgroundColor:'white', borderRadius:12, padding:15, alignItems:'center', borderTopWidth:3, elevation:2 },
    statIcon       : { fontSize:22, marginBottom:5 },
    statValue      : { fontSize:24, fontWeight:'bold' },
    statLabel      : { fontSize:11, color: Colors.gray, marginTop:3 },
    section        : { margin:15, marginTop:5 },
    sectionTitle   : { fontSize:17, fontWeight:'bold', color: Colors.text, marginBottom:12 },
    etudiantCard   : { backgroundColor:'white', borderRadius:12, padding:12, marginBottom:8, flexDirection:'row', alignItems:'center', elevation:2 },
    etudiantAvatar : { width:40, height:40, borderRadius:20, backgroundColor: Colors.primary, justifyContent:'center', alignItems:'center', marginRight:12 },
    avatarTxt      : { color:'white', fontWeight:'bold', fontSize:18 },
    etudiantInfo   : { flex:1 },
    etudiantNom    : { fontSize:15, fontWeight:'bold', color: Colors.text },
    etudiantNiveau : { fontSize:12, color: Colors.gray },
    badge          : { paddingHorizontal:8, paddingVertical:4, borderRadius:8 },
});