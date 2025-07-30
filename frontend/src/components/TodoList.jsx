import React, { useState } from 'react';
import { Box, Typography, Grid, Slide } from '@mui/material';
import TodoItem from './TodoItem';

const TodoList = ({ todos, onToggleTodo, onDeleteTodo }) => {
  // 각 todo의 id별로 Slide 상태 관리
  const [slideIn, setSlideIn] = useState({});

  React.useEffect(() => {
    // 새로 들어온 todos는 항상 true로
    const newSlideIn = {};
    todos.forEach(todo => {
      newSlideIn[todo.id] = true;
    });
    setSlideIn(prev => ({ ...newSlideIn, ...prev }));
  }, [todos]);

  const handleToggle = (id) => {
    // Slide out 먼저, 300ms 후 실제 toggle
    setSlideIn(prev => ({ ...prev, [id]: false }));
    setTimeout(() => {
      onToggleTodo(id);
    }, 300);
  };

  if (todos.length === 0) {
    return (
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4,
        }}
      >
        <Typography
          variant="body1"
          color="text.secondary"
          align="center"
          sx={{ fontSize: '1.1rem' }}
        >
          할 일이 없습니다. 새로운 할 일을 추가해보세요!
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flex: 1, width: '100%', mt: 3, display: 'flex', justifyContent: 'center' }}>
      <Grid container spacing={2} sx={{ maxWidth: 1200 }}>
        {todos.map(todo => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={todo.id}>
            <Slide direction="up" in={slideIn[todo.id]} mountOnEnter unmountOnExit>
              <div>
                <TodoItem
                  todo={todo}
                  onToggle={handleToggle}
                  onDelete={onDeleteTodo}
                />
              </div>
            </Slide>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TodoList; 