const fs = require('fs');
const path = require('path');

const calendarGrid = document.querySelector('.calendar-grid');
const monthYearLabel = document.getElementById('monthYear');

const dayModal = document.getElementById('dayModal');
const closeDayModal = document.getElementById('closeDayModal');
const dayModalTitle = document.getElementById('dayModalTitle');
const dayModalBody = document.getElementById('dayModalBody');

let currentDate = new Date();
let events = [];

// Pfad zur calendar.json
const dataPath = path.join(__dirname, '../data/calendar.json');

// Lade Events (nur nicht-admin)
if (fs.existsSync(dataPath)) {
  const raw = fs.readFileSync(dataPath, 'utf-8');
  const allEvents = JSON.parse(raw);
  events = allEvents.filter(e => e.category !== 'admin');
}

// Modal Logik
function openDayModal(dateStr) {
  dayModal.style.display = 'flex';
  dayModalTitle.textContent = `Termine am ${dateStr}`;
  dayModalBody.innerHTML = '';

  const dayEvents = events.filter(e => e.date === dateStr);

  if(dayEvents.length === 0){
    dayModalBody.innerHTML = '<p>Keine Termine an diesem Tag.</p>';
    return;
  }

  dayEvents.forEach(ev => {
    const div = document.createElement('div');
    div.classList.add('event');
    div.style.borderLeft = '5px solid ';
    switch(ev.category){
      case 'training': div.style.borderLeftColor = '#00ff00'; break;
      case 'discord':  div.style.borderLeftColor = '#ffff00'; break;
      case 'event':    div.style.borderLeftColor = '#ff0000'; break;
      default: div.style.borderLeftColor = '#00cccc';
    }
    div.textContent = `[${ev.category}] ${ev.title} - ${ev.time || '12:00'} UTC (${ev.author})`;
    dayModalBody.appendChild(div);
  });
}

closeDayModal.addEventListener('click', () => dayModal.style.display = 'none');
window.addEventListener('click', e => { if(e.target === dayModal) dayModal.style.display = 'none'; });

// Kalender rendern
const months = ["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];

function renderCalendar(date){
  monthYearLabel.textContent = `${months[date.getMonth()]} ${date.getFullYear()}`;
  calendarGrid.innerHTML = '';

  const days = ["Mo","Di","Mi","Do","Fr","Sa","So"];
  days.forEach(d => {
    const dayEl = document.createElement('div');
    dayEl.classList.add('calendar-day-name');
    dayEl.textContent = d;
    calendarGrid.appendChild(dayEl);
  });

  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDay = new Date(date.getFullYear(), date.getMonth()+1, 0);
  const startWeekDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay()-1;

  for(let i = 0; i < startWeekDay; i++){
    const empty = document.createElement('div');
    empty.classList.add('calendar-day');
    empty.style.backgroundColor='transparent';
    empty.style.cursor='default';
    calendarGrid.appendChild(empty);
  }

  const today = new Date();
  today.setHours(0,0,0,0); // Nur Datum vergleichen

  for(let day = 1; day <= lastDay.getDate(); day++){
    const dayEl = document.createElement('div');
    dayEl.classList.add('calendar-day');

    const dateStr = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    dayEl.dataset.date = dateStr;
    dayEl.innerHTML = `<strong>${day}</strong>`;

    const dayDate = new Date(date.getFullYear(), date.getMonth(), day);

    // Vergangene Tage grau
    if(dayDate < today){
      dayEl.style.backgroundColor = '#444';
      dayEl.style.color = '#ccc';
    }

    // Heutiger Tag roter Rahmen
    if(dayDate.getTime() === today.getTime()){
      dayEl.style.border = '2px solid red';
    }

    const dayEvents = events.filter(e => e.date === dateStr);
    dayEvents.forEach(ev => {
      const strip = document.createElement('div');
      strip.classList.add('event-strip');
      switch(ev.category){
        case 'training': strip.style.backgroundColor='#00ff00'; break;
        case 'discord':  strip.style.backgroundColor='#ffff00'; break;
        case 'event':    strip.style.backgroundColor='#ff0000'; break;
        default: strip.style.backgroundColor='#00cccc';
      }
      dayEl.appendChild(strip);
    });

    dayEl.addEventListener('click', () => openDayModal(dateStr));
    calendarGrid.appendChild(dayEl);
  }
}

// Monat Navigation
document.getElementById('prevMonth').addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar(currentDate);
});
document.getElementById('nextMonth').addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar(currentDate);
});

// Initial render
renderCalendar(currentDate);
