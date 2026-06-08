import { useState, useEffect } from "react";

export default function Meal() {
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState("");
  const [m, setM] = useState(false);
  const [d, setD] = useState(false);
  const [n, setN] = useState(false);

  // মেম্বার লিস্ট লোড করা
  useEffect(() => {
    fetch("http://localhost:5000/members")
      .then((res) => res.json())
      .then((data) => setMembers(data))
      .catch((err) => console.error(err));
  }, []);

  const Box = ({ label, val, set }) => (
    <button
      onClick={() => set(!val)}
      className={`w-full p-4 rounded-xl shadow-sm mb-3 text-left border-2 transition-all ${
        val ? "bg-green-50 border-green-500" : "bg-white border-transparent"
      }`}
    >
      <span className="text-lg">{label}</span> : {val ? "✔" : "❌"}
    </button>
  );

  const handleSubmit = () => {
    if (!selectedMember) return alert("মেম্বার সিলেক্ট করুন!");

    const mealData = {
      date: new Date().toISOString().split("T")[0],
      member_id: selectedMember,
      morning: m,
      noon: d,
      night: n,
    };

    fetch("http://localhost:5000/meal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mealData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          alert("মিল আপডেট সফল হয়েছে!");
          // রিসেট
          setM(false); setD(false); setN(false);
        }
      });
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="font-bold text-xl mb-5 flex items-center gap-2">
        🍛 Meal Update
      </h2>

      {/* মেম্বার ড্রপডাউন */}
      <select 
        className="w-full p-3 mb-5 rounded-xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:border-blue-500"
        value={selectedMember}
        onChange={(e) => setSelectedMember(e.target.value)}
      >
        <option value="">মেম্বার সিলেক্ট করুন</option>
        {members.map(member => (
          <option key={member.id} value={member.id}>
            {member.name} (রুম: {member.room})
          </option>
        ))}
      </select>

      {/* মিল বক্সসমূহ */}
      <Box label="সকাল" val={m} set={setM} />
      <Box label="দুপুর" val={d} set={setD} />
      <Box label="রাত" val={n} set={setN} />

      {/* সাবমিট বাটন */}
      <button 
        onClick={handleSubmit}
        className="w-full mt-4 bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg active:scale-95 transition-transform"
      >
        আপডেট করুন
      </button>
    </div>
  );
}