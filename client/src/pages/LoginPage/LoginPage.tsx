import React, { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../apis/authentication';
import { useAuth } from '../../contexts/AuthContext'; // ✅ import context

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setUserId } = useAuth(); // ✅ use context

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!username.trim() || !password.trim()) {
      alert("Username and password cannot be empty.");
      return;
    }

    try {
      const response = await loginUser({ username, password });
      console.log('Login successful:', response);
      setUserId(response.user_id);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login failed:', err);
      alert('Login failed: ' + err);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Paper
        elevation={4}
        sx={{
          mt: 8,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderRadius: 3,
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <LockOutlinedIcon />
        </Avatar>

        <Typography component="h1" variant="h5">
          Sign In
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ mt: 2, width: '100%' }}
        >
          <TextField
            required
            fullWidth
            label="Username"
            name="username"
            autoComplete="username"
            margin="normal"
            value={username}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setUsername(e.target.value)
            }
          />

          <TextField
            required
            fullWidth
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            margin="normal"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
        </Box>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Don't have an account? <Link to="/register">Register</Link>
        </Typography>
      </Paper>
    </Container>
  );
};

export default LoginPage;
