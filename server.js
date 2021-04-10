// Dependencies
const express = require('express');
const path = require('path');
const fs = require('fs');
const uniqid = require('uniqid');

// Used to edit contents in db.json
// const db = {
//   table: []
// };

// Sets up the Express App
const app = express();
const PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Routes

// Basic route that sends the user first to the AJAX Page
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, 'public/notes.html')));

// Displays all saved notes in database
app.get('/api/notes', (req, res) => {
  // res.json(db)
  res.sendFile(path.join(__dirname, './db', 'db.json'));
  // db.table.push(res);
});

app.get('/*', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));

// Create new note
app.post('/api/notes', (req, res) => {
  let obj = {
    table: []
  };

  const newNote = req.body; 
  newNote.id = uniqid.process();

  fs.readFile('./db/db.json', 'utf8', function readFileCallback(err, data) {
    if (err) {
      console.log(err);
    } else {
      // turn obj into object 
      obj = JSON.parse(data); //now it an object
      // add newNote to obj
      obj.push(newNote);
      // convert obj back to json 
      json = JSON.stringify(obj);
      // create new db file with newNote and previous data
      fs.writeFile('./db/db.json', json, 'utf8', (err) => {
        if (err) throw err;
        console.log('Successfully saved new note.')
        res.sendStatus(200);
      }); 
    }
  });
});

// Starts the server to begin listening

app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));
