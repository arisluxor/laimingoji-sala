"use client";
import { useState, useEffect } from "react";
import { Plus, Trash2, Home } from "lucide-react";
import Link from "next/link";

export default function AdminPage() {
  const [trips, setTrips] = useState([]);
  const [newTrip, setNewTrip] = useState({ title: "", price: "", img: "", tag: "Naujiena" });

  // 1. Užkrauname esamas keliones iš "atminties"
  useEffect(() => {
    const saved = localStorage.getItem("laimingoji_trips");
    if (saved) setTrips(JSON.parse(saved));
  }, []);

  // 2. Išsaugojimo funkcija
  const addTrip = (e: any) => {
    e.preventDefault();
    const updatedTrips = [...trips, { ...newTrip, id: Date.now() }];
    setTrips(updatedTrips);
    localStorage.setItem("laimingoji_trips", JSON.stringify(updatedTrips));
    setNewTrip({ title: "", price: "", img: "", tag: "Naujiena" }); // Išvalom formą
    alert("Kelionė sėkmingai pridėta! Patikrink pagrindinį puslapį.");
  };

  const deleteTrip = (id: number) => {
    const updated = trips.filter((t: any) => t.id !== id);
    setTrips(updated);
    localStorage.setItem("laimingoji_trips", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black text-gray-900 uppercase">Valdymo skydas 🏝️</h1>
          <Link href="/" className="flex items-center gap-2 text-green-600 font-bold hover:underline">
            <Home size={20} /> Grįžti į svetainę
          </Link>
        </div>

        {/* FORMA PRIDĖJIMUI */}
        <div className="bg-white p-8 rounded-3xl shadow-xl mb-12 border border-green-100">
          <h2 className="text-xl font-bold mb-6">Pridėti naują kelionę</h2>
          <form onSubmit={addTrip} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Pavadinimas</label>
              <input 
                required
                className="w-full p-3 bg-gray-50 rounded-xl outline-none focus:ring-2 ring-green-500"
                value={newTrip.title}
                onChange={(e) => setNewTrip({...newTrip, title: e.target.value})}
                placeholder="Pvz: Madeira, Portugalija"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Kaina (€)</label>
              <input 
                required
                type="number"
                className="w-full p-3 bg-gray-50 rounded-xl outline-none focus:ring-2 ring-green-500"
                value={newTrip.price}
                onChange={(e) => setNewTrip({...newTrip, price: e.target.value})}
                placeholder="527"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Nuotraukos nuoroda (URL)</label>
              <input 
                required
                className="w-full p-3 bg-gray-50 rounded-xl outline-none focus:ring-2 ring-green-500"
                value={newTrip.img}
                onChange={(e) => setNewTrip({...newTrip, img: e.target.value})}
                placeholder="https://images.unsplash.com/..."
              />
            </div>
            <button className="md:col-span-2 bg-green-500 text-white py-4 rounded-2xl font-black uppercase hover:bg-green-600 transition shadow-lg shadow-green-100 flex items-center justify-center gap-2">
              <Plus size={20} /> Išsaugoti kelionę
            </button>
          </form>
        </div>

        {/* SĄRAŠAS REDAGAVIMUI */}
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
          <h2 className="text-xl font-bold mb-6">Esamos kelionės ({trips.length})</h2>
          <div className="space-y-4">
            {trips.length === 0 && <p className="text-gray-400 italic text-center py-10">Sąrašas tuščias. Pridėkite pirmąją kelionę!</p>}
            {trips.map((trip: any) => (
              <div key={trip.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-4">
                  <img src={trip.img} className="w-16 h-16 rounded-xl object-cover" alt="" />
                  <div>
                    <h4 className="font-bold text-gray-900">{trip.title}</h4>
                    <p className="text-sm text-green-600 font-bold">{trip.price} €</p>
                  </div>
                </div>
                <button onClick={() => deleteTrip(trip.id)} className="text-red-400 hover:text-red-600 p-2">
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}