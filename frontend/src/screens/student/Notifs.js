import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { getUser } from '../../services/auth';
import { getNotifs } from '../../services/api';
import { Colors } from '../../constants/colors';

export default function NotifScreen(){
    const [notifs, setNotifs]   = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{ loadNotifs(); }, []);

    const loadNotifs = async () => {
        const user = await getUser();
        if(user){
            try {
                const data = await getNotifs(user.niveau);
                setNotifs(Array.isArray(data) ? data : []);
            } catch(e){}
        }
        setLoading(false);
    };

    return (
        <ScrollView style={styles.container}
            refreshControl={<RefreshControl refreshing={loading} onRefresh={loadNotifs} />}
        >
            <View style={styles.header}>
                <Text style={styles.title}>🔔 Notifications</Text>
                <Text style={styles.subtitle}>{notifs.length} message(s)</Text>
            </View>

            {notifs.length === 0 ? (
                <View style={styles.empty}>
                    <Text style={styles.emptyIcon}>🔕</Text>
                    <Text style={styles.emptyTxt}>Aucune notification pour le moment</Text>
                </View>
            ) : (
                notifs.map((n, i) => (
                    <View key={i} style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.titre}>{n.titre}</Text>
                            <Text style={styles.date}>{n.created_at?.split(' ')[0]}</Text>
                        </View>
                        <Text style={styles.message}>{n.message}</Text>
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
    subtitle   : { fontSize:13, color:'rgba(255,255,255,0.8)', marginTop:4 },
    empty      : { alignItems:'center', padding:60 },
    emptyIcon  : { fontSize:50, marginBottom:15 },
    emptyTxt   : { fontSize:16, color: Colors.gray },
    card       : { backgroundColor:'white', borderRadius:12, margin:10, marginVertical:5, padding:15, borderLeftWidth:4, borderLeftColor: Colors.primary, elevation:2 },
    cardHeader : { flexDirection:'row', justifyContent:'space-between', marginBottom:8 },
    titre      : { fontSize:15, fontWeight:'bold', color: Colors.text, flex:1 },
    date       : { fontSize:11, color: Colors.gray },
    message    : { fontSize:14, color: Colors.gray, lineHeight:20 },
});