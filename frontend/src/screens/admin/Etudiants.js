import React, { useEffect, useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, RefreshControl,
    TouchableOpacity, Alert, TextInput
} from 'react-native';
import { getEtudiants, bloquerEtudiant, debloquerEtudiant } from '../../services/api';
import { Colors } from '../../constants/colors';

export default function AdminEtudiants(){
    const [etudiants, setEtudiants] = useState([]);
    const [filtered, setFiltered]   = useState([]);
    const [search, setSearch]       = useState('');
    const [loading, setLoading]     = useState(true);

    useEffect(()=>{ loadEtudiants(); }, []);

    useEffect(()=>{
        const q = search.toLowerCase();
        setFiltered(etudiants.filter(e =>
            e.nom?.toLowerCase().includes(q) ||
            e.prenom?.toLowerCase().includes(q) ||
            e.niveau?.toLowerCase().includes(q)
        ));
    }, [search, etudiants]);

    const loadEtudiants = async () => {
        try {
            const data = await getEtudiants();
            setEtudiants(Array.isArray(data) ? data : []);
            setFiltered(Array.isArray(data) ? data : []);
        } catch(e){}
        setLoading(false);
    };

    const toggleAcces = (etudiant) => {
        const action = etudiant.acces_bloque ? 'débloquer' : 'bloquer';
        Alert.alert('Confirmation', `Voulez-vous ${action} ${etudiant.prenom} ${etudiant.nom} ?`, [
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
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>👨‍🎓 Étudiants ({etudiants.length})</Text>
            </View>

            <TextInput style={styles.searchBar}
                placeholder="🔍 Rechercher un étudiant..."
                value={search} onChangeText={setSearch}
            />

            <ScrollView refreshControl={<RefreshControl refreshing={loading} onRefresh={loadEtudiants} />}>
                {filtered.map((e, i) => (
                    <View key={i} style={styles.card}>
                        <View style={[styles.avatar, { backgroundColor: e.acces_bloque ? Colors.danger : Colors.primary }]}>
                            <Text style={styles.avatarTxt}>{e.prenom?.[0]?.toUpperCase()}</Text>
                        </View>
                        <View style={styles.info}>
                            <Text style={styles.nom}>{e.prenom} {e.nom}</Text>
                            <Text style={styles.sub}>{e.niveau}</Text>
                            <Text style={styles.sub}>{e.email}</Text>
                            <View style={styles.badges}>
                                <View style={[styles.badge, { backgroundColor: e.paiement_statut==='payé'?'#e8fdf0':'#fde8e8' }]}>
                                    <Text style={{ fontSize:11, color: e.paiement_statut==='payé'?Colors.accent:Colors.danger }}>
                                        {e.paiement_statut === 'payé' ? '✅ Payé' : '❌ Non Payé'}
                                    </Text>
                                </View>
                                {e.acces_bloque == 1 && (
                                    <View style={[styles.badge, { backgroundColor:'#fde8e8' }]}>
                                        <Text style={{ fontSize:11, color: Colors.danger }}>🚫 Bloqué</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                        <TouchableOpacity
                            style={[styles.actionBtn, { backgroundColor: e.acces_bloque ? '#e8fdf0' : '#fde8e8' }]}
                            onPress={() => toggleAcces(e)}
                        >
                            <Text style={{ fontSize:18 }}>{e.acces_bloque ? '✅' : '🚫'}</Text>
                        </TouchableOpacity>
                    </View>
                ))}
                <View style={{ height:30 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container  : { flex:1, backgroundColor: Colors.background },
    header     : { backgroundColor: Colors.secondary, padding:25, paddingTop:50 },
    title      : { fontSize:22, fontWeight:'bold', color:'white' },
    searchBar  : { margin:15, padding:13, backgroundColor:'white', borderRadius:12, fontSize:15, elevation:2 },
    card       : { backgroundColor:'white', borderRadius:12, margin:10, marginVertical:5, padding:12, flexDirection:'row', alignItems:'center', elevation:2 },
    avatar     : { width:48, height:48, borderRadius:24, justifyContent:'center', alignItems:'center', marginRight:12 },
    avatarTxt  : { color:'white', fontWeight:'bold', fontSize:20 },
    info       : { flex:1 },
    nom        : { fontSize:15, fontWeight:'bold', color: Colors.text },
    sub        : { fontSize:12, color: Colors.gray, marginTop:2 },
    badges     : { flexDirection:'row', gap:6, marginTop:5 },
    badge      : { paddingHorizontal:8, paddingVertical:3, borderRadius:8 },
    actionBtn  : { width:44, height:44, borderRadius:22, justifyContent:'center', alignItems:'center' },
});