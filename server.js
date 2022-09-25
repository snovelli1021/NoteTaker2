//Setting up server to run on PORT 3001.
const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3001;
const fs = require("fs");
const uuid = require("./helpers/uuid");
const notes = require("./db/db.json");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);

//These are the GET routes that render the 2 html pages when the server is running.
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "public/index.html"))
);

app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "public/notes.html"))
);

//This api GET route returns the stored notes from the db.json file on start up.
app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", function (err, data) {
    var returnNotes = JSON.parse(data);
    res.json(returnNotes);
  });
});

app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "public/index.html"))
);

//This api POST route submits the user input as JSON to the notes array.
app.post("/api/notes", (req, res) => {
  const { title, text } = req.body;
  if (title && text) {
    const newNote = {
      title,
      text,
      id: uuid(),
    };

    fs.readFile("./db/db.json", function (err, data) {
      var addNote = JSON.parse(data);
      addNote.push(newNote);
      fs.writeFile("./db/db.json", JSON.stringify(addNote), (err) =>
        err ? console.error(err) : res.json(addNote)
      );
    });
  }
});
