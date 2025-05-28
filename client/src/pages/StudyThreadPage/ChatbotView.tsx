import React, { useState } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Typography,
  Divider
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const ChatbotView: React.FC = () => {
  const [messages, setMessages] = useState<{ text: string; type: 'user' | 'bot' }[]>([]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { text: input, type: 'user' as const };
    const botReply = { text: `Echo: ${input}`, type: 'bot' as const }; // Replace with actual logic

    setMessages((prev) => [...prev, userMessage, botReply]);
    setInput('');
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="100%"
      width="100%"
      bgcolor="#1e1e20"
      color="#e0e0e0"
    >
      {/* Chat Area */}
      <Box
        flex={1}
        overflow="auto"
        px={3}
        py={2}
        display="flex"
        flexDirection="column"
        gap={2}
      >
        {messages.map((msg, idx) => (
          <Box
            key={idx}
            alignSelf={msg.type === 'user' ? 'flex-end' : 'flex-start'}
            maxWidth="75%"
            bgcolor={msg.type === 'user' ? '#3a3f52' : '#2c2f36'}
            color="#f0f0f0"
            px={2}
            py={1.5}
            borderRadius={2}
            boxShadow={1}
          >
            <Typography variant="body2" style={{ whiteSpace: 'pre-wrap' }}>
              {msg.text}
            </Typography>
          </Box>
        ))}
      </Box>

      <Divider sx={{ bgcolor: "#444" }} />

      {/* Input Area */}
      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        display="flex"
        gap={1}
        px={3}
        py={2}
        bgcolor="#1e1e20"
        borderTop="1px solid #333"
      >
        <TextField
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          fullWidth
          size="small"
          variant="outlined"
          sx={{
            input: { color: "#fff" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#444",
              },
              "&:hover fieldset": {
                borderColor: "#666",
              },
            }
          }}
        />
        <IconButton
          color="primary"
          onClick={handleSend}
          disabled={!input.trim()}
          sx={{ alignSelf: 'center' }}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ChatbotView;
