const apiBaseUrl = 'http://localhost:8000/api/v1';

// Получить список комнат
async function fetchRooms() {
  const response = await fetch(`${apiBaseUrl}/room`);
  const rooms = await response.json();
  const roomsList = document.getElementById('rooms');
  roomsList.innerHTML = '';
  rooms.forEach(room => {
    const li = document.createElement('li');
    li.textContent = room.name;
    li.onclick = () => loadRoomCalendar(room.id);
    roomsList.appendChild(li);
  });
}

// Загрузить календарь для конкретной комнаты
async function loadRoomCalendar(roomId) {
  const response = await fetch(`${apiBaseUrl}/room/${roomId}`);
  const bookings = await response.json();
  const calendarContent = document.getElementById('calendarContent');
  calendarContent.innerHTML = '';
  for (let day = 1; day <= 30; day++) {
    const dateStr = `2024-07-${day.toString().padStart(2, '0')}`;
    const dateDiv = document.createElement('div');
    dateDiv.classList.add('calendar-date');
    dateDiv.textContent = dateStr;
    if (bookings.some(booking => booking.date === dateStr)) {
      dateDiv.classList.add('booked');
      dateDiv.onclick = () => deleteBooking(roomId, dateStr);
    } else {
      dateDiv.classList.add('free');
      dateDiv.onclick = () => selectDate(roomId, dateStr);
    }
    calendarContent.appendChild(dateDiv);
  }
}

// Получить список преподавателей
async function fetchTeachers() {
  const response = await fetch(`${apiBaseUrl}/person`);
  const teachers = await response.json();
  const teachersSelect = document.getElementById('teachers');
  teachersSelect.innerHTML = '';
  teachers.forEach(teacher => {
    const option = document.createElement('option');
    option.value = teacher.id;
    option.textContent = teacher.name;
    teachersSelect.appendChild(option);
  });
}

// Забронировать комнату на выбранную дату
async function bookRoom() {
  const teacherId = document.getElementById('teachers').value;
  const date = document.getElementById('date').value;
  const roomId = document.getElementById('selectedRoomId').value;
  const response = await fetch(`${apiBaseUrl}/person/${teacherId}/room/${roomId}/date/${date}`, {
    method: 'POST'
  });
  if (response.ok) {
    alert('Booking successful');
    loadRoomCalendar(roomId);
  } else {
    alert('Booking failed');
  }
}

// Удалить бронь
async function deleteBooking(roomId, date) {
  const response = await fetch(`${apiBaseUrl}/room/${roomId}/date/${date}`, {
    method: 'POST'
  });
  if (response.ok) {
    alert('Booking deleted');
    loadRoomCalendar(roomId);
  } else {
    alert('Failed to delete booking');
  }
}

function selectDate(roomId, date) {
  document.getElementById('selectedRoomId').value = roomId;
  document.getElementById('date').value = date;
}

document.getElementById('bookRoom').onclick = bookRoom;

fetchRooms();
fetchTeachers();
