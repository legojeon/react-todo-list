import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import AccountCircle from '@mui/icons-material/AccountCircle';

const ProfileDialog = ({ open, onClose, onLogout, username }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle align="center">Profile</DialogTitle>
      <DialogContent>
        <Stack spacing={3} alignItems="center" mt={1} mb={1}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 64, height: 64 }}>
            <AccountCircle sx={{ fontSize: 48 }} />
          </Avatar>
          <Typography variant="h6" color="text.primary">
            {username || 'User'}
          </Typography>
          <Button variant="outlined" color="primary" fullWidth>Settings</Button>
          <Button variant="outlined" color="primary" fullWidth>Profile</Button>
          <Button variant="contained" color="error" fullWidth onClick={onLogout}>Logout</Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileDialog; 