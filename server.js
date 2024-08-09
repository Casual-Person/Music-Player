
const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const jsmediatags = require('jsmediatags');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Storage configuration for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/upload', upload.array('mp3Files'), (req, res) => {
  const files = req.files;
  const tags = [];

  files.forEach(file => {
    jsmediatags.read(file.path, {
      onSuccess: function(tag) {
        tags.push({
          title: tag.tags.title,
          artist: tag.tags.artist,
          album: tag.tags.album,
          picture: tag.tags.picture
        });
        if (tags.length === files.length) {
          res.json(tags);
        }
      },
      onError: function(error) {
        console.log(':(', error.type, error.info);
      }
    });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
