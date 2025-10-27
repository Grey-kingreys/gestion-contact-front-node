
import { useNavigate } from 'react-router-dom';

export function LogoutButton() {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Supprimer les données d'authentification
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        
        // Déclencher l'événement de changement d'authentification
        // avec un timeout pour éviter les conflits avec les autres listeners
        setTimeout(() => {
            window.dispatchEvent(new Event('authChange'));
        }, 100);
        
        // Rediriger vers la page de login
        navigate('/login');
    };

    return (
        <button 
            onClick={handleLogout}
            className="btn btn-error btn-outline"
        >
            Déconnexion
        </button>
    );
}

export default LogoutButton;