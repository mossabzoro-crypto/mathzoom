import React, { useEffect, useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView,
    TouchableOpacity, RefreshControl
} from 'react-native';
import { getUser, logout } from '../../services/auth';
import { getNotifs, getEmplois } from '../../services/api';
import { Colors } from '../../constants/colors';

export default function HomeScreen({ navigation }){
    const [user, setUser]         = useState(null);
    const [notifs, setNotifs]     = useState([]);
    const [emplois, setEmplois]   = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(()=>{
        loadData();
    }, []);

    const loadData = async () => {
        const u = await getUser();
        setUser(u);
        if(u){
            try {
                const n = await getNotifs(u.niveau);
                const e = await getEmplois(u.niveau);
                setNotifs(Array.isArray(n) ? n.slice(0,3) : []);
                setEmplois(Array.isArray(e) ? e : []);
            } catch(err){}
        }
        setRefreshing(false);
    };

    const handleLogout = async () => {
        await logout();
        navigation.replace('Login');
    };

    if(!user) return null;

    return (
        <ScrollView
            style={styles.container}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={()=>{ setRefreshing(true); loadData(); }} />}
        >
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Bonjour 👋</Text>
                    <Text style={styles.name}>{user.prenom} {user.nom}</Text>
                    <Text style={styles.niveau}>📚 {user.niveau}</Text>
                </View>
                <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                    <Text style={styles.logoutTxt}>🚪</Text>
                </TouchableOpacity>
            </View>

            {/* Statut paiement */}
            <View style={[styles.paiementCard, { borderLeftColor: user.paiement_statut === 'payé' ? Colors.accent : Colors.danger }]}>
                <Text style={styles.paiementTitle}>💳 Statut Paiement</Text>
                <Text style={[styles.paiementStatus, { color: user.paiement_statut === 'payé' ? Colors.accent : Colors.danger }]}>
                    {user.paiement_statut === 'payé' ? '✅ Payé' : '❌ Non Payé — Veuillez payer'}
                </Text>
            </View>

            {/* Emploi du temps aujourd'hui */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>📅 Emploi du Temps</Text>
                {emplois.length === 0 ? (
                    <Text style={styles.empty}>Aucune séance disponible</Text>
                ) : (
                    emplois.slice(0,3).map((e, i) => (
                        <View key={i} style={styles.seanceCard}>
                            <Text style={styles.seanceJour}>{e.jour}</Text>
                            <View style={styles.seanceInfo}>
                                <Text style={styles.seanceMatiere}>{e.matiere}</Text>
                                <Text style={styles.seanceHeure}>⏰ {e.heure}</Text>
                                {e.type === 'distance' && e.lien_zoom && (
                                    <Text style={styles.seanceZoom}>🔗 En ligne</Text>
                                )}
                            </View>
                            <View style={[styles.typeBadge, { backgroundColor: e.type==='distance' ? '#e8f4fd' : '#e8fdf0' }]}>
                                <Text style={{ fontSize:12, color: e.type==='distance' ? Colors.primary : Colors.accent }}>
                                    {e.type === 'distance' ? '💻 Zoom' : '🏫 Présentiel'}
                                </Text>
                            </View>
                        </View>
                    ))
                )}
            </View>

            {/* Notifications récentes */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>🔔 Dernières Notifications</Text>
                {notifs.length === 0 ? (
                    <Text style={styles.empty}>Aucune notification</Text>
                ) : (
                    notifs.map((n, i) => (
                        <View key={i} style={styles.notifCard}>
                            <Text style={styles.notifTitre}>{n.titre}</Text>
                            <Text style={styles.notifMsg}>{n.message}</Text>
                            <Text style={styles.notifDate}>{n.created_at?.split(' ')[0]}</Text>
                        </View>
                    ))
                )}
            </View>

            <View style={{ height: 30 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container    : { flex:1, backgroundColor: Colors.background },
    header       : { backgroundColor: Colors.primary, padding:25, paddingTop:50, flexDirection:'row', justifyContent:'space-between', alignItems:'center' },
    greeting     : { fontSize:14, color:'rgba(255,255,255,0.8)' },
    name         : { fontSize:22, fontWeight:'bold', color:'white', marginTop:2 },
    niveau       : { fontSize:13, color:'rgba(255,255,255,0.8)', marginTop:3 },
    logoutBtn    : { backgroundColor:'rgba(255,255,255,0.2)', padding:12, borderRadius:12 },
    logoutTxt    : { fontSize:20 },
    paiementCard : { margin:15, backgroundColor:'white', borderRadius:12, padding:15, borderLeftWidth:4, elevation:3 },
    paiementTitle: { fontSize:14, color: Colors.gray, fontWeight:'600' },
    paiementStatus:{ fontSize:16, fontWeight:'bold', marginTop:5 },
    section      : { margin:15, marginTop:5 },
    sectionTitle : { fontSize:17, fontWeight:'bold', color: Colors.text, marginBottom:12 },
    empty        : { color: Colors.gray, fontSize:14, textAlign:'center', padding:20 },
    seanceCard   : { backgroundColor:'white', borderRadius:12, padding:15, marginBottom:10, flexDirection:'row', alignItems:'center', elevation:2 },
    seanceJour   : { fontSize:13, fontWeight:'bold', color: Colors.primary, width:70 },
    seanceInfo   : { flex:1 },
    seanceMatiere: { fontSize:15, fontWeight:'bold', color: Colors.text },
    seanceHeure  : { fontSize:13, color: Colors.gray, marginTop:2 },
    seanceZoom   : { fontSize:12, color: Colors.primary, marginTop:2 },
    typeBadge    : { padding:6, borderRadius:8 },
    notifCard    : { backgroundColor:'white', borderRadius:12, padding:15, marginBottom:10, borderLeftWidth:3, borderLeftColor: Colors.primary, elevation:2 },
    notifTitre   : { fontSize:15, fontWeight:'bold', color: Colors.text },
    notifMsg     : { fontSize:13, color: Colors.gray, marginTop:4 },
    notifDate    : { fontSize:11, color: Colors.gray, marginTop:6 },
});