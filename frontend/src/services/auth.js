import AsyncStorage from '@react-native-async-storage/async-storage';

// ✅ Sauvegarder utilisateur (session persistante)
export const saveUser = async (user) => {
    try {
        await AsyncStorage.setItem('user', JSON.stringify(user));
    } catch(e) {
        console.error('saveUser error:', e);
    }
};

// ✅ Récupérer utilisateur connecté
export const getUser = async () => {
    try {
        const user = await AsyncStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    } catch(e) {
        return null;
    }
};

// ✅ Déconnexion
export const logout = async () => {
    try {
        await AsyncStorage.removeItem('user');
    } catch(e) {
        console.error('logout error:', e);
    }
};