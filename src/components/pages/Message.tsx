// // Message.tsx - Remplacer tout le fichier par :
// import React, { useState, useEffect } from "react";
// import { sendMessage, getConversation } from "../../services/messageApi";
// import { useAuth } from "../hooks/useAuth";

// type MessageItem = {
//   _id: string;
//   from: string | { _id?: string; name?: string; email?: string };
//   to: string | { _id?: string; name?: string; email?: string };
//   toEmail?: string;
//   subject?: string;
//   body: string;
//   read?: boolean;
//   createdAt?: string;
// };

// // ✅ Export nommé correct
// export function Message() {
//   const { isAuthenticated, user } = useAuth();
//   const [toEmail, setToEmail] = useState("");
//   const [subject, setSubject] = useState("");
//   const [body, setBody] = useState("");
//   const [convEmail, setConvEmail] = useState("");
//   const [messages, setMessages] = useState<MessageItem[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [sending, setSending] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // helper pour comparer ids (ObjectId ou string)
//   const isSameId = (idA: any, idB: any) => {
//     if (!idA || !idB) return false;
//     try {
//       const a = typeof idA === "object" ? (idA._id ?? idA.toString()) : idA.toString();
//       const b = typeof idB === "object" ? (idB._id ?? idB.toString()) : idB.toString();
//       return a === b;
//     } catch {
//       return false;
//     }
//   };

//   const handleSend = async (e?: React.FormEvent) => {
//     if (e) e.preventDefault();
//     setError(null);

//     if (!isAuthenticated) return setError("Vous devez être connecté.");
//     const token = localStorage.getItem('authToken');
//     if (!token) return setError("Token manquant.");
    
//     const trimmedEmail = toEmail.trim().toLowerCase();
//     const trimmedBody = body.trim();

//     if (!trimmedEmail || !trimmedBody) return setError("Email destinataire et message requis.");
//     if (trimmedBody.length > 2000) return setError("Message trop long (max 2000 caractères).");

//     setSending(true);
//     try {
//       await sendMessage(token, trimmedEmail, subject.trim(), trimmedBody);
//       setBody("");
//       setSubject("");
//       // recharger la conversation automatiquement si on est déjà sur celle-là
//       if (convEmail && convEmail.toLowerCase().trim() === trimmedEmail) {
//         await loadConversation(trimmedEmail);
//       }
//     } catch (err: any) {
//       const errorMessage = err?.response?.data?.message || err.message || "Erreur lors de l'envoi";
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

//   const loadConversation = async (emailParam?: string) => {
//     setError(null);
//     const token = localStorage.getItem('authToken');
//     if (!token) return setError("Authentification requise.");
//     const emailToLoad = (emailParam ?? convEmail).trim();
//     if (!emailToLoad) return setError("Indique l'email de la conversation.");
//     setLoading(true);
//     try {
//       const res = await getConversation(token, emailToLoad);
//       setMessages(res.data.data || []);
//     } catch (err: any) {
//       const errorMessage = err?.response?.data?.message || err.message || "Erreur chargement conversations";
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

//   useEffect(() => {
//     if (convEmail && convEmail.trim()) {
//       // debounce léger si l'utilisateur tape
//       const t = setTimeout(() => loadConversation(convEmail.trim()), 350);
//       return () => clearTimeout(t);
//     }
//   }, [convEmail]);

//   // rendu d'un message (texte échappé naturellement par React => safe)
//   const renderMessage = (m: MessageItem) => {
//     const fromIsMe =
//       user && (isSameId(m.from, user._id) || (typeof m.from === "string" && m.from === user._id));
//     const who = fromIsMe ? "Moi" : (typeof m.from === "object" ? (m.from.name || m.from.email || "Contact") : m.from);
//     return (
//       <li
//         key={m._id}
//         className={fromIsMe ? "msg-row msg-row-me" : "msg-row msg-row-other"}
//         aria-live="polite"
//       >
//         <div className="msg-meta">
//           <strong>{who}</strong>
//           <small>{m.subject ? ` — ${m.subject}` : ""}</small>
//         </div>
//         <div className="msg-body">{m.body}</div>
//         <div className="msg-time">{m.createdAt ? new Date(m.createdAt).toLocaleString() : ""}</div>
//       </li>
//     );
//   };

//   return (
//     <div className="messages-page container">
//       <h2 className="title">Messagerie</h2>

//       {error && <div className="alert alert-error">{error}</div>}

//       <section className="send-card card">
//         <h3>Envoyer</h3>
//         <form onSubmit={handleSend} className="send-form">
//           <div className="form-row">
//             <input
//               className="input input-bordered"
//               placeholder="Destinataire (email)"
//               value={toEmail}
//               onChange={(e) => setToEmail(e.target.value)}
//               type="email"
//               required
//             />
//             <input
//               className="input input-bordered"
//               placeholder="Sujet (optionnel)"
//               value={subject}
//               onChange={(e) => setSubject(e.target.value)}
//             />
//           </div>
//           <textarea
//             className="textarea textarea-bordered"
//             placeholder="Écrire votre message..."
//             value={body}
//             onChange={(e) => setBody(e.target.value)}
//             rows={6}
//             maxLength={2000}
//             required
//           />
//           <div className="form-actions">
//             <button className="btn btn-primary" type="submit" disabled={sending}>
//               {sending ? "Envoi..." : "Envoyer"}
//             </button>
//             <button
//               type="button"
//               className="btn btn-ghost"
//               onClick={() => {
//                 setToEmail("");
//                 setBody("");
//                 setSubject("");
//                 setError(null);
//               }}
//             >
//               Réinitialiser
//             </button>
//           </div>
//         </form>
//       </section>

//       <section className="conv-card card">
//         <h3>Conversation</h3>
//         <div className="form-row">
//           <input
//             className="input input-bordered"
//             placeholder="Email de la conversation"
//             value={convEmail}
//             onChange={(e) => setConvEmail(e.target.value)}
//           />
//           <button className="btn btn-ghost" onClick={() => loadConversation()}>
//             {loading ? "Chargement..." : "Charger"}
//           </button>
//         </div>

//         <ul className="messages-list">
//           {messages.length === 0 && <li className="muted">Aucun message</li>}
//           {messages.map(renderMessage)}
//         </ul>
//       </section>
//     </div>
//   );
// }

// // ✅ Optionnel : garder l'export default aussi
// export default Message;