import React, { useEffect, useState } from 'react';
import { Box, Typography, Chip, Button } from '@mui/material';
import axios from 'axios';

const AdminChatPage: React.FC = () => {
  const [conversations, setConversations] = useState<Array<any>>([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [messages, setMessages] = useState<Array<any>>([])
  const [io] = useState<any>(null)

  useEffect(() => {
    const loadConversations = async () => {
      try {
        const response = await axios.get(`/api/v1/chat/admin/conversations`)
        setConversations(response.data.data)
      } catch (error) {
        console.error('Error loading conversations:', error)
      } finally {
        setLoading(false)
      }
    }

    loadConversations()
  }, [])

  useEffect(() => {
    const setupSocketListeners = () => {
      if (!io) return

      io.on('conversation_update', (data: any) => {
        setConversations(prev => prev.map(c =>
          c._id === data.conversationId
            ? { ...c, lastMessage: data.lastMessage, lastMessageAt: data.lastMessageAt, unreadCount: data.unreadCount }
            : c
        ))
      })
    }

    setupSocketListeners()
    return () => {
      io?.off('conversation_update')
    }
  }, [io])

  const handleSelectUser = async (userId: string) => {
    setSelectedUser(userId)
    setMessages([])

    try {
      const response = await axios.get(`/api/v1/chat/conversations/${userId}`)
      setMessages(response.data.data.messages)
    } catch (error) {
      console.error('Error loading conversation:', error)
    }
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Admin Chat Support
      </Typography>

      {/* Users List */}
      <Box sx={{ mb: 3, bgcolor: 'background', borderRadius: 1, p: 2 }}>
        <Typography variant="subtitle1" sx={{ mr: 2 }}>Select User:</Typography>
        {loading ? (
          <Typography>Loading...</Typography>
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
                sx={{ marginRight: 8, marginBottom: 4 }}
              />
            )
          })
        )}
      </Box>

      {/* Chat Area */}
      {selectedUser && (
        <Box sx={{ p: 2, bgcolor: 'background', borderRadius: 1, minHeight: 500 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Chat with {selectedUser?.fullName || 'User'}
          </Typography>

          <Typography variant="subtitle1">Messages:</Typography>
          <Box sx={{ height: 400, overflowY: 'auto', p: 1, bgcolor: 'background', borderRadius: 1 }}>
            {messages.map((msg: any, index: number) => (
              <Box key={index} sx={{ p: 1, bgcolor: msg.senderType === 'admin' ? 'background' : 'surface', borderRadius: 1, mb: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: msg.senderType === 'admin' ? 600 : 400 }}>
                  {msg.sender?.fullName || 'Unknown'}{msg.senderType === 'admin' ? ' (Admin)' : ''}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </Typography>
                <Typography variant="body1">{msg.content}</Typography>
              </Box>
            ))}
          </Box>

          <Box sx={{ p: 1, bgcolor: 'background', borderRadius: 1, mt: 2 }}>
            <Typography variant="body1">Send Message:</Typography>
            <textarea
              rows={3}
              placeholder="Type your message..."
              style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ddd' }}
            />
            <Button variant="contained" color="primary" sx={{ mt: 1, width: '100%' }}>
              Send
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default AdminChatPage