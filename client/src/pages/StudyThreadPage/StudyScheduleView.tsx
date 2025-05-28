import React, { useState } from 'react';
import { Calendar, DateLocalizer } from 'react-big-calendar';
import { Box } from '@mui/material';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import { dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// ✅ Modern locale setup
const locales = {
  'en-US': enUS,
};

const localizer: DateLocalizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
});

const StudyScheduleView: React.FC = () => {
  const [events, setEvents] = useState([
    {
      title: 'Review Flashcards',
      start: new Date(),
      end: new Date(new Date().getTime() + 60 * 60 * 1000),
    },
    {
      title: 'Mock Exam Practice',
      start: new Date(new Date().setHours(18, 0, 0)),
      end: new Date(new Date().setHours(19, 0, 0)),
    },
  ]);

  return (
    <Box height="100%">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        popup
      />
    </Box>
  );
};

export default StudyScheduleView;
