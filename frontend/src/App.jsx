import React, { useState, useEffect, useMemo } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  CircularProgress, 
  Paper,
  ThemeProvider,
  createTheme,
  CssBaseline,
  IconButton,
  Slide,
  Avatar,
  TextField,
  Button
} from '@mui/material';
import { ArrowDownward, ArrowUpward, AccountCircle, ListAlt, ArrowBack } from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import TodoList from './components/TodoList';
import TodoForm from './components/TodoForm';
import MyCalendar from './components/Calendar';
import { Calendar as BigCalendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import dayjs from 'dayjs';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ProfileDialog from './components/ProfileDialog';

// MUI 테마 생성
const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
    },
    secondary: {
      main: '#764ba2',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
  },
});

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCompleted, setShowCompleted] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState('');
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [showSignup, setShowSignup] = useState(false);
  const [signupForm, setSignupForm] = useState({ username: '', password: '', password2: '' });
  const [signupError, setSignupError] = useState('');
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(dayjs());
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);

  // 앱 시작 시 session 확인
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const response = await fetch('/api/check-session', {
        credentials: 'include' // 쿠키 포함
      });
      if (response.ok) {
        const data = await response.json();
        setIsLoggedIn(true);
        setUserId(data.user_id);
        setUsername(data.username);
      } else {
        setIsLoggedIn(false);
        setUserId(null);
        setUsername('');
      }
    } catch (error) {
      console.error('Session check failed:', error);
      setIsLoggedIn(false);
      setUserId(null);
      setUsername('');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) fetchTodos();
  }, [isLoggedIn]);

  const fetchTodos = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const response = await fetch('/api/todos', {
        credentials: 'include' // 쿠키 포함
      });
      if (response.ok) {
        const data = await response.json();
        setTodos(data);
      } else {
        // session이 만료된 경우
        setIsLoggedIn(false);
        setUserId(null);
        setUsername('');
      }
    } catch (error) {
      console.error('Error fetching todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (todoData) => {
    if (!userId) return;
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // 쿠키 포함
        body: JSON.stringify(todoData),
      });
      if (response.ok) {
        const newTodo = await response.json();
        setTodos([...todos, newTodo]);
      } else {
        // session이 만료된 경우
        setIsLoggedIn(false);
        setUserId(null);
        setUsername('');
      }
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const toggleTodo = async (id) => {
    if (!userId) return;
    try {
      const response = await fetch(`/api/todos/${id}/toggle`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // 쿠키 포함
      });
      if (response.ok) {
        const updatedTodo = await response.json();
        setTodos(todos.map(todo => 
          todo.id === id ? updatedTodo : todo
        ));
      } else {
        // session이 만료된 경우
        setIsLoggedIn(false);
        setUserId(null);
        setUsername('');
      }
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  const deleteTodo = async (id) => {
    if (!userId) return;
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // 쿠키 포함
      });
      if (response.ok) {
        setTodos(todos.filter(todo => todo.id !== id));
      } else {
        // session이 만료된 경우
        setIsLoggedIn(false);
        setUserId(null);
        setUsername('');
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginForm.username || !loginForm.password) {
      setLoginError('Please enter your username and password.');
      return;
    }
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // 쿠키 포함
        body: JSON.stringify({
          username: loginForm.username,
          password: loginForm.password,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setUserId(data.user_id);
        setUsername(data.username);
        setIsLoggedIn(true);
        setLoginError('');
        setLoginForm({ username: '', password: '' });
      } else {
        setLoginError(data.error || 'Login failed.');
      }
    } catch (err) {
      setLoginError('Server error.');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include' // 쿠키 포함
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggedIn(false);
      setUserId(null);
      setUsername('');
      setTodos([]);
      setProfileDialogOpen(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!signupForm.username || !signupForm.password || !signupForm.password2) {
      setSignupError('Please fill in all fields.');
      return;
    }
    if (signupForm.password !== signupForm.password2) {
      setSignupError('Passwords do not match.');
      return;
    }
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: signupForm.username,
          password: signupForm.password,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setSignupSuccess(true);
        setSignupError('');
        setTimeout(() => {
          setShowSignup(false);
          setSignupSuccess(false);
          setSignupForm({ username: '', password: '', password2: '' });
        }, 1200);
      } else {
        setSignupError(data.error || 'Sign up failed.');
      }
    } catch (err) {
      setSignupError('Server error.');
    }
  };

  // 메인페이지 todo 정렬: due_date 빠른 순, due_date 없으면 created_at이 빠른 순
  const sortedTodos = useMemo(() => {
    return todos
      .filter(todo => !todo.completed)
      .slice()
      .sort((a, b) => {
        if (a.due_date && b.due_date) {
          return new Date(a.due_date) - new Date(b.due_date);
        } else if (a.due_date && !b.due_date) {
          return -1;
        } else if (!a.due_date && b.due_date) {
          return 1;
        } else {
          // 둘 다 due_date 없으면 created_at 빠른 순
          return new Date(a.created_at) - new Date(b.created_at);
        }
      });
  }, [todos]);

  if (!isLoggedIn) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          minHeight="100vh"
          width="100vw"
          display="flex"
          alignItems="center"
          justifyContent="center"
          bgcolor="#f5f6fa"
        >
          <Paper elevation={3} sx={{ p: 5, minWidth: 320, maxWidth: 400 }}>
            {!showSignup ? (
              <>
                <Typography variant="h5" align="center" fontWeight={700} mb={3} color="primary.main">Todododo</Typography>
                <form onSubmit={handleLogin}>
                  <TextField
                    label="Username"
                    fullWidth
                    margin="normal"
                    value={loginForm.username}
                    onChange={e => setLoginForm(f => ({ ...f, username: e.target.value }))}
                    autoFocus
                  />
                  <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={loginForm.password}
                    onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))}
                  />
                  {loginError && <Typography color="error" fontSize={14} mt={1}>{loginError}</Typography>}
                  <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3, py: 1.2, fontWeight: 700 }}>Login</Button>
                </form>
                <Button color="secondary" fullWidth sx={{ mt: 2 }} onClick={() => setShowSignup(true)}>Sign Up</Button>
              </>
            ) : (
              <>
                <Typography variant="h5" align="center" fontWeight={700} mb={3} color="primary.main">Sign Up</Typography>
                <form onSubmit={handleSignup}>
                  <TextField
                    label="Username"
                    fullWidth
                    margin="normal"
                    value={signupForm.username}
                    onChange={e => setSignupForm(f => ({ ...f, username: e.target.value }))}
                    autoFocus
                  />
                  <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={signupForm.password}
                    onChange={e => setSignupForm(f => ({ ...f, password: e.target.value }))}
                  />
                  <TextField
                    label="Confirm Password"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={signupForm.password2}
                    onChange={e => setSignupForm(f => ({ ...f, password2: e.target.value }))}
                  />
                  {signupError && <Typography color="error" fontSize={14} mt={1}>{signupError}</Typography>}
                  {signupSuccess && <Typography color="primary" fontSize={14} mt={1}>Sign up successful!</Typography>}
                  <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3, py: 1.2, fontWeight: 700 }}>Sign Up</Button>
                </form>
                <Button color="secondary" fullWidth sx={{ mt: 2 }} onClick={() => setShowSignup(false)}>Back to Login</Button>
              </>
            )}
          </Paper>
        </Box>
      </ThemeProvider>
    );
  }

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
          bgcolor="background.default"
        >
          <CircularProgress />
        </Box>
      </ThemeProvider>
    );
  }

  // 완료된 todo만 필터
  const completedTodos = todos.filter(todo => todo.completed);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100vw',
            minHeight: '100vh',
            position: 'relative',
            overflowX: 'hidden',
          }}
        >
          {/* 오른쪽 상단 프로필 버튼 */}
          <IconButton
            sx={{
              position: 'fixed',
              top: 24,
              right: 32,
              zIndex: 1300,
              background: '#f1f1f1',
              boxShadow: 1,
              width: 48,
              height: 48,
              '&:hover': {
                background: '#e0e0e0',
              },
            }}
            aria-label="프로필"
            onClick={() => setProfileDialogOpen(true)}
          >
            <Avatar sx={{ bgcolor: 'grey.300', color: 'grey.700', width: 36, height: 36 }}>
              <AccountCircle sx={{ fontSize: 32 }} />
            </Avatar>
          </IconButton>
          <ProfileDialog
            open={profileDialogOpen}
            onClose={() => setProfileDialogOpen(false)}
            onLogout={handleLogout}
            username={username}
          />

          {/* Calendar(빈) 페이지 */}
          <Slide direction="left" in={showCalendar} mountOnEnter unmountOnExit>
            <Box sx={{ width: '100vw', minHeight: '100vh', position: 'absolute', top: 0, left: 0, bgcolor: 'background.default', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Container maxWidth="md" sx={{ py: 4, flex: 1, position: 'relative' }}>
                {/* 완전 왼쪽 상단 고정 화살표 */}
                <IconButton onClick={() => setShowCalendar(false)} aria-label="뒤로가기" sx={{ position: 'fixed', top: 32, left: 24, zIndex: 1300, background: '#f1f1f1', boxShadow: 1, width: 48, height: 48, '&:hover': { background: '#e0e0e0' } }}>
                  <ArrowBack sx={{ fontSize: 32 }} />
                </IconButton>
                {/* 상단 중앙 월 표시 (양옆에 월 변경 화살표) */}
                <Box display="flex" justifyContent="center" alignItems="center" mb={4} mt={0}>
                  <IconButton size="small" onClick={() => setCalendarMonth(m => m.subtract(1, 'month'))} sx={{ color: '#222', mr: 1 }}>
                    <ChevronLeftIcon fontSize="small" />
                  </IconButton>
                  <Typography variant="h5" component="h2" sx={{ fontWeight: 700, color: '#222', minWidth: 48, textAlign: 'center' }}>
                    {calendarMonth.format('MMMM YYYY')}
                  </Typography>
                  <IconButton size="small" onClick={() => setCalendarMonth(m => m.add(1, 'month'))} sx={{ color: '#222', ml: 1 }}>
                    <ChevronRightIcon fontSize="small" />
                  </IconButton>
                </Box>
                <MyCalendar todos={todos} year={calendarMonth.year()} month={calendarMonth.month() + 1} />
              </Container>
            </Box>
          </Slide>

          {/* 전체 Todo 페이지 */}
          <Slide direction={showCalendar ? 'right' : 'down'} in={!showCompleted && !showCalendar} mountOnEnter unmountOnExit>
            <Box sx={{ width: '100vw', position: 'absolute', top: 0, left: 0 }}>
              <Container maxWidth="md" sx={{ py: 4, flex: 1 }}>
                <Box display="flex" alignItems="center" justifyContent="center" mb={4} mt={6}>
                  <Typography
                    variant="h2"
                    component="h1"
                    align="center"
                    gutterBottom
                    sx={{
                      fontWeight: 700,
                      color: 'primary.main',
                      textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    }}
                  >
                    Todododo
                  </Typography>
                  <IconButton
                    sx={{ ml: 1, mt: -2 }}
                    onClick={() => setShowCalendar(true)}
                    aria-label="리스트"
                  >
                    <ListAlt sx={{ fontSize: 60, color: 'primary.main' }} />
                  </IconButton>
                </Box>
                <TodoForm onAddTodo={addTodo} />
                <TodoList 
                  todos={sortedTodos} 
                  onToggleTodo={toggleTodo} 
                  onDeleteTodo={deleteTodo} 
                />
              </Container>
              {/* 하단 중앙 고정 회색 화살표 아이콘 버튼 */}
              <IconButton
                color="secondary"
                aria-label="아래로 이동"
                onClick={() => setShowCompleted(true)}
                sx={{
                  position: 'fixed',
                  bottom: 32,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  zIndex: 1200,
                  background: '#f1f1f1',
                  boxShadow: 2,
                  width: 56,
                  height: 56,
                  '&:hover': {
                    background: '#e0e0e0',
                  },
                }}
              >
                <ArrowDownward sx={{ fontSize: 32, color: '#888' }} />
              </IconButton>
            </Box>
          </Slide>

          {/* 완료된 Todo 페이지 */}
          <Slide direction="down" in={showCompleted && !showCalendar} mountOnEnter unmountOnExit>
            <Box sx={{ width: '100vw', minHeight: '100vh', position: 'absolute', top: 0, left: 0, bgcolor: 'background.default', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Container maxWidth="md" sx={{ py: 4, flex: 1 }}>
                <Box display="flex" alignItems="center" justifyContent="center" mb={4} mt={6}>
                  <IconButton
                    color="secondary"
                    aria-label="위로 이동"
                    onClick={() => setShowCompleted(false)}
                    sx={{
                      background: '#f1f1f1',
                      boxShadow: 2,
                      width: 56,
                      height: 56,
                      '&:hover': {
                        background: '#e0e0e0',
                      },
                    }}
                  >
                    <ArrowUpward sx={{ fontSize: 32, color: '#888' }} />
                  </IconButton>
                </Box>
                <TodoList 
                  todos={completedTodos} 
                  onToggleTodo={toggleTodo} 
                  onDeleteTodo={deleteTodo} 
                />
              </Container>
            </Box>
          </Slide>
        </Box>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
