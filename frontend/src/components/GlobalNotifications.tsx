import React, { useEffect, useState } from 'react';
import { Box, Paper, Slide, Stack, Typography } from '@mui/material';

type NotificationItem = {
  id: number;
  title: string;
  detail: string;
};

const messages: NotificationItem[] = [
  { id: 1, title: 'Withdrawal alert', detail: 'A secure withdrawal request has just moved through the routing layer.' },
  { id: 2, title: 'Deposit activity', detail: 'A fresh deposit has cleared and is now visible in the dashboard.' },
  { id: 3, title: 'Account update', detail: 'Profile verification and account access have been refreshed.' },
  { id: 4, title: 'Live signal', detail: 'Markets are showing strong movement across crypto and forex channels.' },
];

type HistoryEntry = NotificationItem & {
  instanceId: number;
};

const GlobalNotifications: React.FC = () => {
  const [activeNotification, setActiveNotification] = useState<NotificationItem | null>(null);
  const [visible, setVisible] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    let showTimer: number | undefined;
    let hideTimer: number | undefined;

    const showNotification = () => {
      const item = messages[Math.floor(Math.random() * messages.length)];
      setActiveNotification(item);
      setHistory((prev) => [{ ...item, instanceId: Date.now() + Math.random() }, ...prev].slice(0, 4));
      setVisible(true);

      hideTimer = window.setTimeout(() => {
        setVisible(false);
      }, 3200);

      showTimer = window.setTimeout(showNotification, 6000);
    };

    showNotification();

    return () => {
      if (showTimer) window.clearTimeout(showTimer);
      if (hideTimer) window.clearTimeout(hideTimer);
    };
  }, []);

  return (
    <Box sx={{ position: 'fixed', right: 20, bottom: 20, zIndex: 1300, maxWidth: 360, width: 'calc(100% - 32px)' }}>
      <Slide direction="up" in={visible} mountOnEnter unmountOnExit>
        <Paper elevation={0} sx={{ p: 1.8, borderRadius: 3, bgcolor: 'rgba(2, 6, 23, 0.95)', border: '1px solid rgba(255,255,255,0.16)', boxShadow: '0 16px 40px rgba(0,0,0,0.3)' }}>
          <Typography variant="caption" sx={{ color: '#7dd3fc', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
            {activeNotification?.title}
          </Typography>
          <Typography sx={{ color: 'white', fontWeight: 700, mt: 0.3 }}>{activeNotification?.detail}</Typography>
        </Paper>
      </Slide>
      <Stack spacing={1} sx={{ mt: 1 }}>
        {history.slice(1).map((item) => (
          <Typography key={item.instanceId} sx={{ color: 'rgba(255,255,255,0.74)', fontSize: '0.82rem', pl: 0.3 }}>
            • {item.title}
          </Typography>
        ))}
      </Stack>
    </Box>
  );
};

export default GlobalNotifications;