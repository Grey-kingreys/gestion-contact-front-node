import api from './api';

export const sendMessage = async (token: string, toEmail: string, subject: string, body: string) => {
  return api.post('/messages/send', { toEmail, subject, body }, { 
    headers: { Authorization: `Bearer ${token}` } 
  });
}

export const getConversation = async (token: string, email: string) => {
  return api.get(`/messages/conversation/${encodeURIComponent(email)}`, { 
    headers: { Authorization: `Bearer ${token}` } 
  });
}