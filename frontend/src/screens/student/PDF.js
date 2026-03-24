import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, RefreshControl } from 'react-native';
import { getUser } from '../../services/auth';
import { getPDFs, getDriveLinks } from '../../services/api';
import { Colors } from '../../constants/colors';

export default function PDFScreen(){
    const [pdfs, setPdfs]       = useState([]);
    const [drive, setDrive]     = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab]         = useState('pdf');

    useEffect(()=>{ loadData(); }, []);

    const loadData = async () => {
        const user = await getUser();
        if(user){
            try {
                const p = await getPDFs(user.niveau);
                const d = await getDriveLinks(user.niveau);
                setPdfs(Array.isArray(p) ? p : []);
                setDrive(Array.isArray(d) ? d : []);
            } catch(e){}
        }
        setLoading(false);
    };

    return (
        <ScrollView style={styles.container}
            refreshControl={<RefreshControl refreshing={loading} onRefresh={loadData} />}
        >
            <View style={styles.header}>
                <Text style={styles.title}>📚 Cours & Exercices</Text>
            </View>

            {/* Tabs */}
            <View style={styles.tabs}>
                <TouchableOpacity style={[styles.tab, tab==='pdf' && styles.tabActive]} onPress={()=>setTab('pdf')}>
                    <Text style={[styles.tabTxt, tab==='pdf' && styles.tabTxtActive]}>📄 PDFs</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.tab, tab==='drive' && styles.tabActive]} onPress={()=>setTab('drive')}>
                    <Text style={[styles.tabTxt, tab==='drive' && styles.tabTxtActive]}>📁 Drive</Text>
                </TouchableOpacity>
            </View>

            {tab === 'pdf' && (
                pdfs.length === 0 ? (
                    <Text style={styles.empty}>Aucun PDF disponible</Text>
                ) : (
                    pdfs.map((p, i) => (
                        <TouchableOpacity key={i} style={styles.card}
                            onPress={() => p.lien_drive ? Linking.openURL(p.lien_drive) : null}
                        >
                            <Text style={styles.cardIcon}>
                                {p.type === 'cours' ? '📘' : '📝'}
                            </Text>
                            <View style={styles.cardInfo}>
                                <Text style={styles.cardTitre}>{p.titre}</Text>
                                <View style={[styles.badge, { backgroundColor: p.type==='cours'?'#e8f4fd':'#fdf8e8' }]}>
                                    <Text style={{ fontSize:11, color: p.type==='cours'?Colors.primary:Colors.warning }}>
                                        {p.type === 'cours' ? 'Cours' : 'Exercice'}
                                    </Text>
                                </View>
                            </View>
                            <Text style={styles.arrow}>→</Text>
                        </TouchableOpacity>
                    ))
                )
            )}

            {tab === 'drive' && (
                drive.length === 0 ? (
                    <Text style={styles.empty}>Aucun lien Drive disponible</Text>
                ) : (
                    drive.map((d, i) => (
                        <TouchableOpacity key={i} style={styles.card}
                            onPress={() => Linking.openURL(d.lien)}
                        >
                            <Text style={styles.cardIcon}>📁</Text>
                            <View style={styles.cardInfo}>
                                <Text style={styles.cardTitre}>{d.titre}</Text>
                                <Text style={styles.cardSub}>Google Drive</Text>
                            </View>
                            <Text style={styles.arrow}>→</Text>
                        </TouchableOpacity>
                    ))
                )
            )}

            <View style={{ height:30 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container : { flex:1, backgroundColor: Colors.background },
    header    : { backgroundColor: Colors.primary, padding:25, paddingTop:50 },
    title     : { fontSize:22, fontWeight:'bold', color:'white' },
    tabs      : { flexDirection:'row', margin:15, backgroundColor:'white', borderRadius:12, padding:5, elevation:2 },
    tab       : { flex:1, padding:12, borderRadius:10, alignItems:'center' },
    tabActive : { backgroundColor: Colors.primary },
    tabTxt    : { fontSize:14, fontWeight:'600', color: Colors.gray },
    tabTxtActive: { color:'white' },
    empty     : { textAlign:'center', color: Colors.gray, padding:40, fontSize:16 },
    card      : { backgroundColor:'white', borderRadius:12, margin:10, marginVertical:5, padding:15, flexDirection:'row', alignItems:'center', elevation:2 },
    cardIcon  : { fontSize:28, marginRight:12 },
    cardInfo  : { flex:1 },
    cardTitre : { fontSize:15, fontWeight:'bold', color: Colors.text },
    cardSub   : { fontSize:12, color: Colors.gray, marginTop:3 },
    badge     : { paddingHorizontal:8, paddingVertical:3, borderRadius:8, marginTop:5, alignSelf:'flex-start' },
    arrow     : { fontSize:18, color: Colors.gray },
});