import React, { useEffect, useState } from 'react';
import { Box, Typography, Chip, Button, TextField, CircularProgress } from '@mui/material';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://added-desiree-webtool-a80f54c4.koyeb.app/api/v1';

const AdminChatPage: React.FC = () => {
  const [conversations, setConversations] = useState<Array<any>>([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [messages, setMessages] = useState<Array<any>>([])
  const [messageInput, setMessageInput] = useState('')

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken')
    if (!adminToken) {
      window.location.href = '/admin/login'
      return
    }

    const loadConversations = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/chat/admin/conversations`, {
          headers: { Authorization: `Bearer ${adminToken}` }
        })
        setConversations(response.data.data || [])
      } catch (error) {
        console.error('Error loading conversations:', error)
      } finally {
        setLoading(false)
      }
    }

    loadConversations()
  }, [])

  const handleSelectUser = async (userId: string) => {
    setSelectedUser(null)
    setMessages([])
    try {
      const adminToken = localStorage.getItem('adminToken')
      const response = await axios.get(`${API_BASE_URL}/chat/conversations/${userId}`, {
        headers: adminToken ? { Authorization: `Bearer ${adminToken}` } : {}
      })
      setSelectedUser({ _id: userId, fullName: 'User' })
      setMessages(response.data.data?.messages || [])
    } catch (error) {
      console.error('Error loading conversation:', error)
    }
  }

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || !selectedUser) return
    try {
      const adminToken = localStorage.getItem('adminToken')
      await axios.post(`${API_BASE_URL}/chat/conversations/${selectedUser._id}/messages`, { content }, {
        headers: adminToken ? { Authorization: `Bearer ${adminToken}` } : {}
      })
      const response = await axios.get(`${API_BASE_URL}/chat/conversations/${selectedUser._id}`, {
        headers: adminToken ? { Authorization: `Bearer ${adminToken}` } : {}
      })
      setMessages(response.data.data?.messages || [])
      setMessageInput('')
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <CircularProgress size={40} sx={{ color: 'primary.main' }} />
      </Box>
    )
  }

  return (
    <Box sx={{ background: 'linear(to bottom right, #f8fafc 0%, #e2e8f0 100%)', minHeight: '100vh', px: 3, py: 4 }}>
      <Box sx={{ maxWidth: 1100, mx: 'auto', height: 'calc(100vh - 96px)', display: 'flex', gap: 3 }}>
        {/* Users List */}
        <Box sx={{ width: 340, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.5)', boxShadow: '0 12px 32px -8px rgba(0,0,0,0.08)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ p: 3, borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', mb: 0.5 }}>
              Conversations
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              Select a user to chat
            </Typography>
          </Box>
          <Box sx={{ flex: 1, overflowY: 'auto', p: 1 }}>
            {conversations.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center', color: '#64748b' }}>
                <Typography variant="body2">No conversations yet</Typography>
              </Box>
            ) : (
              conversations.map((conv: any) => {
                const user = conv.user
                const hasUnread = conv.unreadCount?.user > 0
                return (
                  <Chip
                    key={conv._id}
                    label={user?.fullName || 'Unknown'}
                    onClick={() => handleSelectUser(user._id)}
                    color={hasUnread ? 'primary' : 'default'}
                    variant="outlined"
                    sx={{
                      m: 1,
                      borderRadius: '10px',
                      fontWeight: 600,
                      height: 40,
                      borderColor: hasUnread ? 'primary.main' : 'rgba(0,0,0,0.1)',
                      '&:hover': { bgcolor: hasUnread ? 'rgba(16, 185, 129, 0.08)' : 'rgba(0,0,0,0.04)' }
                    }}
                  />
                )
              })
            )}
          </Box>
        </Box>

        {/* Chat Area */}
        {selectedUser && (
          <Box sx={{ flex: 1, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.5)', boxShadow: '0 12px 32px -8px rgba(0,0,0,0.08)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 3, borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#0f172a', mb: 0.25 }}>
                  Chat with {selectedUser.fullName || 'User'}
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b' }}>
                  Active conversation
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip label="Online" size="small" color="success" sx={{ fontWeight: 700, borderRadius: '10px', height: 24 }} />
              </Box>
            </Box>

            <Box sx={{ flex: 1, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              {messages.length === 0 ? (
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                  <Typography variant="body2">No messages yet</Typography>
                  <Typography variant="caption" sx={{ mt: 0.5 }}>Start the conversation</Typography>
                </Box>
              ) : (
                messages.map((msg: any, index: number) => (
                  <Box key={index} sx={{
                    p: 1.5,
                    mb: 1.5,
                    borderRadius: 1,
                    maxWidth: '75%',
                    alignSelf: msg.senderType === 'admin' ? 'flex-end' : 'flex-start',
                    bgcolor: msg.senderType === 'admin' ? 'primary.main' : 'rgba(255,255,255,0.8)',
                    color: msg.senderType === 'admin' ? 'white' : '#0f172a',
                    boxShadow: msg.senderType === 'admin' ? '0 4px 12px rgba(16, 185, 129, 0.3)' : '0 2px 8px rgba(0,0,0,0.06)'
                  }}>
                    <Typography variant="body1" sx={{ fontWeight: 500, mb: 0.25 }}>
                      {msg.senderType === 'admin' ? 'You' : msg.sender?.fullName || 'User'}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: msg.senderType === 'admin' ? 0.9 : 1, whiteSpace: 'pre-wrap' }}>
                      {msg.content}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: msg.senderType === 'admin' ? 0.7 : 0.6, mt: 0.5, alignSelf: msg.senderType === 'admin' ? 'flex-end' : 'flex-start' }}>
                      {new Date(msg.createdAt).toLocaleString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  </Box>
                ))
              )}
            </Box>

            <Box sx={{ p: 2, borderTop: '1px solid rgba(0,0,0,0.06)', bgcolor: 'rgba(255,255,255,0.5)' }}>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <TextField
                  fullWidth
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  label="Type a message..."
                  variant="outlined"
                  sx={{ borderRadius: '12px', fontSize: '0.95rem', '& .MuiOutlinedInput-root': { fieldSx: { borderRadius: '12px' } } }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  disabled={!messageInput.trim() || !selectedUser}
                  sx={{ borderRadius: '12px', fontWeight: 700, textTransform: 'none', px: 3, minWidth: 80 }}
                  onClick={() => {
                    if (messageInput.trim() && selectedUser) {
                      handleSendMessage(messageInput.trim())
                    }
                  }}
                >
                  Send
                </Button>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default AdminChatPage
