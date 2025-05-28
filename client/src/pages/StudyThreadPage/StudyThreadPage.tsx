import React, { useState } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import NotesIcon from '@mui/icons-material/Notes';
import SchoolIcon from '@mui/icons-material/School';
import ViewAgendaIcon from '@mui/icons-material/ViewAgenda'; // schedule icon

import ChatbotView from './ChatbotView';
import FlashcardsView from './FlashcardsView';
import SummaryView from './SummaryView';
import StudyScheduleView from './StudyScheduleView';
import { useParams } from 'react-router-dom';

const StudyThreadPage: React.FC = () => {
  const { threadId } = useParams();
  const [activeTool, setActiveTool] = useState<'chat' | 'flashcards' | 'summary' | 'schedule'>('chat');

  return (
    <Box display="flex" height="100vh">
      {/* Toolbar */}
      <Box
        width="60px"
        bgcolor="#f5f5f5"
        display="flex"
        flexDirection="column"
        alignItems="center"
        py={2}
        boxShadow={2}
      >
        <Tooltip title="Chatbot" placement="right">
          <IconButton onClick={() => setActiveTool('chat')} size="large">
            <ChatIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Flashcards" placement="right">
          <IconButton onClick={() => setActiveTool('flashcards')} size="large">
            <SchoolIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Summary" placement="right">
          <IconButton onClick={() => setActiveTool('summary')} size="large">
            <NotesIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Study Schedule" placement="right">
          <IconButton onClick={() => setActiveTool('schedule')} size="large">
            <ViewAgendaIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Main Content */}
      <Box flex={1} p={3} overflow="auto">
        {activeTool === 'chat' && <ChatbotView />}
        {activeTool === 'flashcards' && <FlashcardsView />}
        {activeTool === 'summary' && <SummaryView />}
        {activeTool === 'schedule' && <StudyScheduleView />}
      </Box>
    </Box>
  );
};

export default StudyThreadPage;
