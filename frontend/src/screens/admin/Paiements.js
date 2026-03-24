import React, { useEffect, useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, RefreshControl,
    TouchableOpacity, Modal, TextInput, Alert
} from 'react-native';
import { getEtudiants, updatePaiement } from '../../services/api';
import { Colors } from '../../constants/colors';

export default function AdminPaiements(){
    const [etudiants, setEtudiants] = useState([]);
    const [loading, setLoading]     = useState(true);
    const [modal, setModal]         = useState(false);
    const [selected, setSelected]   = useState(null);
    const [form, setForm]           = useState({ statut:'payé', mois:'', dateExp:'' });

    useEffect(()=>{ loadEtudiants(); }, []);

    const loadEtudiants = async () => {
        try {
            const data = await getEtudiants();
            setEtudiants(Array.isArray(data) ? data : []);
        } catch(e){}
        setLoading(false);
    };

    const openModal = (etudiant) => {
        setSelected(etudiant);
        setForm({
            statut  : etudiant.paiement_statut || 'non payé',
            mois    : String(etudiant.paiement_mois || '0'),
            dateExp : etudiant.date_expiration || ''
        });
        setModal(true);
    };

    const handleSave = async () => {
        try {
            await updatePaiement(selected.id, form.statut, form.mois, form.dateExp);
            setModal(false);
            Alert.alert('✅', 'Paiement mis à jour !');
            loadEtudiants();
        } catch(e){
            Alert.alert('❌', 'Erreur de connexion');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>💰 Paiements</Text>
            </View>

            <ScrollView refreshControl={<RefreshControl refreshing={loading} onRefresh={loadEtudiants} />}>
                {etudiants.map((e, i) => (
                    <View key={i} style={styles.card}>
                        <View style={styles.info}>
                            <Text style={styles.nom}>{e.prenom} {e.nom}</Text>
                            <Text style={styles.sub}>{e.niveau}</Text>
                            <Text style={[styles.statut, { color: e.paiement_statut==='payé'?Colors.accent:Colors.danger }]}>
                                {e.paiement_statut === 'payé' ? '✅ Payé' : '❌ Non Payé'}
                            </Text>
                            {e.paiement_mois > 0 && (
                                <Text style={styles.sub}>📅 {e.paiement_mois} mois payés</Text>
                            )}
                            {e.date_expiration && (
                                <Text style={styles.sub}>⏰ Expire: {e.date_expiration}</Text>
                            )}
                        </View>
                        <TouchableOpacity style={styles.editBtn} onPress={() => openModal(e)}>
                            <Text style={styles.editBtnTxt}>💰 Gérer</Text>
                        </TouchableOpacity>
                    </View>
                ))}
                <View style={{ height:30 }} />
            </ScrollView>

            {/* Modal paiement */}
            <Modal visible={modal} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>
                            💰 {selected?.prenom} {selected?.nom}
                        </Text>

                        <Text style={styles.label}>Statut</Text>
                        <View style={{ flexDirection:'row', gap:12, marginBottom:15 }}>
                            {['payé','non payé'].map(s => (
                                <TouchableOpacity key={s}
                                    style={[styles.chip, form.statut===s && styles.chipActive]}
                                    onPress={() => setForm({...form, statut:s})}
                                >
                                    <Text style={[styles.chipTxt, form.statut===s && { color:'white' }]}>
                                        {s === 'payé' ? '✅ Payé' : '❌ Non Payé'}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={styles.label}>Mois payés</Text>
                        <TextInput style={styles.input} placeholder="Ex: 3"
                            value={form.mois} onChangeText={v => setForm({...form, mois:v})}
                            keyboardType="numeric" />

                        <Text style={styles.label}>Date d'expiration</Text>
                        <TextInput style={styles.input} placeholder="YYYY-MM-DD"
                            value={form.dateExp} onChangeText={v => setForm({...form, dateExp:v})} />

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
    container    : { flex:1, backgroundColor: Colors.background },
    header       : { backgroundColor: Colors.secondary, padding:25, paddingTop:50 },
    title        : { fontSize:22, fontWeight:'bold', color:'white' },
    card         : { backgroundColor:'white', borderRadius:12, margin:10, marginVertical:5, padding:15, flexDirection:'row', alignItems:'center', elevation:2 },
    info         : { flex:1 },
    nom          : { fontSize:15, fontWeight:'bold', color: Colors.text },
    sub          : { fontSize:12, color: Colors.gray, marginTop:2 },
    statut       : { fontSize:13, fontWeight:'600', marginTop:4 },
    editBtn      : { backgroundColor: Colors.primary, paddingHorizontal:14, paddingVertical:8, borderRadius:10 },
    editBtnTxt   : { color:'white', fontWeight:'bold', fontSize:13 },
    modalOverlay : { flex:1, backgroundColor:'rgba(0,0,0,0.5)', justifyContent:'flex-end' },
    modalBox     : { backgroundColor:'white', borderTopLeftRadius:20, borderTopRightRadius:20, padding:25 },
    modalTitle   : { fontSize:18, fontWeight:'bold', color: Colors.text, marginBottom:20, textAlign:'center' },
    label        : { fontSize:13, color: Colors.gray, fontWeight:'600', marginBottom:6 },
    input        : { borderWidth:1.5, borderColor: Colors.border, borderRadius:12, padding:12, fontSize:15, marginBottom:15, backgroundColor: Colors.lightGray },
    chip         : { flex:1, padding:12, borderRadius:12, borderWidth:1.5, borderColor: Colors.primary, alignItems:'center' },
    chipActive   : { backgroundColor: Colors.primary },
    chipTxt      : { color: Colors.primary, fontWeight:'600' },
    modalActions : { flexDirection:'row', gap:12 },
    cancelBtn    : { flex:1, padding:14, borderRadius:12, borderWidth:1.5, borderColor: Colors.border, alignItems:'center' },
    cancelTxt    : { color: Colors.gray, fontWeight:'bold' },
    saveBtn      : { flex:1, padding:14, borderRadius:12, backgroundColor: Colors.primary, alignItems:'center' },
    saveTxt      : { color:'white', fontWeight:'bold' },
});