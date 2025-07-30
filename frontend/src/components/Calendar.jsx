import React, { useMemo } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import ko from 'date-fns/locale/ko';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'ko': ko,
  'en-US': enUS,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
});

// colors
const PRIMARY = '#667eea';
const DUE = '#dc3545';
const COMPLETED = '#888';

function getEventColor(todo, type) {
  if (todo.completed) return COMPLETED;
  if (type === 'due') return DUE;
  return PRIMARY;
}

const MyCalendar = ({ todos = [], year, month }) => {
  // todos를 캘린더 이벤트로 변환
  const events = useMemo(() => {
    const evts = [];
    todos.forEach(todo => {
      // created_at 이벤트
      if (todo.created_at) {
        const baseDate = new Date(todo.created_at);
        const eventDate = todo.completed
          ? new Date(baseDate.getTime() + 60 * 1000)
          : baseDate;
        evts.push({
          title: todo.text,
          start: eventDate,
          end: eventDate,
          allDay: !todo.completed,
          color: getEventColor(todo, 'created'),
          todoId: todo.id,
          completed: todo.completed,
        });
      }
      // due_date 이벤트 (존재 시)
      if (todo.due_date) {
        const baseDate = new Date(todo.due_date);
        const eventDate = todo.completed
          ? new Date(baseDate.getTime() + 60 * 1000)
          : baseDate;
        evts.push({
          title: todo.text + ' (마감)',
          start: eventDate,
          end: eventDate,
          allDay: !todo.completed,
          color: getEventColor(todo, 'due'),
          todoId: todo.id,
          completed: todo.completed,
        });
      }
    });
    // 같은 날짜에 여러 이벤트가 있을 때, 완료된 것은 뒤로 정렬
    evts.sort((a, b) => {
      // 같은 날짜(연,월,일)만 비교
      const aDay = a.start.toISOString().slice(0, 10);
      const bDay = b.start.toISOString().slice(0, 10);
      if (aDay !== bDay) return a.start - b.start;
      if (a.completed === b.completed) return 0;
      if (a.completed) return 1;
      return -1;
    });
    return evts;
  }, [todos]);

  // 커스텀 이벤트 스타일
  const eventPropGetter = (event) => ({
    style: {
      backgroundColor: event.color,
      borderRadius: 8,
      border: 'none',
      color: '#fff',
      fontWeight: 600,
      opacity: 0.95,
      fontSize: 14,
      padding: 2,
    },
  });

  // year, month prop이 있으면 해당 월로 이동
  const calendarDate = useMemo(() => {
    if (year && month) {
      return new Date(year, month - 1, 1);
    }
    return new Date();
  }, [year, month]);

  return (
    <div style={{ height: 800, width: '100%', background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', padding: 16 }}>
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%', borderRadius: 12 }}
        popup
        culture="en-US"
        eventPropGetter={eventPropGetter}
        views={['month']}
        toolbar={false}
        date={calendarDate}
        onNavigate={() => {}} // 월 변경은 부모에서만
        messages={{
          noEventsInRange: 'No events',
        }}
      />
    </div>
  );
};

export default MyCalendar; 