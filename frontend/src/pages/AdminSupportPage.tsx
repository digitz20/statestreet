import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Chip, Paper, TextField, CircularProgress } from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://added-desiree-webtool-a80f54c4.koyeb.app/api/v1';

const AdminSupportPage: React.FC = () => {
  const { adminId } = useParams()
  const [conversations, setConversations] = useState<Array<any>>([])
  const [loading, setLoading] = useState(true)
  const [selectedConversation, setSelectedConversation] = useState<any>(null)
  const [messages] = useState<Array<any>>([])
  const [filters, setFilters] = useState({ status: '', priority: '' })
  const [io] = useState<any>(null)

  const loadConversations = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken')
      const response = await axios.get(`${API_BASE_URL}/chat/admin/conversations?status=${filters.status}&priority=${filters.priority}`, {
        headers: adminToken ? { Authorization: `Bearer ${adminToken}` } : {}
      })
      setConversations(response.data.data || [])
    } catch (error) {
      console.error('Error loading conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadConversations()
  }, [filters.status, filters.priority])

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

      io.on('messages_read', (data: any) => {
        console.log('Messages read:', data)
      })
    }

    setupSocketListeners()
    return () => {
      io?.off('conversation_update')
      io?.off('messages_read')
    }
  }, [io])

  const handleAssign = async (conversationId: string, adminId: string) => {
    try {
      const adminToken = localStorage.getItem('adminToken')
      await axios.post(`${API_BASE_URL}/chat/admin/conversations/${conversationId}/assign`, { adminId }, {
        headers: adminToken ? { Authorization: `Bearer ${adminToken}` } : {}
      })
      loadConversations()
    } catch (error) {
      console.error('Assign failed:', error)
    }
  }

  const priorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'error'
      case 'high': return 'warning'
      case 'medium': return 'info'
      case 'low': return 'success'
      default: return 'primary'
    }
  }

  const statusColor = (status: string) => {
    switch (status) {
      case 'closed': return 'secondary'
      case 'open': return 'primary'
      case 'pending': return 'warning'
      default: return 'default'
    }
  }

  return (
    <Box sx={{ background: 'linear(to bottom right, #f8fafc 0%, #e2e8f0 100%)', minHeight: '100vh', px: 3, py: 4 }}>
      <Box sx={{ maxWidth: 1300, mx: 'auto' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
              Support Center
            </Typography>
            <Typography variant="subtitle1" sx={{ color: '#64748b', mt: 0.5 }}>
              Manage and respond to customer conversations
            </Typography>
          </Box>
          <Chip label="Admin Support" sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 700, textTransform: 'none', borderRadius: '10px', height: 36 }} />
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
            <CircularProgress size={40} sx={{ color: 'primary.main' }} />
          </Box>
        ) : (
          <>
            {/* Filters */}
            <Paper sx={{ p: 3, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.5)', boxShadow: '0 12px 32px -8px rgba(0,0,0,0.08)', mb: 4 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a', mb: 2, display: 'block', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.08em' }}>
                Filters
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'end' }}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#475569', fontWeight: 600, mr: 1, whiteSpace: 'nowrap' }}>Status:</Typography>
                  <Chip variant="outlined" color="primary" label="All" onClick={() => setFilters(prev => ({ ...prev, status: '' }))} sx={{ fontWeight: 600, borderRadius: '10px', height: 34 }} />
                  <Chip variant="outlined" color="primary" label="Open" onClick={() => setFilters(prev => ({ ...prev, status: 'open' }))} sx={{ fontWeight: 600, borderRadius: '10px', height: 34 }} />
                  <Chip variant="outlined" color="primary" label="Pending" onClick={() => setFilters(prev => ({ ...prev, status: 'pending' }))} sx={{ fontWeight: 600, borderRadius: '10px', height: 34 }} />
                  <Chip variant="outlined" color="primary" label="Closed" onClick={() => setFilters(prev => ({ ...prev, status: 'closed' }))} sx={{ fontWeight: 600, borderRadius: '10px', height: 34 }} />
                </Box>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', ml: 2 }}>
                  <Typography variant="body2" sx={{ color: '#475569', fontWeight: 600, mr: 1, whiteSpace: 'nowrap' }}>Priority:</Typography>
                  <Chip variant="outlined" color="primary" label="All" onClick={() => setFilters(prev => ({ ...prev, priority: '' }))} sx={{ fontWeight: 600, borderRadius: '10px', height: 34 }} />
                  <Chip variant="outlined" color="primary" label="Low" onClick={() => setFilters(prev => ({ ...prev, priority: 'low' }))} sx={{ fontWeight: 600, borderRadius: '10px', height: 34 }} />
                  <Chip variant="outlined" color="primary" label="Medium" onClick={() => setFilters(prev => ({ ...prev, priority: 'medium' }))} sx={{ fontWeight: 600, borderRadius: '10px', height: 34 }} />
                  <Chip variant="outlined" color="primary" label="High" onClick={() => setFilters(prev => ({ ...prev, priority: 'high' }))} sx={{ fontWeight: 600, borderRadius: '10px', height: 34 }} />
                  <Chip variant="outlined" color="primary" label="Urgent" onClick={() => setFilters(prev => ({ ...prev, priority: 'urgent' }))} sx={{ fontWeight: 600, borderRadius: '10px', height: 34 }} />
                </Box>
              </Box>
            </Paper>

            {/* Conversations Table */}
            <Paper sx={{ p: 0, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.5)', boxShadow: '0 12px 32px -8px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
              <TableContainer component={Paper} sx={{ p: 0, bgcolor: 'transparent', boxShadow: 'none', border: 'none' }}>
                <Table sx={{ minWidth: 700 }} size="small">
                  <TableHead sx={{ backgroundColor: '#f1f5f9' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>User</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Subject</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Priority</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Last Message</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {conversations.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4, color: '#64748b' }}>
                          No conversations found
                        </TableCell>
                      </TableRow>
                    ) : (
                      conversations.map((conversation: any) => (
                        <TableRow key={conversation._id} sx={{ '&:hover': { backgroundColor: 'rgba(16, 185, 129, 0.05)' }, '&:last-child > td': { border: 0 } }}>
                          <TableCell component="td" sx={{ fontWeight: 600, color: '#0f172a' }}>
                            {conversation.user?.fullName || 'Unknown'}
                          </TableCell>
                          <TableCell component="td" sx={{ color: '#475569' }}>
                            {conversation.subject || 'General Support'}
                          </TableCell>
                          <TableCell>
                            <Chip variant="outlined" color={priorityColor(conversation.priority)} label={String(conversation.priority).charAt(0).toUpperCase() + String(conversation.priority).slice(1)} sx={{ fontWeight: 600, borderRadius: '8px', height: 28, fontSize: '0.75rem' }} />
                          </TableCell>
                          <TableCell>
                            <Chip variant="outlined" color={statusColor(conversation.status)} label={String(conversation.status).charAt(0).toUpperCase() + String(conversation.status).slice(1)} sx={{ fontWeight: 600, borderRadius: '8px', height: 28, fontSize: '0.75rem' }} />
                          </TableCell>
                          <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#475569', fontSize: '0.9rem' }}>
                            {conversation.lastMessage ? (conversation.lastMessage.length > 50 ? conversation.lastMessage.substring(0, 50) + '...' : conversation.lastMessage) : 'No messages yet'}
                          </TableCell>
                          <TableCell sx={{ display: 'flex', gap: 1 }}>
                            <Button variant="outlined" size="small" color="primary" onClick={() => setSelectedConversation(conversation._id)} sx={{ fontWeight: 600, textTransform: 'none', borderRadius: '8px', py: 0.8 }}>
                              View
                            </Button>
                            {conversation.admin?._id?.toString() !== 'admin' && (
                              <Button variant="outlined" size="small" color="secondary" onClick={() => handleAssign(conversation._id, adminId ?? '')} sx={{ fontWeight: 600, textTransform: 'none', borderRadius: '8px', py: 0.8 }}>
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
            </Paper>

            {/* Selected Conversation Details */}
            {selectedConversation && (
              <Box sx={{ mt: 4, p: 3, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.5)', boxShadow: '0 12px 32px -8px rgba(0,0,0,0.08)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#0f172a' }}>
                    Conversation: {selectedConversation?.user?.fullName || 'Unknown'}
                  </Typography>
                  <Button variant="outlined" size="small" onClick={() => setSelectedConversation(null)} sx={{ textTransform: 'none', fontWeight: 600, color: '#64748b' }}>
                    Back
                  </Button>
                </Box>

                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#475569', mb: 2, display: 'block' }}>Messages</Typography>
                <Box sx={{ height: 340, overflowY: 'auto', p: 1, borderRadius: 1, bgcolor: '#f8fafc', border: '1px solid rgba(0,0,0,0.04)' }}>
                  {messages.length === 0 ? (
                    <Box sx={{ p: 3, textAlign: 'center', color: '#64748b' }}>No messages yet</Box>
                  ) : (
                    messages.map((msg: any, index: number) => (
                      <Box key={index} sx={{ p: 1.5, mb: 2, borderRadius: 1, bgcolor: msg.senderType === 'admin' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.6)', border: `1px solid ${msg.senderType === 'admin' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(0,0,0,0.06)'}` }}>
                        <Typography variant="body1" sx={{ fontWeight: msg.senderType === 'admin' ? 700 : 600, color: msg.senderType === 'admin' ? '#15803d' : '#0f172a', mb: 0.5 }}>
                          {msg.sender?.fullName || 'Unknown'}{msg.senderType === 'admin' ? ' (Admin)' : ''}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748b', mb: 1 }}>
                          {new Date(msg.createdAt).toLocaleString([], { hour: '2-digit', minute: '2-digit' })}
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#334155', whiteSpace: 'pre-wrap' }}>
                          {msg.content}
                        </Typography>
                      </Box>
                    ))
                  )}
                </Box>

                <Box sx={{ mt: 3, p: 2, borderRadius: 1, bgcolor: '#f8fafc', border: '1px solid rgba(0,0,0,0.04)' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#475569', mb: 1.5, display: 'block' }}>Send Message</Typography>
                  <TextField
                    multiline
                    rows={3}
                    placeholder="Type your message..."
                    variant="outlined"
                    fullWidth
                    sx={{
                      mt: 0.5,
                      borderRadius: 1,
                      '& .MuiOutlinedInput-root': {
                        bgcolor: '#f8fafc',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.95rem',
                        '&:focus-within': {
                          borderColor: 'primary.main',
                          boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.15)'
                        }
                      }
                    }}
                  />
                  <Button variant="contained" color="primary" sx={{ mt: 1.5, width: '100%', fontWeight: 700, textTransform: 'none', borderRadius: '10px', py: 1 }}>
                    Send Message
                  </Button>
                </Box>
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  )
}

export default AdminSupportPage
