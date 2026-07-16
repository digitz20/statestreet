import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import transactionService from '../services/transactionService';

interface Transaction {
  _id: string;
  user: string;
  type: 'deposit' | 'withdrawal' | 'trade';
  tradeType?: 'buy' | 'sell';
  symbol?: string;
  duration?: number;
  amount: number;
  wallet?: string;
  address?: string;
  paymentProofs?: Array<{ imageUrl: string; publicId: string }>;
  status: 'pending' | 'completed' | 'failed' | 'active';
  date: string;
  createdAt: string;
  updatedAt: string;
}

const HistoryPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const userString = localStorage.getItem('user');
  const userId = userString ? JSON.parse(userString)._id : null;

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!userId) {
        setError('User not logged in or ID not found.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await transactionService.getTransactions(userId);
        // Assuming the transactions are nested under dashboard.tradeHistory
        setTransactions(response.data.dashboard.transaction || []);
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setError('Failed to fetch transaction history.');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [userId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Transaction History
      </Typography>
      {transactions.length === 0 ? (
        <Typography>No transactions found.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="transaction history table">
            <TableHead>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>Symbol</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="right">Duration</TableCell>
                <TableCell>Timestamp</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction._id}>
                  <TableCell component="th" scope="row">
                    {transaction.type}
                  </TableCell>
                  <TableCell>{transaction.symbol}</TableCell>
                  <TableCell align="right">{transaction.amount}</TableCell>
                  <TableCell align="right">{transaction.duration || 'N/A'}</TableCell>
                  <TableCell>{new Date(transaction.date).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default HistoryPage;