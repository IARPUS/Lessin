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
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../../apis/authentication';
import { useAuth } from '../../contexts/AuthContext';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const navigate = useNavigate();
  const { setUserId } = useAuth(); // <-- 👈 use context

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const response = await registerUser({
        username: name,
        email,
        password,
      });

      console.log('Registration successful:', response);
      setUserId(response.id);
      navigate('/login');
    } catch (err) {
      console.error('Registration failed:', err);
      alert('Registration failed: ' + err);
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
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <PersonAddIcon />
        </Avatar>

        <Typography component="h1" variant="h5">
          Register
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
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
          />

          <TextField
            required
            fullWidth
            label="Email Address"
            name="email"
            type="email"
            autoComplete="email"
            margin="normal"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
          />

          <TextField
            required
            fullWidth
            label="Password"
            name="password"
            type="password"
            autoComplete="new-password"
            margin="normal"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
          />

          <TextField
            required
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            margin="normal"
            value={confirmPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setConfirmPassword(e.target.value)
            }
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
        </Box>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Already have an account? <Link to="/Login">Sign In</Link>
        </Typography>
      </Paper>
    </Container>
  );
};

export default RegisterPage;
