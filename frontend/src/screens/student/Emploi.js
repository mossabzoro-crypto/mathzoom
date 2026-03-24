import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Linking } from 'react-native';
import { getUser } from '../../services/auth';
import { getEmplois } from '../../services/api';
import { Colors } from '../../constants/colors';

export default function EmploiScreen(){
    const [emplois, setEmplois] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter]   = useState('tous');

    useEffect(()=>{ loadEmplois(); }, []);

    const loadEmplois = async () => {
        const user = await getUser();
        if(user){
            try {
                const data = await getEmplois(user.niveau);
                setEmplois(Array.isArray(data) ? data : []);
            } catch(e){}
        }
        setLoading(false);
    };

    const filtered = filter === 'tous' ? emplois : emplois.filter(e => e.type === filter);

    return (
        <ScrollView style={styles.container}
            refreshControl={<RefreshControl refreshing={loading} onRefresh={loadEmplois} />}
        >
            <View style={styles.header}>
                <Text style={styles.title}>📅 Emploi du Temps</Text>
            </View>

            {/* Filtres */}
            <View style={styles.filters}>
                {[
                    { key:'tous',       label:'📋 Tous' },
                    { key:'presentiel', label:'🏫 Présentiel' },
                    { key:'distance',   label:'💻 Distance' },
                ].map(f => (
                    <TouchableOpacity
                        key={f.key}
                        style={[styles.filterBtn, filter===f.key && styles.filterActive]}
                        onPress={() => setFilter(f.key)}
                    >
                        <Text style={[styles.filterTxt, filter===f.key && styles.filterTxtActive]}>
                            {f.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Tableau */}
            {filtered.length === 0 ? (
                <View style={styles.empty}>
                    <Text style={styles.emptyTxt}>Aucune séance disponible</Text>
                </View>
            ) : (
                filtered.map((e, i) => (
                    <View key={i} style={styles.card}>
                        <View style={styles.cardLeft}>
                            <Text style={styles.jour}>{e.jour}</Text>
                            <View style={[styles.badge, { backgroundColor: e.type==='distance'?'#e8f4fd':'#e8fdf0' }]}>
                                <Text style={{ fontSize:11, color: e.type==='distance'?Colors.primary:Colors.accent }}>
                                    {e.type === 'distance' ? '💻 Zoom' : '🏫 Présentiel'}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.cardRight}>
                            <Text style={styles.matiere}>{e.matiere}</Text>
                            <Text style={styles.heure}>⏰ {e.heure}</Text>
                            {e.type === 'distance' && e.lien_zoom && (
                                <TouchableOpacity onPress={() => Linking.openURL(e.lien_zoom)}>
                                    <Text style={styles.lienZoom}>🔗 Rejoindre le cours</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                ))
            )}
            <View style={{ height:30 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container  : { flex:1, backgroundColor: Colors.background },
    header     : { backgroundColor: Colors.primary, padding:25, paddingTop:50 },
    title      : { fontSize:22, fontWeight:'bold', color:'white' },
    filters    : { flexDirection:'row', padding:15, gap:10 },
    filterBtn  : { paddingHorizontal:14, paddingVertical:8, borderRadius:20, borderWidth:1.5, borderColor: Colors.primary },
    filterActive:{ backgroundColor: Colors.primary },
    filterTxt  : { fontSize:13, color: Colors.primary, fontWeight:'600' },
    filterTxtActive:{ color:'white' },
    empty      : { padding:40, alignItems:'center' },
    emptyTxt   : { color: Colors.gray, fontSize:16 },
    card       : { backgroundColor:'white', borderRadius:12, margin:10, marginVertical:5, padding:15, flexDirection:'row', elevation:2 },
    cardLeft   : { width:90, marginRight:15, alignItems:'center', justifyContent:'center' },
    jour       : { fontSize:14, fontWeight:'bold', color: Colors.primary, textAlign:'center', marginBottom:8 },
    badge      : { padding:5, borderRadius:8 },
    cardRight  : { flex:1 },
    matiere    : { fontSize:16, fontWeight:'bold', color: Colors.text },
    heure      : { fontSize:13, color: Colors.gray, marginTop:4 },
    lienZoom   : { fontSize:13, color: Colors.primary, marginTop:6, fontWeight:'600' },
});