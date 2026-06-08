import { useState } from "react";
import Home from "./Home";
import Meal from "./Meal";
import Members from "./Members";
import Bill from "./Bill";
import Admin from "./Admin";

export default function App() {
  const [tab, setTab] = useState("home");

  // Tab কম্পোনেন্ট যেখানে অ্যাক্টিভ ট্যাবের জন্য কন্ডিশনাল স্টাইলিং দেওয়া হয়েছে
  const Tab = ({ icon, name }) => (
    <button
      onClick={() => setTab(name)}
      className={`text-xl flex-1 py-3 transition-colors duration-150 ${
        tab === name ? "bg-gray-100 font-bold" : "text-gray-500 hover:bg-gray-50"
      }`}
    >
      {icon}
    </button>
  );

  return (
    <div className="bg-gray-50 min-h-screen pb-16 font-sans">
      {/* মেইন কন্টেন্ট এরিয়া */}
      <main className="container mx-auto">
        {tab === "home" && <Home />}
        {tab === "meal" && <Meal />}
        {tab === "members" && <Members />}
        {tab === "bill" && <Bill />}
        {tab === "admin" && <Admin />}
      </main>

      {/* বটম নেভিগেশন বার */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex shadow-md z-50">
        <Tab icon="🏠" name="home" />
        <Tab icon="🍛" name="meal" />
        <Tab icon="👥" name="members" />
        <Tab icon="💰" name="bill" />
        <Tab icon="⚙️" name="admin" />
      </nav>
    </div>
  );
}