const express = require('express');
const router = express.Router();
const fs = require('fs');

const personsFilePath = './data/persons.json';
const roomsFilePath = './data/rooms.json';

// Получить список преподавателей
router.get('/person', (req, res) => {
  fs.readFile(personsFilePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error reading persons data');
    } else {
      const persons = JSON.parse(data);
      res.json(persons);
    }
  });
});

// Забронировать класс на дату за преподавателем
router.post('/person/:personId/room/:roomId/date/:date', (req, res) => {
  const personId = parseInt(req.params.personId, 10);
  const roomId = parseInt(req.params.roomId, 10);
  const date = req.params.date;

  fs.readFile(roomsFilePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error reading rooms data');
    } else {
      let rooms = JSON.parse(data);
      let room = rooms.find(r => r.id === roomId);

      if (room) {
        if (!room.bookings) {
          room.bookings = [];
        }

        if (room.bookings.find(b => b.date === date)) {
          res.status(400).send('Date is already booked');
        } else {
          room.bookings.push({ date, personId });
          fs.writeFile(roomsFilePath, JSON.stringify(rooms, null, 2), err => {
            if (err) {
              res.status(500).send('Error saving booking');
            } else {
              res.send('Booking successful');
            }
          });
        }
      } else {
        res.status(404).send('Room not found');
      }
    }
  });
});

// Удалить бронь на дату
router.post('/room/:roomId/date/:date', (req, res) => {
  const roomId = parseInt(req.params.roomId, 10);
  const date = req.params.date;

  fs.readFile(roomsFilePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error reading rooms data');
    } else {
      let rooms = JSON.parse(data);
      let room = rooms.find(r => r.id === roomId);

      if (room && room.bookings) {
        room.bookings = room.bookings.filter(b => b.date !== date);
        fs.writeFile(roomsFilePath, JSON.stringify(rooms, null, 2), err => {
          if (err) {
            res.status(500).send('Error deleting booking');
          } else {
            res.send('Booking deleted');
          }
        });
      } else {
        res.status(404).send('Booking not found');
      }
    }
  });
});

module.exports = router;
