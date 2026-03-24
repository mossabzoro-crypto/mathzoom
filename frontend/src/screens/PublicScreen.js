import { FontAwesome5 } from '@expo/vector-icons';
import React, { useState, useRef } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    Image, Linking, Dimensions, Animated
} from 'react-native';

const { width } = Dimensions.get('window');

const NIVEAUX = [
    {
        niveau: 'Tronc Commun',
        code: 'TC',
        icon: '📘',
        presentiel: [
            { jour: 'Lundi',    heure: '18h - 20h', matiere: 'Math' },
            { jour: 'Mercredi', heure: '18h - 20h', matiere: 'Math' },
        ],
        distance: [
            { jour: 'Vendredi', heure: '19h - 21h', matiere: 'Math' },
        ],
    },
    {
        niveau: '1er Bac SE',
        code: '1BAC SE',
        icon: '📗',
        presentiel: [
            { jour: 'Lundi',    heure: '19h - 21h', matiere: 'Math' },
            { jour: 'Jeudi',    heure: '19h - 21h', matiere: 'Math' },
        ],
        distance: [
            { jour: 'Samedi',   heure: '10h - 12h', matiere: 'Math' },
        ],
    },
    {
        niveau: '1er Bac SM',
        code: '1BAC SM',
        icon: '📙',
        presentiel: [
            { jour: 'Mardi',    heure: '19h - 21h', matiere: 'Math' },
            { jour: 'Vendredi', heure: '19h - 21h', matiere: 'Math' },
        ],
        distance: [
            { jour: 'Samedi',   heure: '14h - 16h', matiere: 'Math' },
        ],
    },
    {
        niveau: '2ème Bac',
        code: '2BAC',
        icon: '📕',
        presentiel: [
            { jour: 'Lundi',    heure: '20h - 22h', matiere: 'Math' },
            { jour: 'Mercredi', heure: '20h - 22h', matiere: 'Math' },
            { jour: 'Vendredi', heure: '20h - 22h', matiere: 'Math' },
        ],
        distance: [
            { jour: 'Dimanche', heure: '10h - 12h', matiere: 'Math' },
        ],
    },
];

export default function PublicScreen({ onLogin }) {
    const [expandedNiveau, setExpandedNiveau] = useState(null);
    const scrollRef = useRef(null);

    const scrollToSection = (y) => {
        scrollRef.current?.scrollTo({ y, animated: true });
    };

    return (
        <View style={styles.container}>
           {/* ===== NAVBAR ===== */}
<View style={styles.navbar}>
    <View style={styles.navContent}>

        {/* Logo */}
        <View style={styles.navLogo}>
            <Image
                source={require('../../assets/images/logo.jpeg')}
                style={styles.navLogoImg}
                resizeMode="contain"
            />
        </View>

        {/* Menu */}
        <View style={styles.navMenu}>
            <TouchableOpacity style={styles.navItem}
                onPress={() => scrollToSection(500)}>
                <Text style={styles.navItemText}>Niveaux</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem}
                onPress={() => scrollToSection(1200)}>
                <Text style={styles.navItemText}>À propos</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem}
                onPress={() => scrollToSection(1700)}>
                <Text style={styles.navItemText}>Contact</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navLoginBtn} onPress={onLogin}>
                <Text style={styles.navLoginIcon}>🔐</Text>
                <Text style={styles.navLoginText}>Login</Text>
            </TouchableOpacity>
        </View>

    </View>
    {/* Barre bleue décorative */}
    <View style={styles.navBar} />
</View>

<ScrollView ref={scrollRef} style={styles.scroll} showsVerticalScrollIndicator={false}>
                {/* ===== HERO ===== */}
                <View style={styles.hero}>
                    {/* Background gradient */}
                    <View style={styles.heroBg} />

                    {/* Photo prof */}
                    <View style={styles.profPhotoWrapper}>
                    <Image
            source={require('../../assets/images/prof.jpg')}
            style={styles.profPhoto}
            resizeMode="cover"
        />
                        <View style={styles.profBadge}>
                            <Text style={styles.profBadgeText}>⭐ Expert</Text>
                        </View>
                    </View>

                    <Text style={styles.heroTitle}>Prof Bouazzaoui</Text>
                    <Text style={styles.heroSubtitle}>Professeur de Mathématiques</Text>
                    <View style={styles.heroAppName}>
                    <Image
    source={require('../../assets/images/zoom.png')}
    style={styles.heroZoomLogo}
    resizeMode="contain"
