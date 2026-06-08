const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

// মেকালের টাইপ ক্যালকুলেট করার হেল্পার ফাংশন
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
  
  // কলব্যাক যুক্ত করা হয়েছে যাতে ডাটা ইনসার্ট শেষ হলে রেসপন্স যায়
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

  // কলব্যাক যুক্ত করা হয়েছে যাতে ডাটা ইনসার্ট শেষ হলে রেসপন্স যায়
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

// সার্ভার লিসেনিং
app.listen(5000, () => console.log("Server running on port 5000"));