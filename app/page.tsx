"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { Search, MapPin, Calendar, Plane, ChevronRight, Check, Phone, Mail, Edit, Save, Trash2, Plus, X, Star, ShieldCheck, Heart, Coffee } from "lucide-react";

// Supabase prisijungimas
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function MainContent() {
  const searchParams = useSearchParams();
  const isAdminSession = searchParams.get('admin') === 'sala2026'; 
  
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
    // FORMSPREE INTEGRACIJA
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

  // Sklandus slinkimas į pasiūlymus
  const scrollToOffers = (e: any) => {
    e.preventDefault();
    document.getElementById('pasiulymai')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-emerald-200">
      
      {/* ADMIN MYGTUKAS */}
      {isAdminSession && (
        <button onClick={() => setIsAdmin(!isAdmin)} className="fixed bottom-6 left-6 z-[100] p-4 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-2xl hover:scale-110 transition-all">
          {isAdmin ? <Save size={24}/> : <Edit size={24}/>}
        </button>
      )}

      {/* 1. PREMIUM TOP BAR */}
      <div className="bg-emerald-950 text-emerald-50 py-2 px-6 text-[12px] hidden md:flex justify-between items-center font-medium tracking-wide">
        <div className="flex gap-6">
          <span className="hover:text-white cursor-pointer transition-colors">Apie Laimingąją Salą</span>
          <span className="hover:text-white cursor-pointer transition-colors">DUK</span>
          <span className="hover:text-white cursor-pointer transition-colors">Kelionių draudimas</span>
        </div>
        <div className="flex gap-6 items-center">
          <a href="tel:+37062530999" className="flex items-center gap-1.5 hover:text-white transition-colors"><Phone size={14}/> +370 625 30999</a>
          <a href="mailto:Lukas@laimingojisala.lt" className="flex items-center gap-1.5 hover:text-white transition-colors"><Mail size={14}/> Lukas@laimingojisala.lt</a>
        </div>
      </div>

      {/* 2. STICKY GLASS NAVIGATION */}
      <nav className="bg-white/80 backdrop-blur-xl sticky top-0 z-50 border-b border-slate-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <a href="#" className="text-2xl md:text-3xl font-black flex items-center gap-2 tracking-tight group">
            <span className="group-hover:rotate-12 transition-transform">🏝️</span> 
            Laimingoji<span className="text-emerald-600 italic">Sala</span>
          </a>
          <div className="hidden lg:flex gap-8 text-[13px] font-bold uppercase tracking-widest text-slate-500">
            <a href="#pasiulymai" onClick={scrollToOffers} className="hover:text-emerald-600 transition-colors">Visi pasiūlymai</a>
            <a href="#pasiulymai" onClick={scrollToOffers} className="hover:text-emerald-600 transition-colors">Egzotika</a>
            <a href="#pasiulymai" onClick={scrollToOffers} className="text-rose-500 hover:text-rose-600 transition-colors">Paskutinė minutė</a>
          </div>
          <button onClick={scrollToOffers} className="hidden md:block bg-slate-900 text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-emerald-600 transition-colors shadow-lg shadow-slate-200">
            Rasti kelionę
          </button>
        </div>
      </nav>

      {/* 3. IMMERSIVE HERO SECTION (Čia buvo pagrindinė problema) */}
      <section className="relative h-[85vh] min-h-[600px] flex flex-col items-center justify-center px-4 overflow-hidden">
        {/* Full background image */}
        <div className="absolute inset-0 z-0">
           <img 
             src="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=2000&q=80" 
             className="w-full h-full object-cover scale-105 animate-slow-zoom" 
             alt="Tropical background"
           />
           {/* Gradient overlay for text readability */}
           <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/20 to-[#F8FAFC]"></div>
        </div>

        <div className="relative z-10 w-full max-w-5xl text-center mt-[-10vh]">
          <span className="inline-block py-1 px-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold uppercase tracking-widest mb-6 shadow-xl">
            Atraskite pasaulį su Luku
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tighter text-white drop-shadow-2xl">
             Kur Jūsų <span className="text-emerald-400 italic">svajonė?</span>
          </h1>
          
          {/* GLASSMORPHISM SEARCH BAR */}
          <div className="mt-10 bg-white/10 backdrop-blur-xl p-2 rounded-full border border-white/20 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] flex items-center max-w-3xl mx-auto ring-emerald-400/50 focus-within:ring-4 transition-all">
            <div className="pl-6 pr-4 text-white"><Search size={24}/></div>
            <input 
              type="text" 
              placeholder="Įveskite kryptį (pvz. Japonija, Madeira)..." 
              className="flex-1 py-4 md:py-5 bg-transparent outline-none text-lg md:text-xl font-medium text-white placeholder:text-white/70"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button onClick={scrollToOffers} className="bg-emerald-500 text-white px-8 md:px-12 py-4 md:py-5 rounded-full font-black text-lg hover:bg-emerald-400 transition-colors shadow-lg">
              IEŠKOTI
            </button>
          </div>
        </div>
      </section>

      {/* ADMIN PANEL */}
      {isAdmin && (
        <section className="relative z-20 max-w-5xl mx-auto bg-amber-50 p-8 rounded-[2rem] border-2 border-dashed border-amber-300 -mt-10 shadow-2xl mb-20">
           <h2 className="text-2xl font-black mb-6 text-amber-900 flex items-center gap-2">🛠️ PRIDĖTI NAUJĄ KELIONĘ (Duomenų Bazė)</h2>
           <form onSubmit={addTrip} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input name="title" placeholder="Pavadinimas (Egiptas)" className="p-4 rounded-xl border border-amber-200 outline-none focus:ring-2 ring-emerald-500" required />
              <input name="price" placeholder="Kaina (399)" className="p-4 rounded-xl border border-amber-200 outline-none focus:ring-2 ring-emerald-500" required />
              <input name="tag" placeholder="Lipdukas (WOW kaina)" className="p-4 rounded-xl border border-amber-200 outline-none focus:ring-2 ring-emerald-500" />
              <input name="img" placeholder="Aukštos kokybės Foto URL (Iš Unsplash)" className="p-4 rounded-xl border border-amber-200 outline-none focus:ring-2 ring-emerald-500 md:col-span-3" required />
              <textarea name="desc" placeholder="Gundantis aprašymas..." className="p-4 rounded-xl border border-amber-200 outline-none focus:ring-2 ring-emerald-500 md:col-span-3" rows={3} />
              <button type="submit" className="md:col-span-3 bg-slate-900 text-white py-4 rounded-xl font-black text-lg hover:bg-emerald-600 transition-colors shadow-lg flex justify-center items-center gap-2">
                <Plus size={24}/> Išsaugoti Duomenų Bazėje
              </button>
           </form>
        </section>
      )}

      {/* 4. PREMIUM TRIPS GRID */}
      <section id="pasiulymai" className="max-w-7xl mx-auto py-24 px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
          <div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-2">Karščiausi pasiūlymai</h2>
            <p className="text-lg text-slate-500 font-medium">Brolio Luko kruopščiai atrinktos kelionės Jums</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTrips.length === 0 && <p className="text-slate-400 font-medium text-lg col-span-3">Pagal jūsų paiešką nieko neradome...</p>}
            
            {filteredTrips.map((trip) => (
              <div key={trip.id} className="group flex flex-col bg-white rounded-[2rem] overflow-hidden shadow-lg shadow-slate-200/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-slate-100">
                {/* Image Section */}
                <div className="relative h-64 overflow-hidden">
                  <img src={trip.img} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" alt=""/>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {trip.tag && (
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-md">
                      {trip.tag}
                    </div>
                  )}
                  
                  {isAdmin && (
                    <button onClick={() => deleteTrip(trip.id)} className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-lg shadow-lg hover:bg-red-600 transition z-20">
                      <Trash2 size={18}/>
                    </button>
                  )}
                </div>
                
                {/* Details Section */}
                <div className="p-8 flex flex-col flex-1">
                  <h3 className="text-2xl font-bold mb-4 text-slate-900 leading-tight">{trip.title}</h3>
                  <div className="flex gap-4 mb-6 text-sm font-medium text-slate-500">
                    <span className="flex items-center gap-1"><Plane size={16} className="text-emerald-500"/> Skrydis</span>
                    <span className="flex items-center gap-1"><Coffee size={16} className="text-emerald-500"/> Pusryčiai</span>
                  </div>
                  
                  {/* Price & Action */}
                  <div className="mt-auto pt-6 border-t border-slate-100 flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Kaina asmeniui</p>
                      <span className="text-3xl font-black text-emerald-600">{trip.price} €</span>
                    </div>
                    <button 
                      onClick={() => setSelectedTrip(trip)}
                      className="bg-slate-50 hover:bg-emerald-500 text-slate-900 hover:text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-sm"
                    >
                      Plačiau
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 5. LUXURY MODAL (Užsakymas) */}
      {selectedTrip && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => setSelectedTrip(null)}></div>
          <div className="relative bg-white w-full max-w-5xl rounded-[2rem] overflow-hidden flex flex-col md:flex-row shadow-2xl animate-in zoom-in duration-300">
            
            <button onClick={() => setSelectedTrip(null)} className="absolute top-4 right-4 z-10 bg-white/50 hover:bg-white p-2 rounded-full transition-colors backdrop-blur-md">
              <X size={24} className="text-slate-900"/>
            </button>
            
            <div className="md:w-1/2 h-64 md:h-auto relative">
              <img src={selectedTrip.img} className="w-full h-full object-cover" alt="" />
            </div>
            
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col bg-slate-50">
              <span className="text-emerald-600 font-bold text-sm uppercase tracking-widest mb-2">Kelionės informacija</span>
              <h2 className="text-3xl md:text-4xl font-black mb-6 text-slate-900">{selectedTrip.title}</h2>
              <p className="text-slate-600 leading-relaxed mb-8 flex-1">
                {selectedTrip.description || "Susisiekite su Luku dėl detalaus šios kelionės aprašo ir programos."}
              </p>
              
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                {orderSuccess ? (
                  <div className="text-center py-6 animate-in fade-in">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check className="text-emerald-600" size={32}/>
                    </div>
                    <p className="text-xl font-black text-slate-900 mb-2">Užklausa išsiųsta!</p>
                    <p className="text-slate-500 text-sm">Lukas greitai su jumis susisieks.</p>
                  </div>
                ) : (
                  <form onSubmit={handleOrder} className="space-y-4">
                    <input type="hidden" name="Kelionė" value={selectedTrip.title} />
                    <input type="hidden" name="Kaina" value={selectedTrip.price} />
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm font-bold text-slate-500">Galutinė kaina:</span>
                      <span className="text-3xl font-black text-emerald-600">{selectedTrip.price} €</span>
                    </div>
                    <input name="email" required type="email" placeholder="Jūsų el. paštas" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all" />
                    <input name="tel" placeholder="Telefonas (nebūtina)" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all" />
                    <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-xl font-black text-lg hover:bg-emerald-600 transition-all shadow-lg">
                      UŽSAKYTI DABAR
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. TRUST SECTION */}
      <section className="bg-white border-t border-slate-100 py-20">
         <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col items-center">
               <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6"><ShieldCheck size={32}/></div>
               <h3 className="text-xl font-bold mb-2">Saugi kelionė</h3>
               <p className="text-slate-500 text-sm">Visos mūsų kelionės yra apdraustos ir atitinka aukščiausius saugumo standartus.</p>
            </div>
            <div className="flex flex-col items-center">
               <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6"><Heart size={32}/></div>
               <h3 className="text-xl font-bold mb-2">Asmeninis dėmesys</h3>
               <p className="text-slate-500 text-sm">Lukas asmeniškai pasirūpins kiekviena jūsų atostogų detale.</p>
            </div>
            <div className="flex flex-col items-center">
               <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6"><Star size={32}/></div>
               <h3 className="text-xl font-bold mb-2">Aukščiausia kokybė</h3>
               <p className="text-slate-500 text-sm">Bendradarbiaujame tik su geriausiai įvertintais viešbučiais pasaulyje.</p>
            </div>
         </div>
      </section>

      {/* 7. PREMIUM FOOTER */}
      <footer className="bg-slate-950 text-slate-300 py-20 border-t-4 border-emerald-500">
         <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            
            {/* Brand */}
            <div className="lg:col-span-2">
               <div className="text-3xl font-black text-white flex items-center gap-2 tracking-tight italic mb-6">
                 🏝️ Laimingoji<span className="text-emerald-500">Sala</span>
               </div>
               <p className="text-slate-400 mb-8 max-w-sm">Nepakartojamos kelionės ir įspūdžiai, kuriuos prisiminsite visą gyvenimą. Brolio Luko vizija, jūsų atostogos.</p>
               <div className="flex gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-emerald-500 hover:text-white cursor-pointer transition-colors"><MessageCircle size={18}/></div>
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-emerald-500 hover:text-white cursor-pointer transition-colors"><Camera size={18}/></div>
               </div>
            </div>

            {/* Links */}
            <div>
               <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-6">Pagalba</h4>
               <ul className="space-y-4 text-sm font-medium">
                  <li><a href="#" className="hover:text-emerald-400 transition-colors">Kontaktai</a></li>
                  <li><a href="#" className="hover:text-emerald-400 transition-colors">DUK</a></li>
                  <li><a href="#" className="hover:text-emerald-400 transition-colors">Taisyklės</a></li>
               </ul>
            </div>

            {/* Contact */}
            <div>
               <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-6">Susisiekite</h4>
               <ul className="space-y-4 text-sm font-medium">
                  <li className="flex items-center gap-3"><Phone size={16} className="text-emerald-500"/> +370 625 30999</li>
                  <li className="flex items-center gap-3"><Mail size={16} className="text-emerald-500"/> Lukas@laimingojisala.lt</li>
                  <li className="flex items-center gap-3"><MapPin size={16} className="text-emerald-500"/> Vilnius, Lietuva</li>
               </ul>
            </div>

         </div>
         <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/10 text-center text-xs text-slate-500 font-bold uppercase tracking-widest">
            © 2026 Laimingoji Sala • Code & Design by you.
         </div>
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900 flex items-center justify-center text-emerald-500 font-bold">Kraunama Laimingoji Sala...</div>}>
      <MainContent />
    </Suspense>
  );
}