const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose(); // সরাসরি sqlite3 মডিউল ইম্পোর্ট করা হলো

const app = express();
app.use(cors());
app.use(express.json());

// সরাসরি এই ফাইলেই ডাটাবেজ কানেকশন তৈরি করা হলো
const db = new sqlite3.Database("./meals.db", (err) => {
  if (err) console.error("Database connection error:", err.message);
  else console.log("Connected to SQLite database.");
});

// টেবিলগুলো যদি তৈরি করা না থাকে, তবে অটোমেটিক তৈরি করার লজিক
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      room TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS meals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      member_id INTEGER NOT NULL,
      morning INTEGER DEFAULT 0,
      noon INTEGER DEFAULT 0,
      night INTEGER DEFAULT 0,
      FOREIGN KEY (member_id) REFERENCES members(id)
    )
  `);
});

// মিলের টাইপ ক্যালকুলেট করার হেল্পার ফাংশন
const calculateType = (m, d, n) => {
  const key = `${m ? 1 : 0}${d ? 1 : 0}${n ? 1 : 0}`;

  if (key === "111") return "FULL";
  if (key === "110") return "DAY_HALF";
  if (key === "101") return "NIGHT_HALF";
  return "INVALID";
};

// খরচের ম্যাপ
const costMap = {
  FULL: 70,
  DAY_HALF: 50,
  NIGHT_HALF: 50,
  INVALID: 0,
};

/* ---------- DAILY REPORT ---------- */
app.get("/report/:date", (req, res) => {
  const date = req.params.date;

  db.all(
    `SELECT meals.*, members.name, members.room
     FROM meals
     JOIN members ON members.id = meals.member_id
     WHERE date = ?`,
    [date],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      let full = 0,
        day = 0,
        night = 0,
        invalid = 0,
        total = 0;

      const rooms = [];

      rows.forEach((r) => {
        const type = calculateType(r.morning, r.noon, r.night);

        total += costMap[type];

        if (type === "FULL") full++;
        else if (type === "DAY_HALF") day++;
        else if (type === "NIGHT_HALF") night++;
        else invalid++;

        if (type !== "INVALID") {
          rooms.push(r.room);
        }
      });

      res.json({
        date,
        full,
        day,
        night,
        invalid,
        total,
        rooms,
      });
    }
  );
});

/* ---------- MEMBERS ---------- */
app.get("/members", (req, res) => {
  db.all("SELECT * FROM members", (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.post("/members", (req, res) => {
  const { name, room } = req.body;
  
  db.run(
    "INSERT INTO members(name, room) VALUES(?, ?)",
    [name, room],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ ok: true, id: this.lastID });
    }
  );
});

/* ---------- MEALS ---------- */
app.post("/meal", (req, res) => {
  const { date, member_id, morning, noon, night } = req.body;

  db.run(
    `INSERT INTO meals(date, member_id, morning, noon, night)
     VALUES(?, ?, ?, ?, ?)`,
    [date, member_id, morning, noon, night],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ ok: true });
    }
  );
});

// Render ডেপ্লয়মেন্টের জন্য পোর্ট ডাইনামিক করা হলো
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));