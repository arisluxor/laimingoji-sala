"use client";

import { useState, useEffect, Suspense, useMemo } from "react";
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

  // --- DUOMENŲ KROVIMAS ---
  async function fetchTrips() {
    setLoading(true);
    const { data, error } = await supabase.from('trips').select('*').order('created_at', { ascending: false });
    if (data) setTrips(data);
    setLoading(false);
  }

  useEffect(() => { fetchTrips(); }, []);

  // --- KLAIDOS PATAISYMAS: deleteTrip funkcija pridėta ---
  const deleteTrip = async (id: number) => {
    if(confirm("Ar tikrai norite ištrinti šią kelionę iš sistemos?")) {
      const { error } = await supabase.from('trips').delete().eq('id', id);
      if (!error) {
        fetchTrips();
      } else {
        alert("Klaida trinant: " + error.message);
      }
    }
  };

  // --- NAUJOS KELIONĖS PRIDĖJIMAS ---
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
    const { error } = await supabase.from('trips').insert([tripData]);
    if (!error) {
      fetchTrips();
      e.target.reset();
      alert("Kelionė sėkmingai pridėta į Duomenų Bazę!");
    }
  };

  // --- UŽSAKYMO FORMOS VALDYMAS ---
  const handleOrder = async (e: any) => {
    e.preventDefault();
    const form = e.target;
    // ĮRAŠYK SAVO ID IŠ FORMSPREE.IO ČIA:
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

  // --- PAIEŠKOS FILTRAS ---
  const filteredTrips = useMemo(() => {
    return trips.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [trips, searchQuery]);

  const scrollToOffers = (e: any) => {
    e.preventDefault();
    document.getElementById('pasiulymai')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 font-sans selection:bg-emerald-100">
      
      {/* 🛠️ SLAPTAS ADMIN MYGTUKAS */}
      {isAdminSession && (
        <button onClick={() => setIsAdmin(!isAdmin)} className="fixed bottom-6 left-6 z-[100] p-4 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-2xl hover:scale-110 transition-all border-4 border-white">
          {isAdmin ? <Save size={24}/> : <Edit size={24}/>}
        </button>
      )}

      {/* 1. TOP BAR */}
      <div className="bg-emerald-950 text-emerald-50 py-2 px-6 text-[12px] hidden md:flex justify-between items-center font-medium tracking-wide">
        <div className="flex gap-6 italic">
          <span className="opacity-70 hover:opacity-100 cursor-pointer">Laimingosios Salos Paslaptys</span>
          <span className="opacity-70 hover:opacity-100 cursor-pointer">Pagalba gyvai</span>
        </div>
        <div className="flex gap-6 items-center">
          <a href="tel:+37062530999" className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors"><Phone size={14}/> +370 625 30999</a>
          <a href="mailto:Lukas@laimingojisala.lt" className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors font-bold"><Mail size={14}/> Lukas@laimingojisala.lt</a>
        </div>
      </div>

      {/* 2. NAVIGACIJA */}
      <nav className="bg-white/80 backdrop-blur-xl sticky top-0 z-50 border-b border-slate-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center text-sm font-bold">
          <a href="#" className="text-2xl md:text-3xl font-black flex items-center gap-1 tracking-tighter italic">
            🏝️ Laimingoji<span className="text-emerald-600">Sala</span>
          </a>
          <div className="hidden lg:flex gap-10 uppercase tracking-widest text-slate-400">
            <a href="#pasiulymai" onClick={scrollToOffers} className="hover:text-emerald-600 transition-colors">Visi pasiūlymai</a>
            <a href="#pasiulymai" onClick={scrollToOffers} className="hover:text-emerald-600 transition-colors">Egzotika</a>
            <a href="#pasiulymai" onClick={scrollToOffers} className="text-rose-500 hover:text-rose-600 transition-colors">🔥 Paskutinė minutė</a>
          </div>
          <button onClick={scrollToOffers} className="bg-slate-900 text-white px-8 py-3 rounded-full hover:bg-emerald-600 transition-all shadow-xl shadow-slate-200 uppercase text-xs tracking-tighter">
            Rasti savo salą
          </button>
        </div>
      </nav>

      {/* 3. HERO SEKCIJA */}
      <section className="relative h-[80vh] min-h-[600px] flex flex-col items-center justify-center px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
           <img src="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=2000" className="w-full h-full object-cover scale-105" alt="Beach" />
           <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/20 to-[#FDFDFD]"></div>
        </div>

        <div className="relative z-10 w-full max-w-5xl text-center mt-[-5vh]">
          <span className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-5 py-2 rounded-full text-xs font-black uppercase tracking-[0.3em] mb-8 inline-block shadow-2xl">
            Premium Travel Agency
          </span>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 tracking-tighter text-white drop-shadow-2xl">
             Kur Jūsų <br/><span className="text-emerald-400 italic font-serif">Laimė?</span>
          </h1>
          
          <div className="mt-12 bg-white p-2 rounded-full shadow-[0_30px_100px_rgba(0,0,0,0.4)] border border-white/20 flex items-center max-w-3xl mx-auto ring-emerald-400/30 focus-within:ring-8 transition-all">
            <div className="pl-8 pr-4 text-emerald-500"><Search size={28}/></div>
            <input 
              type="text" 
              placeholder="Įrašykite svajonių šalį..." 
              className="flex-1 py-5 bg-transparent outline-none text-xl font-medium text-slate-900"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button onClick={scrollToOffers} className="bg-emerald-500 text-white px-14 py-5 rounded-full font-black text-lg hover:bg-emerald-400 transition-all">
              IEŠKOTI
            </button>
          </div>
        </div>
      </section>

      {/* 🛠️ ADMIN PANELĖ */}
      {isAdmin && (
        <section className="max-w-5xl mx-auto bg-amber-50 p-10 rounded-[3rem] border-4 border-dashed border-amber-200 my-16 shadow-2xl animate-in slide-in-from-top duration-500">
           <h2 className="text-3xl font-black mb-8 text-amber-950 flex items-center gap-3 italic">🛠️ VALDYMO SKYDAS (Luko zona)</h2>
           <form onSubmit={addTrip} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <input name="title" placeholder="Pavadinimas (pvz. Maldyvai)" className="p-5 rounded-2xl border-none shadow-inner bg-white" required />
              <input name="price" placeholder="Kaina (€)" className="p-5 rounded-2xl border-none shadow-inner bg-white" required />
              <input name="tag" placeholder="Lipdukas (pvz. Populiaru)" className="p-5 rounded-2xl border-none shadow-inner bg-white" />
              <input name="img" placeholder="Nuotraukos URL (iš Unsplash)" className="p-5 rounded-2xl border-none shadow-inner bg-white md:col-span-3" required />
              <textarea name="desc" placeholder="Gundantis aprašymas klientams..." className="p-5 rounded-2xl border-none shadow-inner bg-white md:col-span-3" rows={3} />
              <button type="submit" className="md:col-span-3 bg-emerald-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-slate-900 transition-all shadow-xl shadow-emerald-200 flex justify-center items-center gap-3 uppercase">
                <Plus size={28}/> Įrašyti į Duomenų Bazę
              </button>
           </form>
        </section>
      )}

      {/* 4. PASIŪLYMŲ TINKLELIS */}
      <section id="pasiulymai" className="max-w-7xl mx-auto py-32 px-6">
        <div className="mb-20 text-center">
            <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-slate-950 mb-4 uppercase italic">Karščiausi pasiūlymai</h2>
            <div className="h-2 w-24 bg-emerald-500 mx-auto rounded-full"></div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-emerald-600 font-black italic">
            <div className="w-16 h-16 border-8 border-emerald-100 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
            KRAUNAME LAIMĘ...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {filteredTrips.map((trip) => (
              <div key={trip.id} className="group relative bg-white rounded-[3rem] overflow-hidden shadow-2xl shadow-slate-200/60 hover:shadow-emerald-200/40 hover:-translate-y-3 transition-all duration-500 border border-slate-50 flex flex-col">
                <div className="relative h-80 overflow-hidden">
                  <img src={trip.img} className="w-full h-full object-cover group-hover:scale-110 transition duration-1000" alt=""/>
                  {trip.tag && (
                    <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-xl px-5 py-2 rounded-2xl text-[11px] font-black uppercase tracking-widest text-emerald-900 shadow-xl">
                      {trip.tag}
                    </div>
                  )}
                  {isAdmin && (
                    <button onClick={() => deleteTrip(trip.id)} className="absolute top-6 right-6 bg-rose-500 text-white p-3 rounded-2xl shadow-xl hover:bg-rose-600 hover:rotate-90 transition-all z-20">
                      <Trash2 size={20}/>
                    </button>
                  )}
                </div>
                
                <div className="p-10 flex flex-col flex-1">
                  <h3 className="text-3xl font-black mb-4 text-slate-900 leading-tight italic tracking-tighter">{trip.title}</h3>
                  <div className="flex gap-6 mb-8 text-[13px] font-bold text-slate-400 uppercase tracking-widest">
                    <span className="flex items-center gap-2"><Plane size={18} className="text-emerald-500"/> Skrydis</span>
                    <span className="flex items-center gap-2"><Coffee size={18} className="text-emerald-500"/> Viešbutis</span>
                  </div>
                  
                  <div className="mt-auto pt-8 border-t border-slate-50 flex justify-between items-center">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-1 text-left">Kaina asmeniui</p>
                      <span className="text-4xl font-black text-emerald-600 tracking-tighter">{trip.price} €</span>
                    </div>
                    <button onClick={() => setSelectedTrip(trip)} className="bg-slate-900 text-white px-8 py-4 rounded-[1.5rem] font-black text-sm hover:bg-emerald-500 transition-all shadow-lg shadow-slate-200 uppercase tracking-widest">
                      Plačiau
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 5. UŽSAKYMO MODALAS */}
      {selectedTrip && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 backdrop-blur-2xl bg-emerald-950/40">
          <div className="absolute inset-0" onClick={() => setSelectedTrip(null)}></div>
          <div className="relative bg-white w-full max-w-5xl rounded-[4rem] overflow-hidden flex flex-col md:flex-row shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] animate-in zoom-in duration-300">
            
            <button onClick={() => setSelectedTrip(null)} className="absolute top-8 right-8 z-10 bg-slate-100 hover:bg-rose-500 hover:text-white p-3 rounded-2xl transition-all">
              <X size={28}/>
            </button>
            
            <div className="md:w-1/2 h-80 md:h-auto"><img src={selectedTrip.img} className="w-full h-full object-cover" /></div>
            
            <div className="md:w-1/2 p-12 md:p-16 flex flex-col bg-slate-50">
              <span className="text-emerald-600 font-black text-xs uppercase tracking-[0.4em] mb-4">Išskirtinis pasiūlymas</span>
              <h2 className="text-4xl md:text-5xl font-black mb-8 text-slate-900 tracking-tighter italic">{selectedTrip.title}</h2>
              <p className="text-slate-500 text-lg leading-relaxed mb-12 font-medium">
                {selectedTrip.description || "Susisiekite su Luku dabar ir rezervuokite šią nepamirštamą gyvenimo kelionę už geriausią kainą rinkoje."}
              </p>
              
              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
                {orderSuccess ? (
                  <div className="text-center py-10 animate-in fade-in">
                    <Check className="text-emerald-500 mx-auto mb-4" size={60}/>
                    <p className="text-2xl font-black text-slate-900 uppercase italic">Užklausa išsiųsta!</p>
                  </div>
                ) : (
                  <form onSubmit={handleOrder} className="space-y-5 text-left">
                    <input type="hidden" name="Kelione" value={selectedTrip.title} />
                    <div className="flex justify-between items-center mb-6">
                      <span className="font-bold text-slate-400 uppercase text-xs tracking-widest">Kaina:</span>
                      <span className="text-4xl font-black text-emerald-600 tracking-tighter">{selectedTrip.price} €</span>
                    </div>
                    <input name="email" required type="email" placeholder="Jūsų el. paštas" className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-emerald-500 transition-all font-bold" />
                    <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xl hover:bg-emerald-600 transition-all shadow-2xl shadow-slate-300 uppercase tracking-widest">
                      RESERVUOTI DABAR
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. TRUST SECTION */}
      <section className="bg-white border-y border-slate-100 py-32 px-6">
         <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-20">
            <div className="text-center group">
               <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-[2.5rem] flex items-center justify-center mb-8 mx-auto group-hover:rotate-12 transition-transform duration-500"><ShieldCheck size={48}/></div>
               <h3 className="text-2xl font-black mb-4 uppercase italic">Saugumas</h3>
               <p className="text-slate-400 font-medium">Aukščiausios kokybės kelionių draudimas ir 24/7 pagalba.</p>
            </div>
            <div className="text-center group">
               <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-[2.5rem] flex items-center justify-center mb-8 mx-auto group-hover:scale-110 transition-transform duration-500"><Heart size={48}/></div>
               <h3 className="text-2xl font-black mb-4 uppercase italic">Asmeninis ryšys</h3>
               <p className="text-slate-400 font-medium">Lukas asmeniškai atsako už kiekvieno kliento šypseną.</p>
            </div>
            <div className="text-center group">
               <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-[2.5rem] flex items-center justify-center mb-8 mx-auto group-hover:-rotate-12 transition-transform duration-500"><Star size={48}/></div>
               <h3 className="text-2xl font-black mb-4 uppercase italic">Tikra Egzotika</h3>
               <p className="text-slate-400 font-medium">Tik geriausiai įvertinti viešbučiai „Laimingojoje Saloje“.</p>
            </div>
         </div>
      </section>

      {/* 7. PREMIUM FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-24 border-t-8 border-emerald-500">
         <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
            <div className="lg:col-span-2 text-left">
               <div className="text-4xl font-black text-white italic mb-8 tracking-tighter">🏝️ LaimingojiSala</div>
               <p className="text-slate-500 text-lg mb-10 max-w-md font-medium leading-relaxed">Mes nekuriame kelionių. Mes pildome svajones apie Laimingąją Salą, kurią nešiojatės savo širdyje.</p>
               <div className="flex gap-4 items-center">
                  <span className="text-xs font-black uppercase tracking-widest text-slate-600">Sekite mus:</span>
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-emerald-500 hover:text-white cursor-pointer transition-all"><MessageCircle size={22}/></div>
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-emerald-500 hover:text-white cursor-pointer transition-all"><Camera size={22}/></div>
               </div>
            </div>
            <div className="text-left font-bold">
               <h4 className="text-white uppercase tracking-[0.3em] text-xs mb-8 opacity-50">Kontaktai</h4>
               <ul className="space-y-5 text-sm uppercase tracking-widest">
                  <li className="flex items-center gap-3 text-white"><Phone size={18} className="text-emerald-500"/> +370 625 30999</li>
                  <li className="flex items-center gap-3 text-white lowercase"><Mail size={18} className="text-emerald-500"/> Lukas@laimingojisala.lt</li>
                  <li className="flex items-center gap-3"><MapPin size={18} className="text-emerald-500"/> Vilnius, Lietuva</li>
               </ul>
            </div>
            <div className="text-left font-bold italic">
               <h4 className="text-white uppercase tracking-[0.3em] text-xs mb-8 opacity-50 not-italic">Laimė</h4>
               <p className="text-emerald-500 text-3xl font-black tracking-tighter">„Kelionės yra vienintelis dalykas, kurį perkant tampi turtingesnis.“</p>
            </div>
         </div>
         <div className="max-w-7xl mx-auto px-6 mt-20 pt-10 border-t border-white/5 text-center text-[10px] font-black uppercase tracking-[0.5em] text-slate-700">
            © 2026 Laimingoji Sala • Built with pride for Brother Lukas.
         </div>
      </footer>
    </div>
  );
}

// Next.js wrapperis klaidoms išvengti
export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-emerald-950 flex items-center justify-center text-white font-black italic tracking-widest">KRAUNAMA LAIMINGOJI SALA...</div>}>
      <MainContent />
    </Suspense>
  );
}