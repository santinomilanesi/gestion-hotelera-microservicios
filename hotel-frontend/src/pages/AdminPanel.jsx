import React, { useState, useEffect } from 'react';
import { useAdminData } from '../hooks/useAdminData';
import { UserService, RoomService, BookingService } from '../services/apiService';
import { UserTable, RoomTable, BookingTable, BookingCard } from '../components/admin/Sections';
import { 
  LayoutDashboard, Calendar, Bed, Users, X, Save, 
  ChevronRight, Plus, Trash2, IdCard, User, Phone, Mail, 
  Calculator, Hash, CheckCircle2, AlertCircle, Layers, UserPlus
} from 'lucide-react';

// --- COMPONENTE: INPUT PREMIUM ---
const PremiumInput = ({ label, value, onChange, type = "text", icon: Icon, placeholder, readOnly = false }) => (
  <div className="flex flex-col gap-1.5 relative group w-full">
    <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-5 mb-[-7px] z-10 bg-white w-fit px-2 transition-colors group-focus-within:text-blue-600">
      {label}
    </label>
    <div className="relative">
      {Icon && <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors"><Icon size={16} /></div>}
      <input 
        type={type}
        placeholder={placeholder}
        value={value || ''}
        readOnly={readOnly}
        onChange={e => onChange(e.target.value)}
        className={`w-full ${Icon ? 'pl-14' : 'px-6'} py-4 ${readOnly ? 'bg-slate-50 border-slate-200 text-slate-400' : 'bg-white border-slate-100 text-slate-700'} border-2 rounded-[1.2rem] font-bold text-sm outline-none transition-all focus:border-blue-500 focus:shadow-[0_0_25px_rgba(59,130,246,0.08)] placeholder:text-slate-200`}
      />
    </div>
  </div>
);

const NavBtn = ({ active, label, icon, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center justify-between p-5 rounded-[1.2rem] font-black text-[10px] transition-all cursor-pointer border-none outline-none ${active ? 'bg-blue-600 text-white shadow-xl shadow-blue-200' : 'text-slate-500 hover:bg-slate-800 hover:text-white'}`}>
    <div className="flex items-center gap-4">{React.cloneElement(icon, { size: 18 })}<span className="uppercase tracking-[0.1em]">{label}</span></div>
    {active && <ChevronRight size={14} />}
  </button>
);

export default function AdminPanel() {
  const { habitaciones, usuarios, reservas, loading, refresh } = useAdminData();
  const [view, setView] = useState('panel');
  const [modal, setModal] = useState({ type: null, data: null });
  const [form, setForm] = useState({});
  const [foundUser, setFoundUser] = useState(null);
  const [totalLive, setTotalLive] = useState(0);

  // --- HIDRATACIÓN DE DATOS (JOIN FRONTEND) ---
  const reservasHidratadas = reservas.map(res => {
    const u = usuarios.find(user => Number(user.id) === Number(res.usuarioId));
    const h = habitaciones.find(hab => Number(hab.id) === Number(res.habitacionId));
    return {
      ...res,
      usuarioNombre: u ? u.nombre : `Huésped #${res.usuarioId}`,
      usuarioDni: u ? u.dni : "---",
      habitacionNumero: h ? h.numero : "S/N"
    };
  }).reverse();

  // --- LÓGICA DE BÚSQUEDA DE DNI ---
  useEffect(() => {
    if (modal.type === 'booking-form' && form.dni?.trim().length > 6) {
      const user = usuarios.find(u => String(u.dni).trim() === String(form.dni).trim());
      if (user) { 
        setFoundUser(user); 
        setForm(prev => ({ ...prev, usuarioId: user.id })); 
      } else { setFoundUser(false); }
    } else { setFoundUser(null); }
  }, [form.dni, modal.type, usuarios]);

  // --- CÁLCULO DE PRECIO EN VIVO ---
  useEffect(() => {
    if (modal.type === 'booking-form' && form.fechaInicio && form.fechaFin && form.habitacionId) {
      const inicio = new Date(form.fechaInicio);
      const fin = new Date(form.fechaFin);
      const room = habitaciones.find(h => Number(h.id) === Number(form.habitacionId));
      if (fin > inicio && room) {
        const noches = Math.ceil((fin - inicio) / (1000 * 60 * 60 * 24));
        setTotalLive(noches * (room.precio || 0));
      } else { setTotalLive(0); }
    } else { setTotalLive(0); }
  }, [form.fechaInicio, form.fechaFin, form.habitacionId, modal.type, habitaciones]);

  const openForm = (type, data = null, initialFields = {}) => { 
    setModal({ type, data }); 
    setForm(data ? { ...data } : { disponible: true, ...initialFields }); 
  };
  
  const close = () => { setModal({ type: null, data: null }); setForm({}); setFoundUser(null); setTotalLive(0); };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (modal.type === 'booking-form') {
        await BookingService.create({
          usuarioId: Number(form.usuarioId),
          habitacionId: Number(form.habitacionId),
          fechaInicio: form.fechaInicio,
          fechaFin: form.fechaFin,
          montoTotal: Number(totalLive),
          estado: "CONFIRMADA"
        });
      } 
      else if (modal.type === 'user-form') {
        const payload = { ...form, rol: "CLIENTE", password: "123" };
        modal.data ? await UserService.update(modal.data.id, payload) : await UserService.create(payload);
      } 
      else if (modal.type === 'room-form') {
        const payload = { ...form, precio: Number(form.precio), disponible: !!form.disponible };
        modal.data ? await RoomService.update(modal.data.id, payload) : await RoomService.create(payload);
      }
      refresh(); close();
    } catch (err) { alert("Error de comunicación con el servidor."); }
  };

  const handleDelete = async () => {
    try {
      if (modal.type === 'delete-user') await UserService.delete(modal.data.id);
      if (modal.type === 'delete-room') await RoomService.delete(modal.data.id);
      if (modal.type === 'delete-booking') await BookingService.delete(modal.data.id);
      refresh(); close();
    } catch (err) { alert("Error al eliminar el registro."); }
  };

  return (
    <div className="flex min-h-screen bg-white font-['Inter'] antialiased">
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 p-6 flex flex-col gap-8 sticky top-0 h-screen shadow-2xl z-20">
        <div className="flex items-center gap-3 text-white px-2">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center font-black text-sm">H</div>
          <h2 className="text-lg font-black uppercase italic tracking-tighter leading-none">Hotel<br/>Admin</h2>
        </div>
        <nav className="flex flex-col gap-1.5">
          <NavBtn active={view === 'panel'} label="Dashboard" icon={<LayoutDashboard />} onClick={() => setView('panel')} />
          <NavBtn active={view === 'reservas'} label="Reservas" icon={<Calendar />} onClick={() => setView('reservas')} />
          <NavBtn active={view === 'habitaciones'} label="Habitaciones" icon={<Bed />} onClick={() => setView('habitaciones')} />
          <NavBtn active={view === 'huespedes'} label="Huéspedes" icon={<Users />} onClick={() => setView('huespedes')} />
        </nav>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-12">
        <header className="flex justify-between items-end mb-12">
          <h1 className="text-6xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">{view}</h1>
          {view !== 'panel' && (
            <button onClick={() => openForm(`${view === 'huespedes' ? 'user' : view === 'habitaciones' ? 'room' : 'booking'}-form`)} className="bg-slate-900 text-white px-8 py-4 rounded-[1.2rem] font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all cursor-pointer shadow-2xl active:scale-95 border-none">
              <Plus size={16} className="inline mr-2"/> Nuevo Registro
            </button>
          )}
        </header>

        {loading ? (
          <div className="text-slate-300 font-black italic animate-pulse p-40 text-center uppercase tracking-[0.4em] text-sm italic">Sincronizando...</div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {view === 'panel' && (
              <div className="space-y-12">
                <div className="grid grid-cols-4 gap-6">
                  <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Reservas</p>
                    <p className="text-5xl font-black text-slate-900 italic tracking-tighter">{reservas.length}</p>
                  </div>
                  <div className="p-8 bg-blue-600 rounded-[2.5rem] shadow-2xl shadow-blue-100 flex flex-col justify-center">
                    <p className="text-[9px] font-black text-blue-100 uppercase tracking-widest mb-1">Ingresos estimados</p>
                    <p className="text-3xl font-black text-white italic tracking-tighter">${reservas.reduce((acc, curr) => acc + Number(curr.montoTotal || 0), 0).toLocaleString()}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-6">
                    {reservasHidratadas.slice(0, 6).map(res => <BookingCard key={res.id} reserva={res} />)}
                </div>
              </div>
            )}
            {view === 'huespedes' && <UserTable usuarios={usuarios} onEdit={u => openForm('user-form', u)} onDelete={u => setModal({type:'delete-user', data:u})} />}
            {view === 'habitaciones' && <RoomTable habitaciones={habitaciones} onEdit={h => openForm('room-form', h)} onDelete={h => setModal({type:'delete-room', data:h})} />}
            {view === 'reservas' && <BookingTable reservas={reservasHidratadas} onDelete={r => setModal({type:'delete-booking', data:r})} />}
          </div>
        )}

        {/* --- MODAL --- */}
        {modal.type?.includes('form') && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xl p-4">
            <div className="bg-white w-full max-w-lg rounded-[2.8rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
              <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-lg">
                    {modal.data ? <Save size={20}/> : <Plus size={20}/>}
                  </div>
                  <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">
                    {modal.data ? "Editar Registro" : "Nuevo Registro"}
                  </h3>
                </div>
                <button onClick={close} className="text-slate-300 hover:text-rose-500 border-none bg-transparent cursor-pointer transition-colors"><X size={28} /></button>
              </div>

              <form onSubmit={handleSave} className="p-10 space-y-4">
                {/* FORM RESERVAS */}
                {modal.type === 'booking-form' && (
                  <>
                    <PremiumInput label="DNI del Huésped" value={form.dni} onChange={v => setForm({...form, dni: v})} icon={IdCard} placeholder="Ingrese DNI para validar" />
                    
                    <div className="transition-all duration-300">
                      {foundUser === false && form.dni?.length > 6 && (
                        <div className="flex items-center justify-between p-3 bg-rose-50 border border-rose-100 rounded-[1rem] animate-in fade-in zoom-in-95">
                          <div className="flex items-center gap-2 ml-2">
                            <AlertCircle className="text-rose-500" size={16} />
                            <span className="font-bold text-rose-600 uppercase text-xs tracking-tight">No registrado</span>
                          </div>
                          <button type="button" onClick={() => openForm('user-form', null, { dni: form.dni })} className="bg-rose-500 text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase hover:bg-rose-600 border-none cursor-pointer">
                            <UserPlus size={12} className="inline mr-1"/> Registrar
                          </button>
                        </div>
                      )}
                      {foundUser && (
                        <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-100 rounded-[1rem] animate-in fade-in zoom-in-95">
                          <div className="w-9 h-9 bg-emerald-500 text-white rounded-lg flex items-center justify-center font-black text-base shadow-sm ring-2 ring-emerald-100/50">
                            {foundUser.nombre.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex flex-col">
                            <p className="text-emerald-600 font-bold text-[10px] uppercase tracking-widest flex items-center gap-1 mb-0.5">
                              <CheckCircle2 size={12}/> Huésped Validado
                            </p>
                            <p className="font-bold text-slate-800 uppercase text-sm leading-none">{foundUser.nombre}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-1.5 relative group w-full">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-5 mb-[-7px] z-10 bg-white w-fit px-2 transition-colors group-focus-within:text-blue-600">Habitación</label>
                      <div className="relative">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors"><Bed size={16} /></div>
                        <select className="w-full pl-14 pr-6 py-4 bg-white border-2 border-slate-100 rounded-[1.2rem] font-bold text-sm text-slate-700 outline-none appearance-none cursor-pointer focus:border-blue-500" value={form.habitacionId} onChange={e => setForm({...form, habitacionId: e.target.value})} required>
                          <option value="">Seleccionar Suite...</option>
                          {habitaciones.filter(h => h.disponible || modal.data).map(h => <option key={h.id} value={h.id}>#{h.numero} - {h.tipo}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <PremiumInput label="Entrada" type="date" value={form.fechaInicio} onChange={v => setForm({...form, fechaInicio: v})} />
                      <PremiumInput label="Salida" type="date" value={form.fechaFin} onChange={v => setForm({...form, fechaFin: v})} />
                    </div>

                    {totalLive > 0 && (
                      <div className="p-5 bg-slate-900 rounded-[1.5rem] relative overflow-hidden mt-1">
                        <div className="absolute top-0 right-0 p-3 opacity-10"><Calculator size={40} className="text-white"/></div>
                        <div className="relative z-10">
                          <p className="text-[8px] font-black text-blue-400 uppercase tracking-[0.3em] mb-1">Costo Total</p>
                          <p className="text-2xl font-black text-white italic tracking-tighter">${totalLive.toLocaleString()}</p>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* FORM HABITACIONES */}
                {modal.type === 'room-form' && (
                  <>
                    <PremiumInput label="Número" value={form.numero} onChange={v => setForm({...form, numero: v})} icon={Hash} />
                    <PremiumInput label="Categoría" value={form.tipo} onChange={v => setForm({...form, tipo: v})} icon={Layers} />
                    <PremiumInput label="Precio" value={form.precio} onChange={v => setForm({...form, precio: v})} icon={Calculator} />
                    
                    <div className="flex items-center justify-between p-5 bg-slate-50 rounded-[1.2rem] border-2 border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className={`w-2.5 h-2.5 rounded-full animate-pulse ${form.disponible ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.15em] italic">Estado: {form.disponible ? 'Disponible' : 'Ocupada'}</span>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => setForm({...form, disponible: !form.disponible})} 
                        className={`w-12 h-7 rounded-full p-1 transition-all border-none cursor-pointer shadow-inner ${form.disponible ? 'bg-emerald-500' : 'bg-slate-300'}`}
                      >
                        <div className={`bg-white w-5 h-5 rounded-full shadow-md transition-transform duration-300 ${form.disponible ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  </>
                )}

                {/* FORM HUÉSPEDES */}
                {modal.type === 'user-form' && (
                  <div className="space-y-4">
                    <PremiumInput label="Nombre" value={form.nombre} onChange={v => setForm({...form, nombre: v})} icon={User} />
                    <PremiumInput label="DNI" value={form.dni} onChange={v => setForm({...form, dni: v})} icon={IdCard} />
                    <PremiumInput label="Email" type="email" value={form.email} onChange={v => setForm({...form, email: v})} icon={Mail} />
                    <PremiumInput label="Teléfono" value={form.telefono} onChange={v => setForm({...form, telefono: v})} icon={Phone} />
                  </div>
                )}

                <div className="flex gap-4 pt-4 border-t border-slate-50">
                  <button type="button" onClick={close} className="flex-1 py-5 text-slate-400 font-black uppercase text-[10px] border-none bg-transparent cursor-pointer hover:text-slate-600 transition-colors">Cancelar</button>
                  <button type="submit" disabled={modal.type === 'booking-form' && !foundUser} className={`flex-[2] py-5 rounded-xl font-black uppercase text-[10px] shadow-xl transition-all border-none cursor-pointer ${(modal.type === 'booking-form' && !foundUser) ? 'bg-slate-100 text-slate-300' : 'bg-slate-900 text-white hover:bg-blue-600 active:scale-95'}`}><Save size={16} className="inline mr-2"/> Confirmar</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* DELETE CONFIRM */}
        {modal.type?.startsWith('delete') && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4 animate-in fade-in">
            <div className="bg-white w-full max-w-xs rounded-[2.5rem] shadow-2xl p-10 text-center animate-in zoom-in border border-white/20">
              <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-inner"><Trash2 size={40} /></div>
              <h3 className="text-2xl font-black text-slate-900 uppercase italic mb-2 tracking-tighter">Eliminar?</h3>
              <p className="text-slate-400 text-[11px] mb-10 italic font-medium">Esta acción no se puede revertir.</p>
              <div className="flex flex-col gap-3">
                <button onClick={handleDelete} className="w-full py-5 bg-rose-500 text-white font-black rounded-xl shadow-lg hover:bg-rose-600 transition-all uppercase text-[10px] border-none cursor-pointer active:scale-95">Confirmar</button>
                <button onClick={close} className="w-full py-4 font-bold text-slate-400 uppercase text-[10px] border-none bg-transparent cursor-pointer hover:text-slate-600 transition-colors">Volver</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}