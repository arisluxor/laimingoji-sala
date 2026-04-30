"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  Search, MapPin, Calendar, Clock, Plane, ChevronRight, Check, Phone, 
  Mail, MessageCircle, Camera, Edit, Save, Trash2, Plus, X, Star, ShieldCheck, Heart 
} from "lucide-react";

export default function Home() {
  // --- STATES ---
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTrip, setSelectedTrip] = useState<any>(null); // Detaliam vaizdui
  const [orderSuccess, setOrderSuccess] = useState(false);
  
  const [trips, setTrips] = useState([
    { id: 1, title: "Svajonių Madeira 🌴", price: "527", tag: "Paskutinė minutė", img: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800", desc: "Aukščiausios klasės poilsis Portugalijos perle. Mėgaukitės levadomis ir vandenyno gaiva." },
    { id: 2, title: "Japonijos vyšnios", price: "1899", tag: "Populiariausia", img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800", desc: "Kultūrinė odisėja per Tokiją, Kiotą ir Osaką. Skrydis ir gidas įskaičiuoti." },
    { id: 3, title: "Egiptas: Luksoras ir poilsis", price: "399", tag: "Gera kaina", img: "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=800", desc: "Istorija ir „viskas įskaičiuota“ malonumai prie Raudonosios jūros." }
  ]);

  const [newTrip, setNewTrip] = useState({ title: "", price: "", img: "", tag: "Naujiena", desc: "" });

  // Load from local
  useEffect(() => {
    const saved = localStorage.getItem("laimingoji_trips_v2");
    if (saved) setTrips(JSON.parse(saved));
  }, []);

  const saveTrips = (data: any) => {
    setTrips(data);
    localStorage.setItem("laimingoji_trips_v2", JSON.stringify(data));
  };

  // --- FILTRAVIMAS (Brainstorm 2 punktas) ---
  const filteredTrips = useMemo(() => {
    return trips.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [trips, searchQuery]);

  // --- HANDLERS ---
  const addTrip = (e: any) => {
    e.preventDefault();
    const updated = [...trips, { ...newTrip, id: Date.now() }];
    saveTrips(updated);
    setNewTrip({ title: "", price: "", img: "", tag: "Naujiena", desc: "" });
  };

  const deleteTrip = (id: number) => {
    if(confirm("Ištrinti?")) saveTrips(trips.filter(t => t.id !== id));
  };

  const handleOrder = (e: any) => {
    e.preventDefault();
    setOrderSuccess(true);
    setTimeout(() => {
      setOrderSuccess(false);
      setSelectedTrip(null);
    }, 3000);
    // Čia Lukas gautų tavo testinį email
    console.log("Užsakymas gautas iš kliento!", e.target.email.value);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans text-slate-900 selection:bg-emerald-100">
      
      {/* 🛠️ ADMIN TOGGLE */}
      <button 
        onClick={() => setIsAdmin(!isAdmin)}
        className="fixed bottom-6 left-6 z-[100] p-4 bg-slate-900 text-white rounded-full shadow-2xl hover:scale-110 transition-all"
      >
        {isAdmin ? <Save size={20}/> : <Edit size={20}/>}
      </button>

      {/* NAVIGACIJA */}
      <nav className="bg-white/80 backdrop-blur-xl sticky top-0 z-50 border-b border-slate-100 px-6 py-4 flex justify-between items-center">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <div className="text-2xl font-black flex items-center gap-2 tracking-tighter">
            <span className="text-3xl">🏝️</span> Laimingoji<span className="text-emerald-500 font-serif italic">Sala</span>
          </div>
          <div className="hidden lg:flex gap-8 text-[13px] font-bold uppercase tracking-widest text-slate-500">
            <a href="#" className="text-emerald-600">Pradinis</a>
            <a href="#" className="hover:text-emerald-600 transition">Egzotika</a>
            <a href="#" className="hover:text-emerald-600 transition">Lietuva</a>
            <a href="mailto:Lukas@laimingojisala.lt" className="text-slate-900 border-l pl-8 border-slate-200 ml-4 flex items-center gap-2 font-black">
               <Mail size={16} className="text-emerald-500"/> Lukas@laimingojisala.lt
            </a>
          </div>
        </div>
      </nav>

      {/* HERO & SEARCH */}
      <section className="relative h-[70vh] flex flex-col items-center justify-center text-center px-6">
        <div className="absolute inset-0 z-0 bg-emerald-50 opacity-40">
           <img src="https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=1600" className="w-full h-full object-cover mix-blend-overlay" alt=""/>
        </div>

        <div className="relative z-10 max-w-4xl">
          <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter text-slate-950">
             Sveiki! <br/> Kur <span className="text-emerald-500 italic">keliausime?</span>
          </h1>
          
          {/* FUNCTIONAL SEARCH BAR */}
          <div className="bg-white p-2 rounded-full shadow-2xl border border-slate-100 flex items-center max-w-2xl mx-auto group focus-within:ring-4 ring-emerald-100 transition-all">
            <div className="pl-6 pr-4 text-emerald-500"><Search size={24}/></div>
            <input 
              type="text" 
              placeholder="Ieškokite krypties (pvz: Japonija)..." 
              className="flex-1 py-4 bg-transparent outline-none text-lg font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="bg-emerald-500 text-white px-8 py-4 rounded-full font-bold hover:bg-emerald-600 transition-all shadow-lg">
              IEŠKOTI
            </button>
          </div>
        </div>
      </section>

      {/* ADMIN PANEL */}
      {isAdmin && (
        <div className="max-w-4xl mx-auto bg-amber-50 p-8 rounded-[2.5rem] border-2 border-dashed border-amber-200 my-10 animate-pulse-slow">
           <h2 className="text-2xl font-black mb-6 flex items-center gap-2">🛠️ PRIDĖTI NAUJĄ KELIONĘ</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input placeholder="Pavadinimas" className="p-4 rounded-2xl border-none shadow-sm" value={newTrip.title} onChange={e => setNewTrip({...newTrip, title: e.target.value})} />
              <input placeholder="Kaina" className="p-4 rounded-2xl border-none shadow-sm" value={newTrip.price} onChange={e => setNewTrip({...newTrip, price: e.target.value})} />
              <input placeholder="Foto URL" className="p-4 rounded-2xl border-none shadow-sm md:col-span-2" value={newTrip.img} onChange={e => setNewTrip({...newTrip, img: e.target.value})} />
              <textarea placeholder="Aprašymas" className="p-4 rounded-2xl border-none shadow-sm md:col-span-2" value={newTrip.desc} onChange={e => setNewTrip({...newTrip, desc: e.target.value})} />
              <button onClick={addTrip} className="md:col-span-2 bg-emerald-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition">
                <Plus/> Įtraukti į sąrašą
              </button>
           </div>
        </div>
      )}

      {/* TRIPS GRID */}
      <section className="max-w-7xl mx-auto py-20 px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-black tracking-tight">Populiariausi pasiūlymai</h2>
            <p className="text-slate-400 font-medium mt-2">Brolio Luko rankomis atrinktos svajonės</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {filteredTrips.map((trip) => (
            <div key={trip.id} className="group relative bg-white rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="relative h-72 overflow-hidden">
                <img src={trip.img} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt=""/>
                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-emerald-900">
                  {trip.tag}
                </div>
                {isAdmin && (
                  <button onClick={() => deleteTrip(trip.id)} className="absolute top-6 right-6 bg-red-500 text-white p-2 rounded-full hover:scale-110 transition">
                    <Trash2 size={18}/>
                  </button>
                )}
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-4 leading-tight">{trip.title}</h3>
                <div className="flex justify-between items-center pt-6 border-t border-slate-50">
                  <div>
                    <p className="text-[10px] font-bold text-slate-300 uppercase">Kaina nuo</p>
                    <span className="text-3xl font-black text-emerald-600">{trip.price} €</span>
                  </div>
                  <button 
                    onClick={() => setSelectedTrip(trip)}
                    className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-emerald-500 transition-colors"
                  >
                    Žiūrėti
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SOCIAL PROOF (Brainstorm 5 punktas) */}
      <section className="bg-emerald-950 py-24 text-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-16 items-center">
          <div className="md:col-span-1">
            <h2 className="text-4xl font-bold mb-6 italic">Kodėl <br/>Laimingoji Sala?</h2>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                 <ShieldCheck className="text-emerald-400" size={32}/>
                 <p className="font-bold">Saugumo Garantija</p>
              </div>
              <div className="flex items-center gap-4">
                 <Heart className="text-emerald-400" size={32}/>
                 <p className="font-bold">Asmeninis dėmesys</p>
              </div>
            </div>
          </div>
          <div className="md:col-span-2 bg-white/10 backdrop-blur-xl p-10 rounded-[3rem] border border-white/10">
             <div className="flex gap-2 mb-6">
               {[1,2,3,4,5].map(i => <Star key={i} className="text-yellow-400 fill-yellow-400" size={16}/>)}
             </div>
             <p className="text-2xl font-medium leading-relaxed mb-8">
               "Lukas suorganizavo mums geriausias gyvenimo atostogas. Viskas nuo A iki Z buvo tobula. Jautėmės kaip tikroje Laimingoje saloje!"
             </p>
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-500 rounded-full"></div>
                <div>
                  <p className="font-bold">Gabija P.</p>
                  <p className="text-sm opacity-50">Keliavo į Madeirą</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* TRIP DETAIL MODAL (Brainstorm 3 & 4 punktas) */}
      {selectedTrip && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setSelectedTrip(null)}></div>
          <div className="relative bg-white w-full max-w-5xl rounded-[3rem] overflow-hidden flex flex-col md:flex-row shadow-2xl animate-in fade-in zoom-in duration-300">
            <button onClick={() => setSelectedTrip(null)} className="absolute top-6 right-6 z-10 bg-white/80 p-2 rounded-full hover:bg-white">
              <X size={24}/>
            </button>
            
            <div className="md:w-1/2 h-80 md:h-auto">
              <img src={selectedTrip.img} className="w-full h-full object-cover" alt=""/>
            </div>
            
            <div className="md:w-1/2 p-10 flex flex-col">
              <h2 className="text-4xl font-black mb-4">{selectedTrip.title}</h2>
              <p className="text-slate-500 leading-relaxed mb-8">
                {selectedTrip.desc || "Ši kelionė yra specialiai paruošta brolio Luko, siekiant suteikti jums maksimalų komfortą ir nepamirštamus įspūdžius. Į kainą įskaičiuoti visi mokesčiai ir asmeninė konsultacija."}
              </p>
              
              {/* ORDER FORM (UŽSAKYMAS) */}
              <div className="mt-auto bg-slate-50 p-6 rounded-3xl border border-slate-100">
                {orderSuccess ? (
                  <div className="text-center py-4">
                    <Check className="mx-auto text-emerald-500 mb-2" size={40}/>
                    <p className="font-bold text-emerald-600">Užklausa išsiųsta Lukui!</p>
                    <p className="text-xs text-slate-400">Patikrinkite savo Temp Mail už 1 min.</p>
                  </div>
                ) : (
                  <form onSubmit={handleOrder} className="space-y-4">
                    <p className="text-sm font-bold uppercase text-slate-400">Rezervuoti vietą</p>
                    <input name="email" required type="email" placeholder="Jūsų el. paštas (pvz. iš Temp Mail)" className="w-full p-4 rounded-xl border-none outline-none ring-2 ring-transparent focus:ring-emerald-500 transition-all" />
                    <button className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-emerald-700 transition shadow-xl shadow-emerald-100 flex items-center justify-center gap-2">
                       Užsakyti už {selectedTrip.price} € <ChevronRight size={20}/>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="py-12 text-center border-t border-slate-100">
         <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
            © 2026 Laimingoji Sala • Powered by Lukas's Vision
         </p>
      </footer>

      {/* FLOAT WHATSAPP */}
      <a href="https://wa.me/37062530999" target="_blank" className="fixed bottom-6 right-6 bg-[#25D366] text-white p-5 rounded-full shadow-2xl hover:scale-110 transition-all z-50">
        <MessageCircle size={24}/>
      </a>

    </div>
  );
}

// Sub-component search field
function SearchField({ label, value, icon }: any) {
  return (
    <div className="flex-1 px-6 py-4 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer text-left">
      <div className="flex items-center gap-3">
        <div className="text-emerald-500">{icon}</div>
        <div>
          <p className="text-[10px] font-black uppercase text-slate-300 tracking-wider leading-none mb-1">{label}</p>
          <p className="text-sm font-bold text-slate-700 leading-none">{value}</p>
        </div>
      </div>
    </div>
  );
}