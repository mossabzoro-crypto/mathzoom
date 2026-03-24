import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, Alert, ActivityIndicator,
    ScrollView, KeyboardAvoidingView, Platform
} from 'react-native';
import { completerProfil } from '../../services/api';
import { saveUser } from '../../services/auth';
import { Colors } from '../../constants/colors';

const NIVEAUX = ['5ème Primaire','6ème Primaire','1ère Collège','2ème Collège',
                 '3ème Collège','Tronc Commun','1er Bac SE','1er Bac SM','2ème Bac'];

export default function FirstLoginScreen({ route, navigation }){
    const { user } = route.params;
    const [nom, setNom]       = useState('');
    const [prenom, setPrenom] = useState('');
    const [email, setEmail]   = useState('');
    const [niveau, setNiveau] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if(!nom || !prenom || !email || !niveau){
            Alert.alert('⚠️ Erreur', 'Remplissez tous les champs');
            return;
        }
        setLoading(true);
        try {
            const res = await completerProfil(user.id, nom, prenom, email, niveau);
            if(res.success){
                const updatedUser = { ...user, nom, prenom, email, niveau, first_login: 0 };
                await saveUser(updatedUser);
                Alert.alert('✅ Succès', 'Profil complété !', [
                    { text: 'OK', onPress: () => navigation.replace('Student') }
                ]);
            } else {
                Alert.alert('❌ Erreur', res.message);
            }
        } catch(e){
            Alert.alert('❌ Erreur', 'Problème de connexion');
        }
        setLoading(false);
    };

    return (
        <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS==='ios'?'padding':'height'}>
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

                <View style={styles.header}>
                    <Text style={styles.emoji}>👋</Text>
                    <Text style={styles.title}>Bienvenue !</Text>
                    <Text style={styles.subtitle}>Complétez votre profil pour continuer</Text>
                </View>

                <View style={styles.form}>
                    <Text style={styles.label}>Nom</Text>
                    <TextInput style={styles.input} placeholder="Votre nom" value={nom} onChangeText={setNom} />

                    <Text style={styles.label}>Prénom</Text>
                    <TextInput style={styles.input} placeholder="Votre prénom" value={prenom} onChangeText={setPrenom} />

                    <Text style={styles.label}>Email</Text>
                    <TextInput style={styles.input} placeholder="email@gmail.com" value={email}
                        onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />

                    <Text style={styles.label}>Niveau</Text>
                    <View style={styles.niveauxGrid}>
                        {NIVEAUX.map(n => (
                            <TouchableOpacity
                                key={n}
                                style={[styles.niveauBtn, niveau===n && styles.niveauBtnActive]}
                                onPress={() => setNiveau(n)}
                            >
                                <Text style={[styles.niveauTxt, niveau===n && styles.niveauTxtActive]}>
                                    {n}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TouchableOpacity
                        style={[styles.btnSubmit, loading && { opacity:0.7 }]}
                        onPress={handleSubmit}
                        disabled={loading}
                    >
                        {loading
                            ? <ActivityIndicator color="white" />
                            : <Text style={styles.btnTxt}>Enregistrer →</Text>
                        }
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container    : { flexGrow:1, backgroundColor: Colors.background, padding:25 },
    header       : { alignItems:'center', marginTop:40, marginBottom:30 },
    emoji        : { fontSize:50 },
    title        : { fontSize:26, fontWeight:'bold', color: Colors.primary, marginTop:10 },
    subtitle     : { fontSize:14, color: Colors.gray, marginTop:5, textAlign:'center' },
    form         : { backgroundColor:'white', borderRadius:20, padding:25, elevation:5 },
    label        : { fontSize:13, color: Colors.gray, marginBottom:6, fontWeight:'600' },
    input        : { borderWidth:1.5, borderColor: Colors.border, borderRadius:12, padding:13, fontSize:15, marginBottom:16, backgroundColor: Colors.lightGray },
    niveauxGrid  : { flexDirection:'row', flexWrap:'wrap', gap:8, marginBottom:20 },
    niveauBtn    : { paddingHorizontal:12, paddingVertical:8, borderRadius:20, borderWidth:1.5, borderColor: Colors.primary },
    niveauBtnActive: { backgroundColor: Colors.primary },
    niveauTxt    : { fontSize:12, color: Colors.primary, fontWeight:'600' },
    niveauTxtActive: { color:'white' },
    btnSubmit    : { backgroundColor: Colors.primary, padding:16, borderRadius:12, alignItems:'center' },
    btnTxt       : { color:'white', fontWeight:'bold', fontSize:16 },
});