/>
                        <Text style={styles.heroAppNameText}>Math Zoom</Text>
                    </View>

                    <View style={styles.heroStats}>
                        {[
                            { value: '20+', label: 'Ans exp.' },
                            { value: '4',   label: 'Niveaux' },
                        ].map((s, i) => (
                            <View key={i} style={styles.heroStat}>
                                <Text style={styles.heroStatValue}>{s.value}</Text>
                                <Text style={styles.heroStatLabel}>{s.label}</Text>
                            </View>
                        ))}
                    </View>

                    <TouchableOpacity style={styles.heroCTA} onPress={onLogin}>
                        <Text style={styles.heroCTAText}>🎓 Rejoindre maintenant</Text>
                    </TouchableOpacity>
                </View>

                {/* ===== NIVEAUX ===== */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionBadge}>📚 Cours</Text>
                        <Text style={styles.sectionTitle}>Niveaux Enseignés</Text>
                        <Text style={styles.sectionSubtitle}>
                            Cliquez sur un niveau pour voir l'emploi du temps
                        </Text>
                    </View>

                    {NIVEAUX.map((n, i) => (
                        <View key={i} style={styles.niveauCard}>
                            {/* Header niveau */}
                            <TouchableOpacity
                                style={styles.niveauHeader}
                                onPress={() => setExpandedNiveau(expandedNiveau === i ? null : i)}
                            >
                                <View style={styles.niveauLeft}>
                                    <Text style={styles.niveauIcon}>{n.icon}</Text>
                                    <View>
                                        <Text style={styles.niveauCode}>{n.code}</Text>
                                        <Text style={styles.niveauName}>{n.niveau}</Text>
                                    </View>
                                </View>
                                <Text style={styles.niveauArrow}>
                                    {expandedNiveau === i ? '▲' : '▼'}
                                </Text>
                            </TouchableOpacity>

                            {/* Emploi du temps */}
                            {expandedNiveau === i && (
                                <View style={styles.emploiSection}>
                                    {/* Présentiel */}
                                    <View style={styles.typeSection}>
                                        <View style={styles.typeHeader}>
                                            <View style={[styles.typeDot, { backgroundColor: '#27ae60' }]} />
                                            <Text style={styles.typeTitle}>🏫 Présentiel</Text>
                                        </View>
                                        {n.presentiel.map((s, j) => (
                                            <View key={j} style={[styles.seanceRow, { borderLeftColor: '#27ae60' }]}>
                                                <Text style={styles.seanceJour}>{s.jour}</Text>
                                                <Text style={styles.seanceMatiere}>{s.matiere}</Text>
                                                <Text style={styles.seanceHeure}>{s.heure}</Text>
                                            </View>
                                        ))}
                                    </View>

                                    {/* À distance */}
                                    <View style={styles.typeSection}>
                                        <View style={styles.typeHeader}>
                                            <View style={[styles.typeDot, { backgroundColor: '#1a73e8' }]} />
                                            <Text style={styles.typeTitle}>💻 À Distance (Zoom)</Text>
                                        </View>
                                        {n.distance.map((s, j) => (
                                            <View key={j} style={[styles.seanceRow, { borderLeftColor: '#1a73e8' }]}>
                                                <Text style={styles.seanceJour}>{s.jour}</Text>
                                                <Text style={styles.seanceMatiere}>{s.matiere}</Text>
                                                <Text style={styles.seanceHeure}>{s.heure}</Text>
                                            </View>
                                        ))}
                                    </View>

                                    {/* CTA connexion */}
                                    <TouchableOpacity style={styles.niveauCTA} onPress={onLogin}>
                                        <Text style={styles.niveauCTATxt}>
                                            🔐 Connectez-vous pour accéder aux cours
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    ))}
                </View>

                {/* ===== À PROPOS ===== */}
                <View style={[styles.section, styles.sectionDark]}>
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionBadge, { backgroundColor: 'rgba(255,255,255,0.15)', color:'white' }]}>
                            ℹ️ À propos
                        </Text>
                        <Text style={[styles.sectionTitle, { color:'white' }]}>
                            Math Zoom
                        </Text>
                        <Text style={[styles.sectionSubtitle, { color:'rgba(255,255,255,0.7)' }]}>
                            Votre plateforme de cours en ligne
                        </Text>
                    </View>

                    {[
                        {
                            icon: '🎥',
                            title: 'Cours via Zoom',
                            desc: 'Rejoignez facilement les séances en direct grâce aux liens Zoom intégrés directement dans l\'application.'
                        },
                        {
                            icon: '📁',
                            title: 'Accès Google Drive',
                            desc: 'Tous vos cours, exercices et documents sont disponibles sur Google Drive, accessibles à tout moment.'
                        },
                        {
                            icon: '📅',
                            title: 'Emploi du Temps',
                            desc: 'Consultez votre emploi du temps en temps réel — présentiel ou à distance — et ne manquez plus aucune séance.'
                        },
                        {
                            icon: '🔔',
                            title: 'Notifications',
                            desc: 'Recevez des notifications push pour les changements de séances, même quand l\'app est fermée.'
                        },
                    ].map((item, i) => (
                        <View key={i} style={styles.aboutCard}>
                            <Text style={styles.aboutIcon}>{item.icon}</Text>
                            <View style={styles.aboutInfo}>
                                <Text style={styles.aboutTitle}>{item.title}</Text>
                                <Text style={styles.aboutDesc}>{item.desc}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* ===== CONTACT ===== */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionBadge}>📞 Contact</Text>
                        <Text style={styles.sectionTitle}>Contactez-nous</Text>
                    </View>

                    <View style={styles.contactCard}>
                        {[
  {
    icon: <FontAwesome5 name="envelope" size={30} color="#1086e4" />,
    label: 'Email',
    value: 'ProfBouazzaoui@gmail.com',
    textColor: '#1086e4', // 👈 زيد هادي
    onPress: () => Linking.openURL('mailto:ProfBouazzaoui@gmail.com')
  },
  {
    icon: <FontAwesome5 name="whatsapp" size={30} color="#25D366" />,
    label: 'WhatsApp',
    value: 'Contacter sur WhatsApp',
    textColor: '#25D366',
    onPress: () => Linking.openURL('https://wa.me/212697505455')
  }
].map((c, i) => (
             <TouchableOpacity key={i} style={styles.contactRow} onPress={c.onPress}>

                <View style={styles.contactIcon}>
                            {c.icon}
                </View>

            <View>
                <Text style={styles.contactLabel}>{c.label}</Text>
                <Text style={[styles.contactValue, { color: c.textColor || '#000' }]}>
                     {c.value}
                    </Text>
            </View>
                </TouchableOpacity>
                        ))}
                        </View>
                    {/* CTA final */}
                    <TouchableOpacity style={styles.finalCTA} onPress={onLogin}>
                        <Text style={styles.finalCTATitle}>🚀 Commencer maintenant</Text>
                        <Text style={styles.finalCTASub}>Connectez-vous pour accéder à tous vos cours</Text>
                </TouchableOpacity>
                        </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>© 2026 Math Zoom — Prof Bouazzaoui</Text>
                    <Text style={styles.footerSub}>Tous droits réservés</Text>
                </View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container      : { flex:1, backgroundColor:'#f0f4f8' },

    /* NAVBAR */
    /* ===== NAVBAR ===== */
navbar         : {
    backgroundColor  : '#0a1628',
    paddingTop       : 45,
    paddingBottom    : 0,
    elevation        : 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
},
navContent     : {
    flexDirection    : 'row',
    justifyContent   : 'space-between',
    alignItems       : 'center',
    paddingHorizontal: 20,
    paddingBottom    : 14,
},
navLogo        : {
    flexDirection: 'row',
    alignItems   : 'center',
    gap          : 12,
},
navLogoBox     : {
    width          : 42,
    height         : 42,
    backgroundColor: '#1a73e8',
    borderRadius   : 12,
    justifyContent : 'center',
    alignItems     : 'center',
    elevation      : 4,
},
navLogoImg     : {
    width       : 42,
    height      : 42,
    borderRadius: 12,
},
navLogoEmoji   : { fontSize: 22 },
navMenu        : {
    flexDirection: 'row',
    alignItems   : 'center',
    gap          : 4,
},
navItem        : {
    paddingHorizontal: 10,
    paddingVertical  : 6,
    borderRadius     : 8,
},
navItemText    : {
    color     : 'rgba(255,255,255,0.75)',
    fontSize  : 13,
    fontWeight: '500',
},
navLoginBtn    : {
    flexDirection    : 'row',
    alignItems       : 'center',
    gap              : 6,
    backgroundColor  : '#1a73e8',
    paddingHorizontal: 14,
    paddingVertical  : 8,
    borderRadius     : 20,
    marginLeft       : 6,
    elevation        : 4,
},
navLoginIcon   : { fontSize: 13 },
navLoginText   : {
    color     : 'white',
    fontWeight: '700',
    fontSize  : 13,
},
navBar         : {
    height         : 3,
    backgroundColor: '#1a73e8',
    opacity        : 0.8,
},
    scroll         : { flex:1 },

    /* HERO */
    hero           : { backgroundColor:'#1a73e8', paddingTop:40, paddingBottom:50, alignItems:'center', paddingHorizontal:20 },
    heroBg         : { position:'absolute', top:0, left:0, right:0, bottom:0, backgroundColor:'#0d47a1', opacity:0.3 },
    profPhotoWrapper : {
        position     : 'relative',
        marginBottom : 20,
    },
    profPhoto        : {
        width        : 140,
        height       : 140,
        borderRadius : 70,
        borderWidth  : 4,
        borderColor  : 'rgba(255,255,255,0.6)',
    },
    profPhotoCircle: { width:130, height:130, borderRadius:65, backgroundColor:'rgba(255,255,255,0.2)', justifyContent:'center', alignItems:'center', borderWidth:4, borderColor:'rgba(255,255,255,0.5)' },
    profPhotoEmoji : { fontSize:70 },
    profBadge        : {
        position        : 'absolute',
        bottom          : 5,
        right           : 0,
        backgroundColor : '#FFD400',
        paddingHorizontal: 10,
        paddingVertical : 4,
        borderRadius    : 12,
        elevation       : 3,
    },
    profBadgeText    : {
        fontSize   : 11,
        fontWeight : 'bold',
        color      : '#111',
    },
    heroTitle      : { fontSize:28, fontWeight:'bold', color:'white', marginBottom:5 },
    heroSubtitle   : { fontSize:16, color:'rgba(255,255,255,0.85)', marginBottom:12 },
    heroAppName    : { flexDirection:'row', alignItems:'center', gap:6, backgroundColor:'rgba(255,255,255,0.15)', paddingHorizontal:16, paddingVertical:8, borderRadius:20, marginBottom:25 },
    heroZoomLogo : {
        width        : 32,
        height       : 32,
        borderRadius : 8,
    },
    heroAppNameText: { fontSize:16, fontWeight:'bold', color:'white' },
    heroStats      : { flexDirection:'row', gap:30, marginBottom:25 },
    heroStat       : { alignItems:'center' },
    heroStatValue  : { fontSize:24, fontWeight:'bold', color:'white' },
    heroStatLabel  : { fontSize:12, color:'rgba(255,255,255,0.7)', marginTop:2 },
    heroCTA        : { backgroundColor:'#FFD400', paddingHorizontal:30, paddingVertical:14, borderRadius:25, elevation:5 },
    heroCTAText    : { fontSize:16, fontWeight:'bold', color:'#111' },

    /* SECTIONS */
    section        : { padding:20, paddingVertical:30 },
    sectionDark    : { backgroundColor:'#0d47a1' },
    sectionHeader  : { alignItems:'center', marginBottom:25 },
    sectionBadge   : { backgroundColor:'#e8f4fd', color:'#1a73e8', paddingHorizontal:14, paddingVertical:6, borderRadius:20, fontSize:13, fontWeight:'600', marginBottom:10 },
    sectionTitle   : { fontSize:24, fontWeight:'bold', color:'#111', textAlign:'center', marginBottom:8 },
    sectionSubtitle: { fontSize:14, color:'#666', textAlign:'center', lineHeight:20 },

    /* NIVEAUX */
    niveauCard     : { backgroundColor:'white', borderRadius:16, marginBottom:12, elevation:3, overflow:'hidden' },
    niveauHeader   : { flexDirection:'row', justifyContent:'space-between', alignItems:'center', padding:18 },
    niveauLeft     : { flexDirection:'row', alignItems:'center', gap:14 },
    niveauIcon     : { fontSize:32 },
    niveauCode     : { fontSize:18, fontWeight:'bold', color:'#1a73e8' },
    niveauName     : { fontSize:13, color:'#666', marginTop:2 },
    niveauArrow    : { fontSize:14, color:'#999' },
    emploiSection  : { borderTopWidth:1, borderTopColor:'#f0f0f0', padding:16 },
    typeSection    : { marginBottom:15 },
    typeHeader     : { flexDirection:'row', alignItems:'center', gap:8, marginBottom:10 },
    typeDot        : { width:10, height:10, borderRadius:5 },
    typeTitle      : { fontSize:14, fontWeight:'700', color:'#333' },
    seanceRow      : { flexDirection:'row', justifyContent:'space-between', alignItems:'center', backgroundColor:'#f8f9fa', borderRadius:10, padding:12, marginBottom:6, borderLeftWidth:3 },
    seanceJour     : { fontSize:13, fontWeight:'bold', color:'#333', width:80 },
    seanceMatiere  : { fontSize:13, color:'#666', flex:1 },
    seanceHeure    : { fontSize:13, fontWeight:'600', color:'#1a73e8' },
    niveauCTA      : { backgroundColor:'#e8f4fd', padding:12, borderRadius:12, alignItems:'center', marginTop:8 },
    niveauCTATxt   : { color:'#1a73e8', fontWeight:'600', fontSize:13 },

    /* À PROPOS */
    aboutCard      : { flexDirection:'row', alignItems:'flex-start', gap:15, backgroundColor:'rgba(255,255,255,0.1)', borderRadius:16, padding:18, marginBottom:12 },
    aboutIcon      : { fontSize:32 },
    aboutInfo      : { flex:1 },
    aboutTitle     : { fontSize:16, fontWeight:'bold', color:'white', marginBottom:5 },
    aboutDesc      : { fontSize:13, color:'rgba(255,255,255,0.75)', lineHeight:20 },

    /* CONTACT */
    contactCard    : { backgroundColor:'white', borderRadius:20, padding:25, alignItems:'center', elevation:4 },
    contactAvatar  : { width:90, height:90, borderRadius:45, backgroundColor:'#e8f4fd', justifyContent:'center', alignItems:'center', marginBottom:12 },
    contactName    : { fontSize:22, fontWeight:'bold', color:'#111', marginBottom:4 },
    contactRole    : { fontSize:14, color:'#666', marginBottom:20 },
    contactRow     : { flexDirection:'row', alignItems:'center', gap:14, backgroundColor:'#f8f9fa', borderRadius:14, padding:15, marginBottom:10, width:'100%' },
    contactIcon    : { fontSize:26 },
    contactLabel   : { fontSize:12, color:'#999', marginBottom:2 },
    contactValue   : { fontSize:15, fontWeight:'600', color:'#1a73e8' },

    /* FINAL CTA */
    finalCTA       : { backgroundColor:'#1a73e8', borderRadius:20, padding:25, alignItems:'center', marginTop:20, elevation:5 },
    finalCTATitle  : { fontSize:20, fontWeight:'bold', color:'white', marginBottom:6 },
    finalCTASub    : { fontSize:13, color:'rgba(255,255,255,0.8)', textAlign:'center' },

    /* FOOTER */
    footer         : { backgroundColor:'#111', padding:25, alignItems:'center' },
    footerText     : { fontSize:14, color:'rgba(255,255,255,0.7)' },
    footerSub      : { fontSize:12, color:'rgba(255,255,255,0.4)', marginTop:4 },
});