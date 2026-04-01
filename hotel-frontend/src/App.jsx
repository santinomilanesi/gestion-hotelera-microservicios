import React, { useState, useEffect } from 'react';
import { Bed, User, Calendar, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8080';

export default function App() {
  const [habitaciones, setHabitaciones] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  
  const [reserva, setReserva] = useState({
    usuarioId: '',
    habitacionId: '',
    fecha: new Date().toISOString().split('T')[0]
  });

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const resHab = await fetch(`${API_BASE_URL}/habitacion-service/habitaciones`);
      const resUsu = await fetch(`${API_BASE_URL}/usuario-service/usuarios`);
      
      if (resHab.ok) setHabitaciones(await resHab.json());
      if (resUsu.ok) setUsuarios(await resUsu.json());
    } catch (error) {
      setMensaje({ texto: "Error al conectar con el Gateway", tipo: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleReservar = async (e) => {
    e.preventDefault();
    if (!reserva.usuarioId || !reserva.habitacionId) {
      setMensaje({ texto: "Seleccioná usuario y habitación", tipo: "error" });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/reserva-service/reservas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuarioId: parseInt(reserva.usuarioId),
          habitacionId: parseInt(reserva.habitacionId),
          fecha: reserva.fecha
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje({ texto: "¡Reserva confirmada!", tipo: "success" });
        cargarDatos();
      } else {
        setMensaje({ texto: data.mensaje || "Error en la reserva", tipo: "error" });
      }
    } catch (error) {
      setMensaje({ texto: "Error de conexión", tipo: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <header className="max-w-5xl mx-auto mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">Hotel Pro</h1>
          <p className="text-slate-500 font-medium">Panel de Gestión de Microservicios</p>
        </div>
        <button onClick={cargarDatos} className="p-2 bg-white shadow-sm border rounded-lg hover:bg-slate-50 transition-all">
          <RefreshCw className={loading ? 'animate-spin' : ''} size={20} />
        </button>
      </header>

      {mensaje.texto && (
        <div className={`max-w-5xl mx-auto mb-6 p-4 rounded-xl flex items-center gap-3 border animate-in fade-in slide-in-from-top-4 ${
          mensaje.tipo === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          {mensaje.tipo === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span className="font-semibold">{mensaje.texto}</span>
        </div>
      )}

      <main className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* LADO IZQUIERDO: FORMULARIO */}
        <div className="md:col-span-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-fit sticky top-6">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-700">
            <Calendar size={20} className="text-blue-600"/> Nueva Reserva
          </h2>
          <form onSubmit={handleReservar} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">Huésped</label>
              <select 
                className="w-full p-3 mt-1 rounded-xl bg-slate-50 border-slate-200 border outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={reserva.usuarioId}
                onChange={(e) => setReserva({...reserva, usuarioId: e.target.value})}
              >
                <option value="">Seleccionar Usuario</option>
                {usuarios.map(u => <option key={u.id} value={u.id}>{u.nombre}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">Habitación Disponible</label>
              <select 
                className="w-full p-3 mt-1 rounded-xl bg-slate-50 border-slate-200 border outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={reserva.habitacionId}
                onChange={(e) => setReserva({...reserva, habitacionId: e.target.value})}
              >
                <option value="">Seleccionar Habitación</option>
                {habitaciones.filter(h => h.disponible).map(h => (
                  <option key={h.id} value={h.id}>Hab. {h.numero} ({h.tipo})</option>
                ))}
              </select>
            </div>

            <button 
              disabled={loading}
              className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 disabled:bg-slate-300 transition-all mt-4"
            >
              {loading ? 'Procesando...' : 'Confirmar Reserva'}
            </button>
          </form>
        </div>

        {/* LADO DERECHO: GRILLA */}
        <div className="md:col-span-8">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-700">
            <Bed size={20} className="text-blue-600"/> Estado del Hotel
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {habitaciones.map(h => (
              <div key={h.id} className={`p-6 rounded-2xl border-2 transition-all duration-500 ${
                h.disponible ? 'bg-white border-slate-100 shadow-sm' : 'bg-slate-100 border-transparent opacity-60'
              }`}>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Nro {h.numero}</span>
                  <div className={`w-3 h-3 rounded-full animate-pulse ${h.disponible ? 'bg-green-500' : 'bg-red-500'}`}></div>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-1">{h.tipo}</h3>
                <p className="text-slate-500 text-sm font-medium">
                  {h.disponible ? '✓ Disponible' : '✕ Ocupada actualmente'}
                </p>
              </div>
            ))}
          </div>
          {habitaciones.length === 0 && !loading && (
            <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200 text-slate-400">
              No hay habitaciones conectadas al sistema.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}