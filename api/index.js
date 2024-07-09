const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const port = 8000;

app.use(express.json());

const roomsFilePath = path.join(__dirname, 'data/rooms.json');
const personsFilePath = path.join(__dirname, 'data/persons.json');

// Helper functions to read/write JSON files
const readJSONFile = (filePath) => {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    console.error(`Error reading file from disk: ${error}`);
    return [];
  }
};

const writeJSONFile = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error writing file to disk: ${error}`);
  }
};

// Root URL handler
app.get('/', (req, res) => {
  res.send('<h1>Welcome to the Booking System API</h1><p>Use /api/v1 endpoints for interactions.</p>');
});

// GET all rooms
app.get('/api/v1/room', (req, res) => {
  const rooms = readJSONFile(roomsFilePath);
  res.json(rooms);
});

// GET bookings for a specific room
app.get('/api/v1/room/:roomId', (req, res) => {
  const rooms = readJSONFile(roomsFilePath);
  const room = rooms.find(r => r.id === parseInt(req.params.roomId));
  if (room) {
    res.json(room.bookings);
  } else {
    res.status(404).send('Room not found');
  }
});

// GET all persons
app.get('/api/v1/person', (req, res) => {
  const persons = readJSONFile(personsFilePath);
  res.json(persons);
});

// Book a room for a specific date
app.post('/api/v1/person/:personId/room/:roomId/date/:date', (req, res) => {
  const rooms = readJSONFile(roomsFilePath);
  const room = rooms.find(r => r.id === parseInt(req.params.roomId));
  const personId = parseInt(req.params.personId);
  const date = req.params.date;

  if (room) {
    room.bookings.push({ date, personId });
    writeJSONFile(roomsFilePath, rooms);
    res.send('Booking successful');
  } else {
    res.status(404).send('Room not found');
  }
});

// Delete a booking for a specific date
app.delete('/api/v1/room/:roomId/date/:date', (req, res) => {
  const rooms = readJSONFile(roomsFilePath);
  const room = rooms.find(r => r.id === parseInt(req.params.roomId));
  const date = req.params.date;

  if (room) {
    room.bookings = room.bookings.filter(booking => booking.date !== date);
    writeJSONFile(roomsFilePath, rooms);
    res.send('Booking deleted');
  } else {
    res.status(404).send('Room not found');
  }
});

app.listen(port, () => {
  console.log(`API server is running on http://localhost:${port}`);
});
