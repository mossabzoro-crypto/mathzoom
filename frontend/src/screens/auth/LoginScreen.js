import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, Alert, ActivityIndicator,
    KeyboardAvoidingView, Platform, ScrollView
} from 'react-native';
import { loginEtudiant, loginProf } from '../../services/api';
import { saveUser } from '../../services/auth';
import { Colors } from '../../constants/colors';

export default function LoginScreen({ navigation }){
    const [role, setRole]       = useState('etudiant');
    const [field1, setField1]   = useState('');
    const [field2, setField2]   = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if(!field1 || !field2){
            Alert.alert('⚠️ Erreur', 'Remplissez tous les champs');
            return;
        }
        setLoading(true);
        try {
            let res;
            if(role === 'etudiant'){
                res = await loginEtudiant(field1, field2);
            } else {
                res = await loginProf(field1, field2);
            }

            if(res.success){
                await saveUser(res.user);
                if(res.first_login){
                    navigation.replace('FirstLogin', { user: res.user });
                } else {
                    navigation.replace(
                        res.user.role === 'professeur' ? 'Prof' :
                        res.user.role === 'admin'      ? 'Admin' : 'Student'
                    );
                }
            } else {
                Alert.alert('❌ Erreur', res.message || 'Identifiants incorrects');
            }
        } catch(e){
            Alert.alert('❌ Connexion', 'Vérifiez votre connexion internet et l\'URL de l\'API');
        }
        setLoading(false);
    };

    return (
        <KeyboardAvoidingView style={{ flex:1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
    
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.logo}>📐</Text>
                    <Text style={styles.appName}>Math Zoom</Text>
                    <Text style={styles.subtitle}>Prof Bouazzaoui</Text>
                </View>
    
                {/* Sélecteur rôle */}
                <View style={styles.roleSelector}>
                    {[
                        { key:'etudiant',   label:'🎓 Étudiant'  },
                        { key:'professeur', label:'👨‍🏫 Prof'     },
                        { key:'admin',      label:'⚙️ Admin'     }
                    ].map(r => (
                        <TouchableOpacity
                            key={r.key}
                            style={[styles.roleBtn, role===r.key && styles.roleBtnActive]}
                            onPress={() => { setRole(r.key); setField1(''); setField2(''); }}
                        >
                            <Text style={[styles.roleTxt, role===r.key && styles.roleTxtActive]}>
                                {r.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
    
                {/* Formulaire */}
                <View style={styles.form}>
                    <Text style={styles.formTitle}>
                        {role === 'etudiant'   ? '🎓 Connexion Étudiant'     :
                         role === 'professeur' ? '👨‍🏫 Connexion Professeur'  :
                                                '⚙️ Connexion Admin'}
                    </Text>
    
                    {/* ✅ Champ 1 — différent selon rôle */}
                    <Text style={styles.label}>
                        {role === 'etudiant' ? '👤 Nom d\'utilisateur' : '📧 Email'}
                    </Text>
                    <TextInput
                        style={styles.input}
                        placeholder={
                            role === 'etudiant' ? 'Ex: mossab123' : 'email@gmail.com'
                        }
                        value={field1}
                        onChangeText={setField1}
                        autoCapitalize="none"
                        keyboardType={role !== 'etudiant' ? 'email-address' : 'default'}
                    />
    
                    {/* ✅ Champ 2 — différent selon rôle */}
                    <Text style={styles.label}>
                        {role === 'etudiant' ? '🔑 Code d\'inscription' : '🔒 Mot de passe'}
                    </Text>
                    <TextInput
                        style={styles.input}
                        placeholder={
                            role === 'etudiant'
                                ? 'Code fourni par le professeur'
                                : '••••••••'
                        }
                        value={field2}
                        onChangeText={setField2}
                        secureTextEntry={role !== 'etudiant'} // ✅ visible pour étudiant
                        autoCapitalize="none"
                    />
    
                    {/* ✅ Info pour étudiant */}
                    {role === 'etudiant' && (
                        <View style={styles.infoBox}>
                            <Text style={styles.infoText}>
                                ℹ️ Votre nom d'utilisateur et code d'inscription vous sont fournis par le professeur Bouazzaoui.
                            </Text>
                        </View>
                    )}
    
                    <TouchableOpacity
                        style={[styles.btnLogin, loading && { opacity:0.7 }]}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading
                            ? <ActivityIndicator color="white" />
                            : <Text style={styles.btnTxt}>Se connecter →</Text>
                        }
                    </TouchableOpacity>
                </View>
    
                <Text style={styles.footer}>© 2026 Math Zoom — Prof Bouazzaoui</Text>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container    : { flexGrow:1, backgroundColor: Colors.background, padding:25, justifyContent:'center' },
    header       : { alignItems:'center', marginBottom:35 },
    logo         : { fontSize:60 },
    appName      : { fontSize:32, fontWeight:'bold', color: Colors.primary, marginTop:5 },
    subtitle     : { fontSize:15, color: Colors.gray, marginTop:4 },
    roleSelector : { flexDirection:'row', justifyContent:'center', gap:8, marginBottom:25, flexWrap:'wrap' },
    roleBtn      : { paddingHorizontal:16, paddingVertical:9, borderRadius:25, borderWidth:2, borderColor: Colors.primary },
    roleBtnActive: { backgroundColor: Colors.primary },
    roleTxt      : { fontSize:13, color: Colors.primary, fontWeight:'700' },
    roleTxtActive: { color:'white' },
    form         : { backgroundColor:'white', borderRadius:20, padding:25, shadowColor:'#000', shadowOpacity:0.1, shadowRadius:15, elevation:5 },
    formTitle    : { fontSize:18, fontWeight:'bold', color: Colors.text, marginBottom:20, textAlign:'center' },
    label        : { fontSize:13, color: Colors.gray, marginBottom:6, fontWeight:'600' },
    input        : { borderWidth:1.5, borderColor: Colors.border, borderRadius:12, padding:13, fontSize:15, marginBottom:16, backgroundColor: Colors.lightGray },
    btnLogin     : { backgroundColor: Colors.primary, padding:16, borderRadius:12, alignItems:'center', marginTop:5 },
    btnTxt       : { color:'white', fontWeight:'bold', fontSize:16 },
    footer       : { textAlign:'center', color: Colors.gray, fontSize:12, marginTop:25 },
    infoBox : {
        backgroundColor : '#e8f4fd',
        borderRadius    : 10,
        padding         : 12,
        marginBottom    : 15,
        borderLeftWidth : 3,
        borderLeftColor : '#1a73e8',
    },
    infoText : {
        fontSize   : 12,
        color      : '#1a73e8',
        lineHeight : 18,
    },
});