import React, { useState, useEffect } from 'react';
import { 
  Bed, User, Calendar, CheckCircle, AlertCircle, 
  RefreshCw, LogOut, Plus, Users, Home, X, Mail, DollarSign, Hash
} from 'lucide-react';
import api from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

export default function AdminPanel() {
  const [habitaciones, setHabitaciones] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  const [view, setView] = useState('reservas'); 
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  
  const [nuevaHab, setNuevaHab] = useState({ numero: '', tipo: 'Simple', precio: '', disponible: true });
  const [nuevoUsu, setNuevoUsu] = useState({ nombre: '', dni: '', email: '', rol: 'CLIENTE' });
  const [reserva, setReserva] = useState({ usuarioId: '', habitacionId: '', fecha: new Date().toISOString().split('T')[0] });

  const dniValido = nuevoUsu.dni.length >= 7;

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [resHab, resUsu] = await Promise.all([
        api.get('/habitacion-service/habitaciones'),
        api.get('/usuario-service/usuarios')
      ]);
      setHabitaciones(resHab.data);
      setUsuarios(resUsu.data);
    } catch (error) {
      setMensaje({ texto: "Error de conexión con el servidor", tipo: "error" });
      if (error.response?.status === 401) navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarDatos(); }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const crearHabitacion = async (e) => {
    e.preventDefault();
    try {
      await api.post('/habitacion-service/habitaciones', { ...nuevaHab, precio: parseFloat(nuevaHab.precio) });
      setMensaje({ texto: `Habitación ${nuevaHab.numero} creada`, tipo: "success" });
      setShowModal(false);
      setNuevaHab({ numero: '', tipo: 'Simple', precio: '', disponible: true });
      cargarDatos();
    } catch (err) { setMensaje({ texto: "Error al crear habitación", tipo: "error" }); }
  };

  const crearUsuario = async (e) => {
    e.preventDefault();
    if (!dniValido) return;
    try {
      await api.post('/usuario-service/usuarios', { ...nuevoUsu, password: 'NOPASSWORD_INTERNAL' });
      setMensaje({ texto: `Huésped ${nuevoUsu.nombre} registrado`, tipo: "success" });
      setShowModal(false);
      setNuevoUsu({ nombre: '', dni: '', email: '', rol: 'CLIENTE' }); 
      cargarDatos();
    } catch (err) { 
      const msg = err.response?.data?.mensaje || "Error al registrar huésped";
      setMensaje({ texto: msg, tipo: "error" }); 
    }
  };

  // --- LÓGICA DE RESERVA CORREGIDA ---
  const handleReservar = async (e) => {
    e.preventDefault();

    // Validación: Si no se seleccionó huésped o habitación
    if (!reserva.usuarioId || !reserva.habitacionId) {
      setMensaje({ 
        texto: "Debe seleccionar un Huésped y una Habitación para crear la reserva.", 
        tipo: "error" 
      });
      return; 
    }

    setLoading(true);
    try {
      await api.post('/reserva-service/reservas', {
        usuarioId: parseInt(reserva.usuarioId),
        habitacionId: parseInt(reserva.habitacionId),
        fecha: reserva.fecha
      });
      setMensaje({ texto: "¡Reserva realizada con éxito!", tipo: "success" });
      
      // Reinicio de los campos a "Seleccionar..."
      setReserva({ usuarioId: '', habitacionId: '', fecha: new Date().toISOString().split('T')[0] });
      
      cargarDatos();
    } catch (error) {
      setMensaje({ texto: error.response?.data?.mensaje || "Error en la reserva", tipo: "error" });
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      
      {/* SIDEBAR */}
      <aside className="w-72 bg-slate-900 text-white p-8 flex flex-col hidden lg:flex shadow-2xl">
        <div className="mb-12 text-center lg:text-left">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-600 p-2 rounded-lg"><Bed size={24}/></div>
            <h1 className="text-2xl font-black tracking-tighter">HOTEL PRO</h1>
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em]">Admin Dashboard</p>
        </div>
        
        <nav className="space-y-3 flex-1">
          {[
            { id: 'reservas', icon: <Calendar size={20}/>, label: 'Panel Reservas' },
            { id: 'habitaciones', icon: <Home size={20}/>, label: 'Habitaciones' },
            { id: 'usuarios', icon: <Users size={20}/>, label: 'Huéspedes' }
          ].map(item => (
            <button 
              key={item.id}
              onClick={() => setView(item.id)} 
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all font-bold cursor-pointer ${view === item.id ? 'bg-blue-600 shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>

        <button onClick={handleLogout} className="flex items-center gap-4 p-4 text-red-400 hover:bg-red-500/10 rounded-2xl transition-all font-bold cursor-pointer">
          <LogOut size={20} /> Cerrar Sesión
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-10 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-4xl font-black capitalize tracking-tight">{view}</h2>
            <p className="text-slate-500 font-medium">Gestión administrativa del sistema.</p>
          </div>
          <div className="flex gap-4">
            <button onClick={cargarDatos} className="p-4 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all shadow-sm active:scale-95 cursor-pointer">
              <RefreshCw className={loading ? 'animate-spin' : ''} size={22} />
            </button>
            <button 
              onClick={() => setShowModal(true)} 
              className="flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black hover:bg-slate-800 shadow-xl transition-all active:scale-95 cursor-pointer"
            >
              <Plus size={20} /> {view === 'habitaciones' ? 'Nueva Habitación' : 'Nuevo Huésped'}
            </button>
          </div>
        </header>

        {/* --- COMPONENTE DE MENSAJE CON BOTÓN DE CIERRE --- */}
        {mensaje.texto && (
          <div className={`mb-8 p-5 rounded-2xl border-2 flex items-center justify-between animate-in slide-in-from-top-2 ${mensaje.tipo === 'success' ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'}`}>
            <div className="flex items-center gap-4 font-bold">
              {mensaje.tipo === 'success' ? <CheckCircle/> : <AlertCircle/>}
              {mensaje.texto}
            </div>
            {/* Botón para quitar el mensaje */}
            <button 
              className="cursor-pointer p-1 hover:bg-black/5 rounded-full transition-colors" 
              onClick={() => setMensaje({texto: '', tipo: ''})}
            >
              <X size={20}/>
            </button>
          </div>
        )}

        {/* --- VISTA DINÁMICA --- */}
        {view === 'reservas' ? (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
            <div className="xl:col-span-4 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm h-fit sticky top-10">
              <h3 className="font-black text-xl mb-8 flex items-center gap-2"><Plus className="text-blue-600"/> Nueva Reserva</h3>
              <form onSubmit={handleReservar} className="space-y-5">
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase ml-1 block mb-2">Huésped</label>
                  <select className="w-full p-4 rounded-2xl bg-slate-50 border-none ring-1 ring-slate-200 outline-none focus:ring-2 focus:ring-blue-500 font-medium cursor-pointer" value={reserva.usuarioId} onChange={e => setReserva({...reserva, usuarioId: e.target.value})}>
                    <option value="">Seleccionar...</option>
                    {usuarios.map(u => <option key={u.id} value={u.id}>{u.nombre} (DNI: {u.dni})</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase ml-1 block mb-2">Habitación</label>
                  <select className="w-full p-4 rounded-2xl bg-slate-50 border-none ring-1 ring-slate-200 outline-none focus:ring-2 focus:ring-blue-500 font-medium cursor-pointer" value={reserva.habitacionId} onChange={e => setReserva({...reserva, habitacionId: e.target.value})}>
                    <option value="">Seleccionar...</option>
                    {habitaciones.filter(h => h.disponible).map(h => <option key={h.id} value={h.id}>N° {h.numero} - {h.tipo}</option>)}
                  </select>
                </div>
                <button type="submit" className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 shadow-lg shadow-blue-600/30 transition-all cursor-pointer active:scale-95">
                  Crear Reserva
                </button>
              </form>
            </div>
            
            <div className="xl:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                {habitaciones.map(h => (
                  <div key={h.id} className={`p-8 rounded-[2rem] border-2 transition-all ${h.disponible ? 'bg-white border-slate-100 shadow-sm' : 'bg-slate-100 border-transparent opacity-60'}`}>
                     <div className="flex justify-between items-start mb-6">
                       <div className={`p-3 rounded-2xl ${h.disponible ? 'bg-blue-50 text-blue-600' : 'bg-slate-200 text-slate-500'}`}><Home size={24}/></div>
                       <span className={`text-xs font-black px-4 py-2 rounded-full ${h.disponible ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                         {h.disponible ? 'LIBRE' : 'OCUPADA'}
                       </span>
                     </div>
                     <p className="text-slate-400 font-bold text-sm mb-1 uppercase tracking-widest">NRO {h.numero}</p>
                     <h4 className="text-2xl font-black text-slate-800 mb-4">{h.tipo}</h4>
                     <div className="text-2xl font-black text-blue-600">${h.precio}<span className="text-sm text-slate-400 font-bold"> / noche</span></div>
                  </div>
                ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-500">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  {view === 'usuarios' ? (
                    <>
                      <th className="p-6 font-black text-slate-400 text-xs uppercase tracking-widest border-b">Huésped</th>
                      <th className="p-6 font-black text-slate-400 text-xs uppercase tracking-widest border-b">Documento</th>
                      <th className="p-6 font-black text-slate-400 text-xs uppercase tracking-widest border-b">Contacto (Email)</th>
                    </>
                  ) : (
                    <>
                      <th className="p-6 font-black text-slate-400 text-xs uppercase tracking-widest border-b">Habitación</th>
                      <th className="p-6 font-black text-slate-400 text-xs uppercase tracking-widest border-b">Categoría</th>
                      <th className="p-6 font-black text-slate-400 text-xs uppercase tracking-widest border-b">Precio x Noche</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(view === 'usuarios' ? usuarios : habitaciones).map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                          {view === 'usuarios' ? <User size={18}/> : <Home size={18}/>}
                        </div>
                        <span className="font-black text-slate-800">{item.nombre || `Nro ${item.numero}`}</span>
                      </div>
                    </td>
                    <td className="p-6 font-bold text-slate-600">{item.dni || item.tipo}</td>
                    <td className="p-6 font-black text-slate-800">
                      {view === 'usuarios' ? item.email : `$${item.precio}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* --- MODAL DE CREACIÓN --- */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-6 z-[100]">
          <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-xl shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-3xl font-black tracking-tight">{view === 'habitaciones' ? 'Nueva Habitación' : 'Nuevo Huésped'}</h3>
                <p className="text-slate-400 font-medium text-sm">Completá los datos del registro administrativo.</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-3 hover:bg-slate-100 rounded-2xl transition-colors cursor-pointer"><X/></button>
            </div>
            
            <form onSubmit={view === 'habitaciones' ? crearHabitacion : crearUsuario} className="grid grid-cols-2 gap-4">
              {view === 'habitaciones' ? (
                <>
                  <div className="col-span-1">
                    <label className="text-xs font-black text-slate-400 uppercase ml-1 block mb-2">Número</label>
                    <input placeholder="101" className="w-full p-4 rounded-2xl bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 font-bold" value={nuevaHab.numero} onChange={e => setNuevaHab({...nuevaHab, numero: e.target.value})} required/>
                  </div>
                  <div className="col-span-1">
                    <label className="text-xs font-black text-slate-400 uppercase ml-1 block mb-2">Tipo</label>
                    <select className="w-full p-4 rounded-2xl bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 font-bold cursor-pointer" value={nuevaHab.tipo} onChange={e => setNuevaHab({...nuevaHab, tipo: e.target.value})}>
                      <option value="Simple">Simple</option>
                      <option value="Doble">Doble</option>
                      <option value="Suite">Suite</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs font-black text-slate-400 uppercase ml-1 block mb-2">Precio por Noche</label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
                      <input type="number" placeholder="0.00" className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 font-bold" value={nuevaHab.precio} onChange={e => setNuevaHab({...nuevaHab, precio: e.target.value})} required/>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="col-span-2">
                    <label className="text-xs font-black text-slate-400 uppercase ml-1 block mb-2">Nombre Completo del Huésped</label>
                    <input className="w-full p-4 rounded-2xl bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 font-bold" value={nuevoUsu.nombre} onChange={e => setNuevoUsu({...nuevoUsu, nombre: e.target.value})} required/>
                  </div>
                  <div className="col-span-1">
                    <label className="text-xs font-black text-slate-400 uppercase ml-1 block mb-2">DNI</label>
                    <input className={`w-full p-4 rounded-2xl bg-slate-50 border-none ring-1 focus:ring-2 font-bold ${!dniValido && nuevoUsu.dni.length > 0 ? 'ring-red-500 focus:ring-red-500' : 'ring-slate-200 focus:ring-blue-500'}`} value={nuevoUsu.dni} onChange={e => setNuevoUsu({...nuevoUsu, dni: e.target.value})} required/>
                    {!dniValido && nuevoUsu.dni.length > 0 && (
                      <p className="text-[10px] text-red-500 font-bold mt-1 ml-1 uppercase">Mínimo 7 caracteres</p>
                    )}
                  </div>
                  <div className="col-span-1">
                    <label className="text-xs font-black text-slate-400 uppercase ml-1 block mb-2">Email</label>
                    <input type="email" className="w-full p-4 rounded-2xl bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 font-bold" value={nuevoUsu.email} onChange={e => setNuevoUsu({...nuevoUsu, email: e.target.value})} required/>
                  </div>
                </>
              )}
              <button 
                disabled={view === 'usuarios' && !dniValido}
                className="col-span-2 py-5 bg-slate-900 text-white rounded-[1.5rem] font-black hover:bg-slate-800 shadow-2xl transition-all mt-6 text-lg disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none cursor-pointer active:scale-95"
              >
                Guardar Registro
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}