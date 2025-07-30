import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Checkbox,
  IconButton,
  Typography,
  Box,
  Menu,
  MenuItem,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';

const TodoItem = ({ todo, onToggle, onDelete }) => {
  const [menuAnchor, setMenuAnchor] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const isOverdue = () => {
    if (!todo.due_date || todo.completed) return false;
    return new Date(todo.due_date) < new Date();
  };

  // 우클릭 메뉴 핸들러
  const handleContextMenu = (e) => {
    e.preventDefault();
    setMenuAnchor(e.currentTarget);
  };
  const handleCloseMenu = () => setMenuAnchor(null);
  const handleDelete = () => {
    onDelete(todo.id);
    handleCloseMenu();
  };

  return (
    <Card
      elevation={2}
      sx={{
        minHeight: 60,
        height: 60,
        display: 'flex',
        alignItems: 'center',
        px: 2,
        py: 0.5,
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(102,126,234,0.06)',
        border: isOverdue() ? '2px solid #dc3545' : '1px solid #e0e0e0',
        bgcolor: todo.completed ? 'grey.100' : 'white',
        opacity: todo.completed ? 0.7 : 1,
        transition: 'all 0.2s',
        cursor: 'context-menu',
      }}
      onContextMenu={handleContextMenu}
    >
      <Checkbox
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        color="primary"
        sx={{ mr: 1 }}
      />
      <Box sx={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
        <Typography
          variant="body2"
          noWrap
          sx={{
            textDecoration: todo.completed ? 'line-through' : 'none',
            color: todo.completed ? 'text.secondary' : 'text.primary',
            fontWeight: 500,
            fontSize: '1rem',
          }}
        >
          {todo.text}
        </Typography>
        {todo.due_date && (
          <Typography
            variant="caption"
            color={isOverdue() ? 'error' : 'text.secondary'}
            sx={{ fontWeight: isOverdue() ? 700 : 400, ml: 1 }}
          >
            {formatDate(todo.due_date)}
          </Typography>
        )}
      </Box>
      {/* 우클릭 메뉴 */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          삭제
        </MenuItem>
      </Menu>
    </Card>
  );
};

export default TodoItem; 