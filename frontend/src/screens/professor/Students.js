// StudentsScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { getEtudiants, bloquerEtudiant, debloquerEtudiant } from '../../services/api';
import { Colors } from '../../constants/colors';

export default function StudentsScreen(){
    const [etudiants, setEtudiants] = useState([]);
    const [loading, setLoading]     = useState(true);

    useEffect(()=>{ loadEtudiants(); }, []);

    const loadEtudiants = async () => {
        try {
            const data = await getEtudiants();
            setEtudiants(Array.isArray(data) ? data : []);
        } catch(e){}
        setLoading(false);
    };

    const toggleBloquer = async (etudiant) => {
        const action = etudiant.acces_bloque ? 'débloquer' : 'bloquer';
        Alert.alert('Confirmation', `Voulez-vous ${action} ${etudiant.prenom} ?`, [
            { text: 'Annuler', style:'cancel' },
            { text: 'Confirmer', onPress: async () => {
                etudiant.acces_bloque
                    ? await debloquerEtudiant(etudiant.id)
                    : await bloquerEtudiant(etudiant.id);
                loadEtudiants();
            }}
        ]);
    };

    return (
        <ScrollView style={styles.container}
            refreshControl={<RefreshControl refreshing={loading} onRefresh={loadEtudiants} />}
        >
            <View style={styles.header}>
                <Text style={styles.title}>👨‍🎓 Étudiants ({etudiants.length})</Text>
            </View>
            {etudiants.map((e, i) => (
                <View key={i} style={styles.card}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarTxt}>{e.prenom?.[0]?.toUpperCase()}</Text>
                    </View>
                    <View style={styles.info}>
                        <Text style={styles.nom}>{e.prenom} {e.nom}</Text>
                        <Text style={styles.sub}>{e.niveau} • {e.email}</Text>
                        <Text style={{ fontSize:12, color: e.paiement_statut==='payé'?Colors.accent:Colors.danger }}>
                            {e.paiement_statut === 'payé' ? '✅ Payé' : '❌ Non Payé'}
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={[styles.btn, { backgroundColor: e.acces_bloque?Colors.accent:Colors.danger }]}
                        onPress={() => toggleBloquer(e)}
                    >
                        <Text style={styles.btnTxt}>{e.acces_bloque ? '✅' : '🚫'}</Text>
                    </TouchableOpacity>
                </View>
            ))}
            <View style={{ height:30 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container : { flex:1, backgroundColor: Colors.background },
    header    : { backgroundColor: Colors.primary, padding:25, paddingTop:50 },
    title     : { fontSize:22, fontWeight:'bold', color:'white' },
    card      : { backgroundColor:'white', borderRadius:12, margin:10, marginVertical:5, padding:12, flexDirection:'row', alignItems:'center', elevation:2 },
    avatar    : { width:45, height:45, borderRadius:22, backgroundColor: Colors.primary, justifyContent:'center', alignItems:'center', marginRight:12 },
    avatarTxt : { color:'white', fontWeight:'bold', fontSize:20 },
    info      : { flex:1 },
    nom       : { fontSize:15, fontWeight:'bold', color: Colors.text },
    sub       : { fontSize:12, color: Colors.gray, marginTop:2 },
    btn       : { width:36, height:36, borderRadius:18, justifyContent:'center', alignItems:'center' },
    btnTxt    : { fontSize:16 },
});