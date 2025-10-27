import { useLoaderData, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../services/api";
import { useAuth } from "../hooks/useAuth";
// import { ChatInterface } from "./chatInterface"; // ✅ IMPORT MANQUANT !

export function Single() {
  const res = useLoaderData();
  const { isAuthenticated } = useAuth();
  const [isUserContact, setIsUserContact] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [loading, setLoading] = useState(false);
  
  if (!res || !res.data) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <div className="alert alert-error">
          Données du contact non disponibles
        </div>
        <Link to="/contacts/all" className="btn btn-ghost mt-4">
          ← Retour aux contacts
        </Link>
      </div>
    );
  }

  const contact = res.data;
  
  // Vérifier si l'email du contact correspond à un utilisateur
  useEffect(() => {
    const checkIfUser = async () => {
      if (!contact.email || !isAuthenticated) {
        setIsUserContact(false);
        return;
      }
      
      setLoading(true);
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          setIsUserContact(false);
          return;
        }
        
        const response = await api.get(`/users/check-email/${contact.email}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsUserContact(response.data.exists);
      } catch (error: any) {
        console.error('Erreur vérification email:', error);
        setIsUserContact(false);
        
        // Si erreur d'authentification, déconnecter l'utilisateur
        if (error?.response?.status === 401) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
          window.dispatchEvent(new Event('authChange'));
        }
      } finally {
        setLoading(false);
      }
    };

    checkIfUser();
  }, [contact.email, isAuthenticated]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Date invalide';
      return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Date non disponible';
    }
  };

  const contactId = contact.id || contact._id;
  
  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Section Informations Contact */}
      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          {/* En-tête avec avatar et nom */}
          <div className="flex items-center gap-4 mb-6">
            <div className="avatar placeholder">
              <div className="bg-primary text-primary-content rounded-full w-16">
                <span className="text-xl font-bold">
                  {contact.firstname?.[0]}{contact.lastname?.[0]}
                </span>
              </div>
            </div>
            <div>
              <h1 className="card-title text-2xl">
                {contact.firstname} {contact.lastname}
              </h1>
              <p className="text-gray-500">Contact</p>
            </div>
          </div>

          {/* Informations de contact */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{contact.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <div>
                <p className="text-sm text-gray-500">Téléphone</p>
                <p className="font-medium">{contact.phone}</p>
              </div>
            </div>
          </div>

          {/* Métadonnées */}
          <div className="border-t pt-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">ID du contact:</span>
              <span className="font-mono text-xs bg-base-200 px-2 py-1 rounded">
                {contactId}
              </span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Créé le:</span>
              <span className="font-medium">{formatDate(contact.createdAt)}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Modifié le:</span>
              <span className="font-medium">{formatDate(contact.updatedAt)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="card-actions justify-end mt-6 gap-2">
            <Link to="/contacts/all" className="btn btn-ghost">
              ← Retour
            </Link>
            
            {/* Bouton Chat conditionnel */}
            {isUserContact && (
              <button 
                onClick={() => setShowChat(!showChat)}
                className="btn btn-secondary"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    {showChat ? 'Masquer le chat' : 'Ouvrir le chat'}
                  </>
                )}
              </button>
            )}
            
            <Link to={`/contacts/${contactId}/edit`} className="btn btn-primary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Modifier
            </Link>
            
            <Link to={`/contacts/${contactId}/delete`} className="btn btn-error">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Supprimer
            </Link>
          </div>
        </div>
      </div>

      {/* Section Chat conditionnelle */}
      {showChat && isUserContact && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title text-lg mb-4">
              💬 Conversation avec {contact.firstname} {contact.lastname}
            </h3>
            {/* <ChatInterface contactEmail={contact.email} /> */}
          </div>
        </div>
      )}
    </div>
  );
}