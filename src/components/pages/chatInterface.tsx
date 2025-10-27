// import React, { useState, useEffect, useRef } from "react";
// import { sendMessage, getConversation } from "../../services/messageApi";
// import { useAuth } from "../hooks/useAuth";

// interface Message {
//   _id: string;
//   from: string | { _id?: string; name?: string; email?: string };
//   to: string | { _id?: string; name?: string; email?: string };
//   toEmail?: string;
//   subject?: string;
//   body: string;
//   read?: boolean;
//   createdAt?: string;
// }

// interface ChatInterfaceProps {
//   contactEmail: string;
// }

// export function ChatInterface({ contactEmail }: ChatInterfaceProps) {
//   const { isAuthenticated, user } = useAuth();
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [sending, setSending] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   // Charger la conversation
//   const loadConversation = async () => {
//     if (!isAuthenticated || !contactEmail) return;
    
//     setLoading(true);
//     setError(null);
//     try {
//       const token = localStorage.getItem('authToken');
//       if (!token) {
//         setError("Token d'authentification manquant");
//         return;
//       }
//       const response = await getConversation(token, contactEmail);
//       setMessages(response.data.data || []);
//     } catch (err: any) {
//       const errorMessage = err?.response?.data?.message || "Erreur lors du chargement des messages";
//       setError(errorMessage);
      
//       // Gestion des erreurs d'authentification
//       if (err?.response?.status === 401) {
//         localStorage.removeItem('authToken');
//         localStorage.removeItem('userData');
//         window.dispatchEvent(new Event('authChange'));
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Envoyer un message
//   const handleSendMessage = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!newMessage.trim() || !isAuthenticated) return;

//     setSending(true);
//     setError(null);
//     try {
//       const token = localStorage.getItem('authToken');
//       if (!token) {
//         setError("Token d'authentification manquant");
//         return;
//       }
      
//       await sendMessage(token, contactEmail, "", newMessage.trim());
      
//       // Recharger les messages après envoi
//       await loadConversation();
//       setNewMessage("");
//     } catch (err: any) {
//       const errorMessage = err?.response?.data?.message || "Erreur lors de l'envoi du message";
//       setError(errorMessage);
      
//       // Gestion des erreurs d'authentification
//       if (err?.response?.status === 401) {
//         localStorage.removeItem('authToken');
//         localStorage.removeItem('userData');
//         window.dispatchEvent(new Event('authChange'));
//       }
//     } finally {
//       setSending(false);
//     }
//   };

//   // Helper pour identifier l'expéditeur
//   const isMessageFromMe = (message: Message) => {
//     if (!user) return false;
//     const fromId = typeof message.from === 'object' ? message.from._id : message.from;
//     return fromId === user._id;
//   };

//   // Scroll vers le bas quand de nouveaux messages arrivent
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // Charger la conversation au montage
//   useEffect(() => {
//     loadConversation();
//   }, [contactEmail]);

//   return (
//     <div className="chat-interface">
//       {error && (
//         <div className="alert alert-error mb-4">
//           <span>{error}</span>
//           <button onClick={() => setError(null)} className="btn btn-ghost btn-sm">
//             ×
//           </button>
//         </div>
//       )}

//       {/* Zone des messages */}
//       <div className="bg-base-200 rounded-lg p-4 h-80 overflow-y-auto mb-4">
//         {loading ? (
//           <div className="flex justify-center items-center h-full">
//             <span className="loading loading-spinner loading-lg"></span>
//           </div>
//         ) : messages.length === 0 ? (
//           <div className="flex justify-center items-center h-full text-gray-500">
//             Aucun message. Envoyez le premier message !
//           </div>
//         ) : (
//           <div className="space-y-3">
//             {messages.map((message) => (
//               <div
//                 key={message._id}
//                 className={`chat ${isMessageFromMe(message) ? 'chat-end' : 'chat-start'}`}
//               >
//                 <div className="chat-header">
//                   {isMessageFromMe(message) ? 'Moi' : 'Contact'}
//                   <time className="text-xs opacity-50 ml-2">
//                     {message.createdAt ? new Date(message.createdAt).toLocaleTimeString('fr-FR', {
//                       hour: '2-digit',
//                       minute: '2-digit'
//                     }) : ''}
//                   </time>
//                 </div>
//                 <div
//                   className={`chat-bubble ${
//                     isMessageFromMe(message) ? 'chat-bubble-primary' : 'chat-bubble-secondary'
//                   }`}
//                 >
//                   {message.body}
//                 </div>
//               </div>
//             ))}
//             <div ref={messagesEndRef} />
//           </div>
//         )}
//       </div>

//       {/* Formulaire d'envoi */}
//       <form onSubmit={handleSendMessage} className="flex gap-2">
//         <input
//           type="text"
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           placeholder="Tapez votre message..."
//           className="input input-bordered flex-1"
//           disabled={sending}
//         />
//         <button
//           type="submit"
//           className="btn btn-primary"
//           disabled={sending || !newMessage.trim()}
//         >
//           {sending ? (
//             <span className="loading loading-spinner loading-sm"></span>
//           ) : (
//             'Envoyer'
//           )}
//         </button>
//       </form>

//       {/* Bouton de rafraîchissement */}
//       <div className="flex justify-center mt-2">
//         <button
//           onClick={loadConversation}
//           disabled={loading}
//           className="btn btn-ghost btn-sm"
//         >
//           {loading ? 'Chargement...' : 'Actualiser'}
//         </button>
//       </div>
//     </div>
//   );
// }