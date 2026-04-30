"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { Search, MapPin, Calendar, Clock, Plane, ChevronRight, Check, Phone, Mail, MessageCircle, Camera, Edit, Save, Trash2, Plus, X, Star, ShieldCheck, Heart } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function MainContent() {
  const searchParams = useSearchParams();
  const isAdminSession = searchParams.get('admin') === 'sala2026'; // SLAPTAS RAKTAS
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTrip, setSelectedTrip] = useState<any>(null);
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [orderSuccess, setOrderSuccess] = useState(false);

  async function fetchTrips() {
    const { data } = await supabase.from('trips').select('*').order('created_at', { ascending: false });
    if (data) setTrips(data);
    setLoading(false);
  }

  useEffect(() => { fetchTrips(); }, []);

  const addTrip = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const tripData = {
      title: formData.get("title"),
      price: formData.get("price"),
      img: formData.get("img"),
      tag: formData.get("tag"),
      description: formData.get("desc")
    };
    await supabase.from('trips').insert([tripData]);
    fetchTrips();
    e.target.reset();
  };

  const handleOrder = async (e: any) => {
    e.preventDefault();
    const form = e.target;
    // FORM-SPREE INTEGRACIJA (Įrašyk savo ID iš Formspree)
    const response = await fetch("https://formspree.io/f/TAVO_ID_CIA", {
      method: "POST",
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    });
    if (response.ok) {
      setOrderSuccess(true);
      setTimeout(() => { setSelectedTrip(null); setOrderSuccess(false); }, 3000);
    }
  };

  const filteredTrips = trips.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-white text-slate-900">
      
      {/* 🛠️ ADMIN MYGTUKAS - Matomas TIK su slaptu linku */}
      {isAdminSession && (
        <button onClick={() => setIsAdmin(!isAdmin)} className="fixed bottom-6 left-6 z-[100] p-4 bg-red-600 text-white rounded-full shadow-2xl">
          {isAdmin ? <Save /> : <Edit />}
        </button>
      )}

      {/* 1. TOP BAR - SU-CENTRUOTAS */}
      <div className="bg-[#22c55e] text-white py-2 px-4 text-[13px] hidden md:flex justify-center items-center gap-10 font-medium">
        <div className="flex gap-6">
          <span className="hover:underline cursor-pointer">Lėktuvų bilietai</span>
          <span className="hover:underline cursor-pointer">Viešbučiai</span>
          <span className="hover:underline cursor-pointer">Kontaktai</span>
        </div>
        <div className="flex gap-6 items-center border-l border-white/30 pl-10">
          <span className="font-bold flex items-center gap-1"><Phone size={14}/> +370 625 30999</span>
          <span className="font-bold flex items-center gap-1"><Mail size={14}/> Lukas@laimingojisala.lt</span>
        </div>
      </div>

      {/* 2. NAVIGACIJA */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center font-bold">
          <div className="text-2xl font-black flex items-center gap-1 italic tracking-tighter">
            🏝️ Laimingoji<span className="text-[#22c55e]">Sala</span>
          </div>
          <div className="hidden lg:flex gap-8 text-[12px] uppercase tracking-widest text-slate-400">
            <a href="#" className="text-[#22c55e]">Egzotika</a>
            <a href="#" className="hover:text-[#22c55e] transition">Lietuva</a>
            <a href="#" className="hover:text-[#22c55e] transition">Paskutinė minutė</a>
          </div>
        </div>
      </nav>

      {/* 3. HERO & SEARCH */}
      <header className="relative py-20 text-center bg-emerald-50/20 px-6">
        <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter">
           Kur <span className="text-[#22c55e] italic">keliausime?</span>
        </h1>
        <div className="bg-white p-2 rounded-full shadow-2xl border border-slate-100 flex items-center max-w-2xl mx-auto">
          <div className="pl-6 pr-4 text-[#22c55e]"><Search size={24}/></div>
          <input 
            type="text" 
            placeholder="Ieškokite savo svajonės..." 
            className="flex-1 py-4 outline-none text-lg"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      {/* 4. ADMIN PANELĖ */}
      {isAdmin && (
        <div className="max-w-4xl mx-auto bg-yellow-50 p-8 rounded-[2rem] border-2 border-dashed border-yellow-200 my-10 animate-in slide-in-from-top">
           <h2 className="text-xl font-black mb-4">🛠️ DB VALDYMAS</h2>
           <form onSubmit={addTrip} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="title" placeholder="Pavadinimas" className="p-4 rounded-xl border" required />
              <input name="price" placeholder="Kaina" className="p-4 rounded-xl border" required />
              <input name="img" placeholder="Foto URL" className="p-4 rounded-xl border md:col-span-2" required />
              <textarea name="desc" placeholder="Aprašymas" className="p-4 rounded-xl border md:col-span-2" />
              <button type="submit" className="md:col-span-2 bg-[#22c55e] text-white py-4 rounded-xl font-bold">PRIDĖTI KELIONĘ</button>
           </form>
        </div>
      )}

      {/* 5. KELIONĖS */}
      <section className="max-w-7xl mx-auto py-20 px-6">
        <h2 className="text-3xl font-black mb-12 uppercase italic">Populiariausi pasiūlymai 🔥</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {filteredTrips.map((trip) => (
            <div key={trip.id} className="bg-white rounded-[2rem] overflow-hidden shadow-lg border border-slate-50 group hover:-translate-y-2 transition-all">
              <div className="h-64 overflow-hidden relative">
                <img src={trip.img} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt=""/>
                {isAdmin && (
                  <button onClick={async () => { await supabase.from('trips').delete().eq('id', trip.id); fetchTrips(); }} className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full"><Trash2 size={16}/></button>
                )}
              </div>
              <div className="p-8">
                <h3 className="text-xl font-bold mb-4">{trip.title}</h3>
                <div className="flex justify-between items-center border-t pt-6">
                   <span className="text-2xl font-black text-[#22c55e]">{trip.price} €</span>
                   <button onClick={() => setSelectedTrip(trip)} className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm">Žiūrėti</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. UŽSAKYMO MODALAS */}
      {selectedTrip && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 backdrop-blur-md bg-slate-900/60">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 relative animate-in zoom-in duration-200">
            <button onClick={() => setSelectedTrip(null)} className="absolute top-6 right-6 text-slate-300 hover:text-slate-900"><X/></button>
            <h2 className="text-3xl font-black mb-2">{selectedTrip.title}</h2>
            <p className="text-slate-500 mb-8">Užpildykite formą ir Lukas susisieks su jumis per 15 minučių.</p>
            
            {orderSuccess ? (
              <div className="text-center text-green-500 font-bold py-10">Užsakymas sėkmingai išsiųstas Lukui! ✅</div>
            ) : (
              <form onSubmit={handleOrder} className="space-y-4">
                <input type="hidden" name="Kelionė" value={selectedTrip.title} />
                <input type="hidden" name="Kaina" value={selectedTrip.price} />
                <input name="email" required type="email" placeholder="Jūsų el. pašto adresas" className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 ring-emerald-500" />
                <input name="tel" placeholder="Telefono numeris (nebūtina)" className="w-full p-4 bg-slate-50 rounded-2xl outline-none" />
                <button type="submit" className="w-full bg-[#22c55e] text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-emerald-100">SIŲSTI UŽKLAUSĄ</button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 7. FOOTERIS - NEMATOMAS INPUT PATAISYTAS */}
      <footer className="bg-[#13221e] text-white py-20">
         <div className="max-w-7xl mx-auto px-6 text-center">
            <h3 className="text-2xl font-black mb-8 uppercase">Prenumeruokite Laimę 🏝️</h3>
            <div className="flex max-w-md mx-auto mb-12">
               <input type="email" placeholder="Įveskite savo el. paštą" className="flex-1 p-4 rounded-l-2xl text-slate-900 outline-none" />
               <button className="bg-[#22c55e] px-8 rounded-r-2xl font-bold">OK</button>
            </div>
            <p className="text-slate-500 text-xs tracking-widest italic">© 2026 Laimingoji Sala • Lukas@laimingojisala.lt</p>
         </div>
      </footer>

    </div>
  );
}

// Next.js reikalavimas dėl paieškos parametrų
export default function Home() {
  return (
    <Suspense fallback={<div>Kraunama...</div>}>
      <MainContent />
    </Suspense>
  );
}