import React, { useEffect, useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, RefreshControl,
    TouchableOpacity, Alert, Modal, TextInput
} from 'react-native';
import { getPDFs, getDriveLinks, supprimerPDF } from '../../services/api';
import { Colors } from '../../constants/colors';

const NIVEAUX = ['5ème Primaire','6ème Primaire','1ère Collège','2ème Collège',
                 '3ème Collège','Tronc Commun','1er Bac SE','1er Bac SM','2ème Bac'];

export default function PDFManageScreen(){
    const [pdfs, setPdfs]       = useState([]);
    const [niveau, setNiveau]   = useState('Tronc Commun');
    const [loading, setLoading] = useState(true);
    const [tab, setTab]         = useState('pdf');
    const [modal, setModal]     = useState(false);
    const [form, setForm]       = useState({ titre:'', lien_drive:'', type:'cours', niveau:'' });

    useEffect(()=>{ loadPDFs(); }, [niveau]);

    const loadPDFs = async () => {
        setLoading(true);
        try {
            const data = await getPDFs(niveau);
            setPdfs(Array.isArray(data) ? data : []);
        } catch(e){}
        setLoading(false);
    };

    const handleDelete = (id) => {
        Alert.alert('Supprimer', 'Supprimer ce PDF ?', [
            { text: 'Annuler', style:'cancel' },
            { text: 'Supprimer', style:'destructive', onPress: async () => {
                await supprimerPDF(id);
                loadPDFs();
            }}
        ]);
    };

    const handleSave = async () => {
        if(!form.titre || !form.lien_drive){
            Alert.alert('⚠️', 'Remplissez tous les champs');
            return;
        }
        // TODO: appeler l'API ajouterPDF
        Alert.alert('✅', 'PDF ajouté !');
        setModal(false);
        loadPDFs();
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>📚 Cours & Exercices</Text>
            </View>

            {/* Niveaux */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}
                style={{ maxHeight:55 }} contentContainerStyle={{ padding:8, gap:8 }}>
                {NIVEAUX.map(n => (
                    <TouchableOpacity key={n}
                        style={[styles.niveauBtn, niveau===n && styles.niveauActive]}
                        onPress={() => setNiveau(n)}
                    >
                        <Text style={[styles.niveauTxt, niveau===n && styles.niveauTxtActive]}>{n}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Bouton ajouter */}
            <TouchableOpacity style={styles.addBtn} onPress={() => { setForm({titre:'',lien_drive:'',type:'cours',niveau}); setModal(true); }}>
                <Text style={styles.addBtnTxt}>➕ Ajouter un PDF / Drive</Text>
            </TouchableOpacity>

            {/* Liste */}
            <ScrollView refreshControl={<RefreshControl refreshing={loading} onRefresh={loadPDFs} />}>
                {pdfs.length === 0 ? (
                    <Text style={styles.empty}>Aucun fichier pour ce niveau</Text>
                ) : (
                    pdfs.map((p, i) => (
                        <View key={i} style={styles.card}>
                            <Text style={styles.cardIcon}>{p.type==='cours'?'📘':'📝'}</Text>
                            <View style={styles.cardInfo}>
                                <Text style={styles.cardTitre}>{p.titre}</Text>
                                <View style={[styles.badge, { backgroundColor: p.type==='cours'?'#e8f4fd':'#fdf8e8' }]}>
                                    <Text style={{ fontSize:11, color: p.type==='cours'?Colors.primary:Colors.warning }}>
                                        {p.type === 'cours' ? 'Cours' : 'Exercice'}
                                    </Text>
                                </View>
                            </View>
                            <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(p.id)}>
                                <Text>🗑️</Text>
                            </TouchableOpacity>
                        </View>
                    ))
                )}
                <View style={{ height:30 }} />
            </ScrollView>

            {/* Modal */}
            <Modal visible={modal} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>➕ Ajouter Fichier</Text>

                        <Text style={styles.label}>Titre</Text>
                        <TextInput style={styles.input} placeholder="Ex: Cours Chapitre 1"
                            value={form.titre} onChangeText={v => setForm({...form, titre:v})} />

                        <Text style={styles.label}>Lien Google Drive</Text>
                        <TextInput style={styles.input} placeholder="https://drive.google.com/..."
                            value={form.lien_drive} onChangeText={v => setForm({...form, lien_drive:v})} />

                        <Text style={styles.label}>Type</Text>
                        <View style={{ flexDirection:'row', gap:10, marginBottom:20 }}>
                            {['cours','exercice'].map(t => (
                                <TouchableOpacity key={t}
                                    style={[styles.chip, form.type===t && styles.chipActive]}
                                    onPress={() => setForm({...form, type:t})}
                                >
                                    <Text style={[styles.chipTxt, form.type===t && styles.chipTxtActive]}>
                                        {t === 'cours' ? '📘 Cours' : '📝 Exercice'}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={styles.modalActions}>
                            <TouchableOpacity style={styles.cancelBtn} onPress={() => setModal(false)}>
                                <Text style={styles.cancelTxt}>Annuler</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                                <Text style={styles.saveTxt}>Enregistrer</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container      : { flex:1, backgroundColor: Colors.background },
    header         : { backgroundColor: Colors.primary, padding:25, paddingTop:50 },
    title          : { fontSize:22, fontWeight:'bold', color:'white' },
    niveauBtn      : { paddingHorizontal:14, paddingVertical:7, borderRadius:20, borderWidth:1.5, borderColor: Colors.primary, backgroundColor:'white' },
    niveauActive   : { backgroundColor: Colors.primary },
    niveauTxt      : { fontSize:12, color: Colors.primary, fontWeight:'600' },
    niveauTxtActive: { color:'white' },
    addBtn         : { margin:15, backgroundColor: Colors.accent, padding:14, borderRadius:12, alignItems:'center' },
    addBtnTxt      : { color:'white', fontWeight:'bold', fontSize:15 },
    empty          : { textAlign:'center', color: Colors.gray, padding:40, fontSize:16 },
    card           : { backgroundColor:'white', borderRadius:12, margin:10, marginVertical:5, padding:15, flexDirection:'row', alignItems:'center', elevation:2 },
    cardIcon       : { fontSize:28, marginRight:12 },
    cardInfo       : { flex:1 },
    cardTitre      : { fontSize:15, fontWeight:'bold', color: Colors.text },
    badge          : { paddingHorizontal:8, paddingVertical:3, borderRadius:8, marginTop:5, alignSelf:'flex-start' },
    deleteBtn      : { padding:8, backgroundColor:'#fde8e8', borderRadius:8 },
    modalOverlay   : { flex:1, backgroundColor:'rgba(0,0,0,0.5)', justifyContent:'flex-end' },
    modalBox       : { backgroundColor:'white', borderTopLeftRadius:20, borderTopRightRadius:20, padding:25 },
    modalTitle     : { fontSize:18, fontWeight:'bold', color: Colors.text, marginBottom:20, textAlign:'center' },
    label          : { fontSize:13, color: Colors.gray, fontWeight:'600', marginBottom:6 },
    input          : { borderWidth:1.5, borderColor: Colors.border, borderRadius:12, padding:12, fontSize:15, marginBottom:15, backgroundColor: Colors.lightGray },
    chip           : { paddingHorizontal:14, paddingVertical:8, borderRadius:20, borderWidth:1.5, borderColor: Colors.primary },
    chipActive     : { backgroundColor: Colors.primary },
    chipTxt        : { fontSize:13, color: Colors.primary, fontWeight:'600' },
    chipTxtActive  : { color:'white' },
    modalActions   : { flexDirection:'row', gap:12 },
    cancelBtn      : { flex:1, padding:14, borderRadius:12, borderWidth:1.5, borderColor: Colors.border, alignItems:'center' },
    cancelTxt      : { color: Colors.gray, fontWeight:'bold' },
    saveBtn        : { flex:1, padding:14, borderRadius:12, backgroundColor: Colors.primary, alignItems:'center' },
    saveTxt        : { color:'white', fontWeight:'bold' },
});