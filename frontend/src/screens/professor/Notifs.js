import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { getUser } from '../../services/auth';
import { envoyerNotif } from '../../services/api';
import { Colors } from '../../constants/colors';

const NIVEAUX = ['tous','5ème Primaire','6ème Primaire','1ère Collège','2ème Collège',
                 '3ème Collège','Tronc Commun','1er Bac SE','1er Bac SM','2ème Bac'];

export default function SendNotifScreen(){
    const [titre, setTitre]     = useState('');
    const [message, setMessage] = useState('');
    const [niveau, setNiveau]   = useState('tous');
    const [loading, setLoading] = useState(false);

    const handleEnvoyer = async () => {
        if(!titre || !message){
            Alert.alert('⚠️ Erreur', 'Remplissez le titre et le message');
            return;
        }
        setLoading(true);
        try {
            const user = await getUser();
            const res  = await envoyerNotif(titre, message, niveau, user.id);
            if(res.success){
                Alert.alert('✅ Succès', res.message || 'Notification envoyée !');
                setTitre('');
                setMessage('');
                setNiveau('tous');
            } else {
                Alert.alert('❌ Erreur', res.message);
            }
        } catch(e){
            Alert.alert('❌ Erreur', 'Problème de connexion');
        }
        setLoading(false);
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>📢 Envoyer Notification</Text>
            </View>

            <View style={styles.form}>
                <Text style={styles.label}>Titre</Text>
                <TextInput style={styles.input} placeholder="Ex: Pas de séance aujourd'hui"
                    value={titre} onChangeText={setTitre} />

                <Text style={styles.label}>Message</Text>
                <TextInput style={[styles.input, styles.textarea]}
                    placeholder="Écrivez votre message..."
                    value={message} onChangeText={setMessage}
                    multiline numberOfLines={4} textAlignVertical="top" />

                <Text style={styles.label}>Destinataires</Text>
                <View style={styles.niveauxGrid}>
                    {NIVEAUX.map(n => (
                        <TouchableOpacity key={n}
                            style={[styles.niveauBtn, niveau===n && styles.niveauActive]}
                            onPress={() => setNiveau(n)}
                        >
                            <Text style={[styles.niveauTxt, niveau===n && styles.niveauTxtActive]}>
                                {n === 'tous' ? '📋 Tous' : n}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <TouchableOpacity style={[styles.btn, loading && {opacity:0.7}]}
                    onPress={handleEnvoyer} disabled={loading}>
                    {loading
                        ? <ActivityIndicator color="white" />
                        : <Text style={styles.btnTxt}>📤 Envoyer la notification</Text>
                    }
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container    : { flex:1, backgroundColor: Colors.background },
    header       : { backgroundColor: Colors.primary, padding:25, paddingTop:50 },
    title        : { fontSize:22, fontWeight:'bold', color:'white' },
    form         : { margin:15, backgroundColor:'white', borderRadius:15, padding:20, elevation:3 },
    label        : { fontSize:13, color: Colors.gray, fontWeight:'600', marginBottom:6 },
    input        : { borderWidth:1.5, borderColor: Colors.border, borderRadius:12, padding:13, fontSize:15, marginBottom:16, backgroundColor: Colors.lightGray },
    textarea     : { height:100 },
    niveauxGrid  : { flexDirection:'row', flexWrap:'wrap', gap:8, marginBottom:20 },
    niveauBtn    : { paddingHorizontal:12, paddingVertical:7, borderRadius:20, borderWidth:1.5, borderColor: Colors.primary },
    niveauActive : { backgroundColor: Colors.primary },
    niveauTxt    : { fontSize:12, color: Colors.primary, fontWeight:'600' },
    niveauTxtActive:{ color:'white' },
    btn          : { backgroundColor: Colors.primary, padding:16, borderRadius:12, alignItems:'center' },
    btnTxt       : { color:'white', fontWeight:'bold', fontSize:16 },
});