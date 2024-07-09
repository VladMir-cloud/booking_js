const express = require('express');
const router = express.Router();
const fs = require('fs');
const roomsFilePath = './data/rooms.json';

// Получить список комнат
router.get('/room', (req, res) => {
  fs.readFile(roomsFilePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error reading rooms data');
    } else {
      const rooms = JSON.parse(data);
      res.json(rooms);
    }
  });
});

// Получить забронированные даты конкретной комнаты
router.get('/room/:roomId', (req, res) => {
  const roomId = parseInt(req.params.roomId, 10);
  fs.readFile(roomsFilePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error reading rooms data');
    } else {
      const rooms = JSON.parse(data);
      const room = rooms.find(r => r.id === roomId);
      if (room) {
        res.json(room.bookings || []);
      } else {
        res.status(404).send('Room not found');
      }
    }
  });
});

module.exports = router;
