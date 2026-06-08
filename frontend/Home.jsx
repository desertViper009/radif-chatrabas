import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // আজকের তারিখ বের করা (YYYY-MM-DD)
    const today = new Date().toISOString().split("T")[0];

    fetch(`http://localhost:5000/report/${today}`)
      .then((r) => r.json())
      .then(setData)
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-gray-500 font-medium animate-pulse">লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      {/* হেডার / টাইটেল */}
      <h1 className="text-2xl font-black text-gray-800 flex items-center gap-2 border-b pb-2">
        🏠 Radif Chatrabas
      </h1>

      {/* মিল কাউন্টার কার্ড */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">আজকের মিল সামারি</h2>
        
        <div className="flex justify-between items-center text-sm border-b border-gray-50 pb-2">
          <span className="text-gray-600 font-medium">🍛 Full Meal</span>
          <span className="font-bold text-gray-800 bg-gray-100 px-2.5 py-0.5 rounded-full">{data.full} টি</span>
        </div>

        <div className="flex justify-between items-center text-sm border-b border-gray-50 pb-2">
          <span className="text-gray-600 font-medium">🟡 Day Half</span>
          <span className="font-bold text-gray-800 bg-gray-100 px-2.5 py-0.5 rounded-full">{data.day} টি</span>
        </div>

        <div className="flex justify-between items-center text-sm border-b border-gray-50 pb-2">
          <span className="text-gray-600 font-medium">🌙 Night Half</span>
          <span className="font-bold text-gray-800 bg-gray-100 px-2.5 py-0.5 rounded-full">{data.night} টি</span>
        </div>

        <div className="flex justify-between items-center text-sm pt-1">
          <span className="text-red-500 font-medium">❌ Invalid</span>
          <span className="font-bold text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full">{data.invalid} টি</span>
        </div>
      </div>

      {/* মোট বাজার খরচ কার্ড */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-5 rounded-2xl shadow-md flex justify-between items-center">
        <div>
          <p className="text-xs opacity-80 font-medium uppercase tracking-wider">টোটাল হিসাব</p>
          <h3 className="text-lg font-bold mt-0.5">💰 আজকের বাজার</h3>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black">৳{data.total}</span>
          <p className="text-[10px] opacity-70">টাকা মাত্র</p>
        </div>
      </div>

      {/* একটিভ রুম কার্ড */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          🚪 Active Rooms ({data.rooms?.length || 0})
        </h3>
        
        {data.rooms && data.rooms.length > 0 ? (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {data.rooms.map((room, index) => (
              <span 
                key={index} 
                className="bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-lg border border-blue-100/50"
              >
                রুম {room}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400 py-2">আজকে কোনো রুমের মিল চালু নেই।</p>
        )}
      </div>
    </div>
  );
}