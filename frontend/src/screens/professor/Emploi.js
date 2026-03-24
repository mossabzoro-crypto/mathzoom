import React, { useEffect, useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, RefreshControl,
    TouchableOpacity, Alert, Modal, TextInput
} from 'react-native';
import { getEmplois, ajouterSeance, modifierSeance, supprimerSeance } from '../../services/api';
import { Colors } from '../../constants/colors';

const NIVEAUX = ['5ème Primaire','6ème Primaire','1ère Collège','2ème Collège',
                 '3ème Collège','Tronc Commun','1er Bac SE','1er Bac SM','2ème Bac'];
const JOURS   = ['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche'];
const TYPES   = ['presentiel','distance'];

export default function EmploiManageScreen(){
    const [emplois, setEmplois]   = useState([]);
    const [niveau, setNiveau]     = useState('Tronc Commun');
    const [loading, setLoading]   = useState(true);
    const [modal, setModal]       = useState(false);
    const [editing, setEditing]   = useState(null);
    const [form, setForm]         = useState({ jour:'Lundi', matiere:'', heure:'', type:'presentiel', lien_zoom:'' });

    useEffect(()=>{ loadEmplois(); }, [niveau]);

    const loadEmplois = async () => {
        setLoading(true);
        try {
            const data = await getEmplois(niveau);
            setEmplois(Array.isArray(data) ? data : []);
        } catch(e){}
        setLoading(false);
    };

    const openAdd = () => {
        setEditing(null);
        setForm({ jour:'Lundi', matiere:'', heure:'', type:'presentiel', lien_zoom:'' });
        setModal(true);
    };

    const openEdit = (seance) => {
        setEditing(seance);
        setForm({ jour: seance.jour, matiere: seance.matiere, heure: seance.heure, type: seance.type, lien_zoom: seance.lien_zoom || '' });
        setModal(true);
    };

    const handleSave = async () => {
        if(!form.matiere || !form.heure){
            Alert.alert('⚠️', 'Remplissez matière et heure');
            return;
        }
        try {
            if(editing){
                await modifierSeance({ id: editing.id, ...form });
            } else {
                await ajouterSeance({ ...form, niveau });
            }
            setModal(false);
            loadEmplois();
        } catch(e){
            Alert.alert('❌ Erreur', 'Problème de connexion');
        }
    };

    const handleDelete = (id) => {
        Alert.alert('Supprimer', 'Voulez-vous supprimer cette séance ?', [
            { text: 'Annuler', style:'cancel' },
            { text: 'Supprimer', style:'destructive', onPress: async () => {
                await supprimerSeance(id);
                loadEmplois();
            }}
        ]);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>📅 Emploi du Temps</Text>
            </View>

            {/* Sélecteur niveau */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}
                style={styles.niveauxScroll} contentContainerStyle={{ padding:10, gap:8 }}>
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
            <TouchableOpacity style={styles.addBtn} onPress={openAdd}>
                <Text style={styles.addBtnTxt}>➕ Ajouter une séance</Text>
            </TouchableOpacity>

            {/* Liste séances */}
            <ScrollView
                refreshControl={<RefreshControl refreshing={loading} onRefresh={loadEmplois} />}
            >
                {emplois.length === 0 ? (
                    <Text style={styles.empty}>Aucune séance pour ce niveau</Text>
                ) : (
                    emplois.map((e, i) => (
                        <View key={i} style={styles.card}>
                            <View style={styles.cardLeft}>
                                <Text style={styles.jour}>{e.jour}</Text>
                                <View style={[styles.typeBadge, { backgroundColor: e.type==='distance'?'#e8f4fd':'#e8fdf0' }]}>
                                    <Text style={{ fontSize:10, color: e.type==='distance'?Colors.primary:Colors.accent }}>
                                        {e.type === 'distance' ? '💻' : '🏫'}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.cardInfo}>
                                <Text style={styles.matiere}>{e.matiere}</Text>
                                <Text style={styles.heure}>⏰ {e.heure}</Text>
                            </View>
                            <View style={styles.actions}>
                                <TouchableOpacity style={styles.editBtn} onPress={() => openEdit(e)}>
                                    <Text>✏️</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(e.id)}>
                                    <Text>🗑️</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                )}
                <View style={{ height:30 }} />
            </ScrollView>

            {/* Modal Ajouter/Modifier */}
            <Modal visible={modal} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>
                            {editing ? '✏️ Modifier' : '➕ Ajouter'} Séance
                        </Text>

                        <Text style={styles.label}>Jour</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom:15 }}>
                            <View style={{ flexDirection:'row', gap:8 }}>
                                {JOURS.map(j => (
                                    <TouchableOpacity key={j}
                                        style={[styles.chip, form.jour===j && styles.chipActive]}
                                        onPress={() => setForm({...form, jour:j})}
                                    >
                                        <Text style={[styles.chipTxt, form.jour===j && styles.chipTxtActive]}>{j}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>

                        <Text style={styles.label}>Matière</Text>
                        <TextInput style={styles.input} placeholder="Ex: Mathématiques"
                            value={form.matiere} onChangeText={v => setForm({...form, matiere:v})} />

                        <Text style={styles.label}>Heure</Text>
                        <TextInput style={styles.input} placeholder="Ex: 18h - 20h"
                            value={form.heure} onChangeText={v => setForm({...form, heure:v})} />

                        <Text style={styles.label}>Type</Text>
                        <View style={{ flexDirection:'row', gap:10, marginBottom:15 }}>
                            {TYPES.map(t => (
                                <TouchableOpacity key={t}
                                    style={[styles.chip, form.type===t && styles.chipActive]}
                                    onPress={() => setForm({...form, type:t})}
                                >
                                    <Text style={[styles.chipTxt, form.type===t && styles.chipTxtActive]}>
                                        {t === 'presentiel' ? '🏫 Présentiel' : '💻 Distance'}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {form.type === 'distance' && (
                            <>
                                <Text style={styles.label}>Lien Zoom</Text>
                                <TextInput style={styles.input} placeholder="https://zoom.us/..."
                                    value={form.lien_zoom} onChangeText={v => setForm({...form, lien_zoom:v})} />
                            </>
                        )}

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
    niveauxScroll  : { maxHeight:60 },
    niveauBtn      : { paddingHorizontal:14, paddingVertical:8, borderRadius:20, borderWidth:1.5, borderColor: Colors.primary, backgroundColor:'white' },
    niveauActive   : { backgroundColor: Colors.primary },
    niveauTxt      : { fontSize:12, color: Colors.primary, fontWeight:'600' },
    niveauTxtActive: { color:'white' },
    addBtn         : { margin:15, backgroundColor: Colors.accent, padding:14, borderRadius:12, alignItems:'center' },
    addBtnTxt      : { color:'white', fontWeight:'bold', fontSize:15 },
    empty          : { textAlign:'center', color: Colors.gray, padding:40, fontSize:16 },
    card           : { backgroundColor:'white', borderRadius:12, margin:10, marginVertical:5, padding:12, flexDirection:'row', alignItems:'center', elevation:2 },
    cardLeft       : { width:75, alignItems:'center', marginRight:10 },
    jour           : { fontSize:13, fontWeight:'bold', color: Colors.primary, textAlign:'center' },
    typeBadge      : { marginTop:4, padding:4, borderRadius:6 },
    cardInfo       : { flex:1 },
    matiere        : { fontSize:15, fontWeight:'bold', color: Colors.text },
    heure          : { fontSize:12, color: Colors.gray, marginTop:2 },
    actions        : { flexDirection:'row', gap:8 },
    editBtn        : { padding:8, backgroundColor:'#fff8e1', borderRadius:8 },
    deleteBtn      : { padding:8, backgroundColor:'#fde8e8', borderRadius:8 },
    modalOverlay   : { flex:1, backgroundColor:'rgba(0,0,0,0.5)', justifyContent:'flex-end' },
    modalBox       : { backgroundColor:'white', borderTopLeftRadius:20, borderTopRightRadius:20, padding:25, maxHeight:'85%' },
    modalTitle     : { fontSize:18, fontWeight:'bold', color: Colors.text, marginBottom:20, textAlign:'center' },
    label          : { fontSize:13, color: Colors.gray, fontWeight:'600', marginBottom:6 },
    input          : { borderWidth:1.5, borderColor: Colors.border, borderRadius:12, padding:12, fontSize:15, marginBottom:15, backgroundColor: Colors.lightGray },
    chip           : { paddingHorizontal:12, paddingVertical:7, borderRadius:20, borderWidth:1.5, borderColor: Colors.primary },
    chipActive     : { backgroundColor: Colors.primary },
    chipTxt        : { fontSize:12, color: Colors.primary, fontWeight:'600' },
    chipTxtActive  : { color:'white' },
    modalActions   : { flexDirection:'row', gap:12, marginTop:10 },
    cancelBtn      : { flex:1, padding:14, borderRadius:12, borderWidth:1.5, borderColor: Colors.border, alignItems:'center' },
    cancelTxt      : { color: Colors.gray, fontWeight:'bold' },
    saveBtn        : { flex:1, padding:14, borderRadius:12, backgroundColor: Colors.primary, alignItems:'center' },
    saveTxt        : { color:'white', fontWeight:'bold' },
});