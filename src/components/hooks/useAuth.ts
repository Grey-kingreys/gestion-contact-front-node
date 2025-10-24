import { useState, useEffect, useRef } from 'react';

export function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [user, setUser] = useState<any | null>(null);
    const isChecking = useRef(false);

    useEffect(() => {
        const checkAuth = () => {
            // Éviter les boucles infinies
            if (isChecking.current) return;
            
            isChecking.current = true;
            
            try {
                const token = localStorage.getItem('authToken');
                const userData = localStorage.getItem('userData');
                
                // Utiliser des comparaisons pour éviter les mises à jour inutiles
                const newAuthState = !!token;
                const newUserState = userData ? JSON.parse(userData) : null;
                
                // Éviter les mises à jour d'état inutiles
                if (isAuthenticated !== newAuthState) {
                    setIsAuthenticated(newAuthState);
                }
                
                if (JSON.stringify(user) !== JSON.stringify(newUserState)) {
                    setUser(newUserState);
                }
            } catch (error) {
                console.error('Erreur parsing userData:', error);
                setIsAuthenticated(false);
                setUser(null);
            } finally {
                isChecking.current = false;
            }
        };

        checkAuth();

        const handleStorageChange = (event: StorageEvent) => {
            // Ne réagir qu'aux changements des clés d'authentification
            if (event.key === 'authToken' || event.key === 'userData') {
                checkAuth();
            }
        };

        const handleCustomAuthChange = () => {
            checkAuth();
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('authChange', handleCustomAuthChange);
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('authChange', handleCustomAuthChange);
        };
    }, [isAuthenticated, user]); // Ajouter les dépendances pour éviter les boucles

    return { isAuthenticated, user };
}

export default useAuth;