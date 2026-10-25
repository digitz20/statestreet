import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, Button, Chip, Alert } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminSupportPage: React.FC = () => {
  const { adminId } = useParams()
  const [conversations, setConversations] = useState<Array<any>>([])
  const [loading, setLoading] = useState(true)
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [messages, setMessages] = useState<Array<any>>([])
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({ status: '', priority: '' })
  const navigate = useNavigate()
  const [io] = useState(() => {
    // Socket.io will be injected by the app
    return null
  })

  useEffect(() => {
    const loadConversations = async () => {
      try {
        const response = await axios.get(`/api/v1/chat/admin/conversations?status=${filters.status}&priority=${filters.priority}`)
        setConversations(response.data.data)
      } catch (error) {
        console.error('Error loading conversations:', error)
      } finally {
        setLoading(false)
      }
    }

    loadConversations()
  }, [filters.status, filters.priority])

  useEffect(() => {
    // Set up socket.io listener for real-time updates
    const setupSocketListeners = () => {
      if (!io) return

      io.on('conversation_update', (data) => {
        // Update conversation in state
        setConversations(prev => prev.map(c =>
          c._id === data.conversationId
            ? { ...c, lastMessage: data.lastMessage, lastMessageAt: data.lastMessageAt, unreadCount: data.unreadCount }
            : c
        ))
      })

      io.on('messages_read', (data) => {
        console.log('Messages read:', data)
      })
    }

    setupSocketListeners()
    return () => {
      io?.off('conversation_update')
      io?.off('messages_read')
    }
  }, [io])

  const handleStatusChange = async (conversationId: string, status: string) => {
    await axios.patch(`/api/v1/chat/conversations/${conversationId}/status`, { status })
    setFilters(prev => ({ ...prev, status: '' }))
    loadConversations()
  }

  const handleAssign = async (conversationId: string, adminId: string) => {
    await axios.post(`/api/v1/chat/admin/conversations/${conversationId}/assign`, { adminId })
    loadConversations()
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Admin Support Dashboard
      </Typography>

      {/* Filters Section */}
      <Box sx={{ mb: 3, p: 2, bgcolor: 'background', borderRadius: 1 }}>
        <Typography variant="subtitle1" sx={{ mr: 2 }}>Status:</Typography>
        <Chip
          variant="outlined"
          color="primary"
          label="All"
          onClick={() => setFilters(prev => ({ ...prev, status: '' }))}
          selected={!filters.status}
        />
        <Chip
          variant="outlined"
          color="primary"
          label="Open"
          onClick={() => setFilters(prev => ({ ...prev, status: 'open' }))}
          selected={filters.status === 'open'}
        />
        <Chip
          variant="outlined"
          color="primary"
          label="Pending"
          onClick={() => setFilters(prev => ({ ...prev, status: 'pending' }))}
          selected={filters.status === 'pending'}
        />
        <Chip
          variant="outlined"
          color="primary"
          label="Closed"
          onClick={() => setFilters(prev => ({ ...prev, status: 'closed' }))}
          selected={filters.status === 'closed'}
        />

        <Typography variant="subtitle1" sx={{ mr: 2 }}>Priority:</Typography>
        <Chip
          variant="outlined"
          color="primary"
          label="All"
          onClick={() => setFilters(prev => ({ ...prev, priority: '' }))}
          selected={!filters.priority}
        />
        <Chip
          variant="outlined"
          color="primary"
          label="Low"
          onClick={() => setFilters(prev => ({ ...prev, priority: 'low' }))}
          selected={filters.priority === 'low'}
        />
        <Chip
          variant="outlined"
          color="primary"
          label="Medium"
          onClick={() => setFilters(prev => ({ ...prev, priority: 'medium' }))}
          selected={filters.priority === 'medium'}
        />
        <Chip
          variant="outlined"
          color="primary"
          label="High"
          onClick={() => setFilters(prev => ({ ...prev, priority: 'high' }))}
          selected={filters.priority === 'high'}
        />
        <Chip
          variant="outlined"
          color="primary"
          label="Urgent"
          onClick={() => setFilters(prev => ({ ...prev, priority: 'urgent' }))}
          selected={filters.priority === 'urgent'}
        />
      </Box>

      {/* Conversations Table */}
      <Box sx={{ my: 3 }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 600 }}>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Messages</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colspan={6}>Loading...</TableCell>
                </TableRow>
              ) : (
                conversations.map((conversation: any) => (
                  <TableRow key={conversation._id} sx={{ '&:last-child > td': { border: 0 } }}>
                    <TableCell component="td" sx={{ fontWeight: 500 }}>
                      {conversation.user?.fullName || 'Unknown'}
                    </TableCell>
                    <TableCell component="td">{conversation.subject || 'General Support'}</TableCell>
                    <TableCell>
                      <Chip
                        variant="outline"
                        color={conversation.priority === 'urgent' ? 'error' : conversation.priority === 'high' ? 'warning' : 'primary'}
                      >
                        {conversation.priority}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <Chip
                        variant="outline"
                        color={conversation.status === 'closed' ? 'secondary' : conversation.status === 'open' ? 'primary' : 'warning'}
                      >
                        {conversation.status}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      {conversation.lastMessage ? (
                        <Typography variant="body2" color="text.secondary">
                          {conversation.lastMessage.substring(0, 50)}{conversation.lastMessage.length > 50 ? '...' : ''}
                        </Typography>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No messages yet
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{ mr: 1 }}
                        onClick={() => setSelectedConversation(conversation._id)}
                      >
                        View
                      </Button>
                      {conversation.admin?._id?.toString() !== 'admin' && (
                        <Button
                          variant="outlined"
                          color="secondary"
                          onClick={() => handleAssign(conversation._id, adminId)}
                        >
                          Assign
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Selected Conversation Details */}
      {selectedConversation && (
        <Box sx={{ p: 2, bgcolor: 'background', borderRadius: 1, mb: 3 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            {selectedConversation ? 'Conversation: ' + (selectedConversations?.user?.fullName || 'Unknown') : ''}
          </Typography>

          <Typography variant="subtitle1">Messages:</Typography>
          <Box sx={{ height: 300, overflowY: 'auto', p: 1, bgcolor: 'background', borderRadius: 1 }}>
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
            <Typography variant="subtitle1">Send Message:</Typography>
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

export default AdminSupportPage