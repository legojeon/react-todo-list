import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Add as AddIcon } from '@mui/icons-material';
import dayjs from 'dayjs';

const TodoForm = ({ onAddTodo }) => {
  const [text, setText] = useState('');
  const [createdAt, setCreatedAt] = useState(null);
  const [dueDate, setDueDate] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      const todoData = {
        text: text.trim(),
        created_at: createdAt ? createdAt.format('YYYY-MM-DD') : null,
        due_date: dueDate ? dueDate.format('YYYY-MM-DD') : null
      };
      onAddTodo(todoData);
      setText('');
      setCreatedAt(null);
      setDueDate(null);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        pt: 4,
        pb: 2,
        px: { xs: 1, sm: 3 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        borderBottom: 0,
        borderColor: 'divider',
        bgcolor: 'transparent',
      }}
    >
      {/* 입력창 한 줄 */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          maxWidth: 800,
          mb: 2,
          gap: 2,
        }}
      >
        <TextField
          fullWidth
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="할 일을 입력하세요..."
          variant="outlined"
          size="medium"
          required
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            },
            fontSize: '1.2rem',
          }}
        />
        <Button
          type="submit"
          variant="contained"
          size="large"
          startIcon={<AddIcon />}
          sx={{
            borderRadius: 2,
            px: 3,
            minWidth: 100,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)',
            },
            transition: 'all 0.2s ease',
          }}
        >
          add
        </Button>
      </Box>

      {/* 날짜 선택 두 개를 한 줄에 */}
      <Grid container spacing={2} justifyContent="center" sx={{ maxWidth: 800 }}>
        <Grid item xs={12} sm={6}>
          <DatePicker
            label="Planned date"
            value={createdAt}
            onChange={(newValue) => setCreatedAt(newValue)}
            slotProps={{
              textField: {
                fullWidth: true,
                size: 'small',
                helperText: 'Defaults to today',
                sx: {
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                },
              },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <DatePicker
            label="Due date"
            value={dueDate}
            onChange={(newValue) => setDueDate(newValue)}
            slotProps={{
              textField: {
                fullWidth: true,
                size: 'small',
                helperText: 'optional',
                sx: {
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                },
              },
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default TodoForm; 