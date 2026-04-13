import React from 'react';
import { 
  Trash2, Edit3, Mail, Phone, IdCard, User, 
  ArrowRight, Bed, CalendarDays 
} from 'lucide-react'; 
import { StatusBadge } from '../ui/AdminUI';

// --- COMPONENTE INTERNO: ACCIONES DE TABLA ---
const TableActions = ({ item, onEdit, onDelete, hideEdit = false }) => (
  <div className="flex justify-center gap-4">
    {!hideEdit && (
      <button 
        onClick={() => onEdit(item)} 
        className="p-3 text-sky-500 hover:text-sky-700 hover:bg-sky-100 rounded-2xl transition-all cursor-pointer active:scale-90 border-none bg-transparent"
      >
        <Edit3 size={20} />
      </button>
    )}
    <button 
      onClick={() => onDelete(item)} 
      className="p-3 text-rose-500 hover:text-rose-700 hover:bg-rose-100 rounded-2xl transition-all cursor-pointer active:scale-90 border-none bg-transparent"
    >
      <Trash2 size={20} />
    </button>
  </div>
);

// --- TABLA DE HUÉSPEDES ---
export const UserTable = ({ usuarios, onEdit, onDelete }) => (
  <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="bg-slate-50/80">
          <th className="p-8 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] border-b">Huésped</th>
          <th className="p-8 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] border-b text-center">Documento DNI</th>
          <th className="p-8 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] border-b">Contacto</th>
          <th className="p-8 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] border-b text-center">Acciones</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-50">
        {usuarios.map((u) => (
          <tr key={u.id} className="group hover:bg-slate-50/40 transition-all">
            <td className="p-8">
              <div className="flex items-center gap-4">
                <User size={18} className="text-blue-500"/>
                <span className="font-bold text-slate-800 text-lg">{u.nombre}</span>
              </div>
            </td>
            <td className="p-8 text-center">
              <span className="inline-flex items-center gap-3 text-base font-bold text-slate-700 bg-slate-100 px-4 py-2 rounded-xl border border-slate-200">
                <IdCard size={18} className="text-slate-600"/> {u.dni}
              </span>
            </td>
            <td className="p-8">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-slate-600 flex items-center gap-2">
                  <Mail size={16} className="text-slate-400"/> {u.email}
                </span>
                <span className="text-sm font-semibold text-slate-600 flex items-center gap-2">
                  <Phone size={16} className="text-slate-400"/> {u.telefono}
                </span>
              </div>
            </td>
            <td className="p-8 text-center"><TableActions item={u} onEdit={onEdit} onDelete={onDelete} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// --- TABLA DE HABITACIONES ---
export const RoomTable = ({ habitaciones, onEdit, onDelete }) => (
  <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="bg-slate-50/80">
          <th className="p-8 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] border-b text-center">Nro</th>
          <th className="p-8 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] border-b text-center">Tipo</th>
          <th className="p-8 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] border-b text-center">Tarifa</th>
          <th className="p-8 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] border-b text-center">Estado</th>
          <th className="p-8 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] border-b text-center">Acciones</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-50">
        {habitaciones.map((h) => (
          <tr key={h.id} className="group hover:bg-slate-50/40 transition-all">
            <td className="p-8 text-center font-black text-slate-900 italic text-2xl">#{h.numero}</td>
            <td className="p-8 text-center text-slate-600 font-bold italic">{h.tipo}</td>
            <td className="p-8 text-center font-black text-slate-800">${h.precio}</td>
            <td className="p-8 text-center"><StatusBadge disponible={h.disponible} /></td>
            <td className="p-8 text-center"><TableActions item={h} onEdit={onEdit} onDelete={onDelete} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// --- TABLA DE RESERVAS (ESTILO MEJORADO) ---
export const BookingTable = ({ reservas, onDelete }) => (
  <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="bg-slate-50/80">
          <th className="p-8 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] border-b text-center">ID</th>
          <th className="p-8 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] border-b">Huésped | DNI</th>
          <th className="p-8 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] border-b text-center">Estancia</th>
          <th className="p-8 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] border-b text-center">Hab</th>
          <th className="p-8 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] border-b text-center">Total</th>
          <th className="p-8 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] border-b text-center">Estado</th>
          <th className="p-8 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] border-b text-center">Acciones</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-50">
        {reservas.map((r) => {
          const isPaid = r.estado?.toUpperCase() === 'CONFIRMADA';
          return (
            <tr key={r.id} className="group hover:bg-slate-50/40 transition-all">
              <td className="p-8 text-center font-black text-slate-500 italic text-xl">#{r.id}</td>
              <td className="p-8">
                <div className="flex flex-col">
                  <span className="font-black text-slate-800 text-lg tracking-tight">{r.usuarioNombre}</span>
                  <span className="text-sm font-bold text-slate-500 flex items-center gap-2 mt-1 bg-slate-50 w-fit px-2 py-0.5 rounded-lg border border-slate-100">
                    <IdCard size={15} className="text-blue-500"/> {r.usuarioDni}
                  </span>
                </div>
              </td>
              <td className="p-8 text-center">
                <div className="inline-flex items-center gap-2 font-mono font-bold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 shadow-sm">
                  {r.fechaInicio} <ArrowRight size={12} className="text-blue-400"/> {r.fechaFin}
                </div>
              </td>
              <td className="p-8 text-center">
                <div className="flex flex-col items-center bg-blue-50/50 py-2 rounded-2xl border border-blue-100/50">
                  <span className="font-black italic text-blue-700 text-2xl">#{r.habitacionNumero}</span>
                  <span className="text-[10px] font-black text-blue-400 uppercase tracking-tighter">ID-HAB: {r.habitacionId}</span>
                </div>
              </td>
              <td className="p-8 text-center font-black text-slate-800 text-xl">${Number(r.montoTotal).toLocaleString()}</td>
              <td className="p-8 text-center">
                <span className={`px-5 py-2.5 rounded-2xl border font-black text-[10px] uppercase tracking-widest ${isPaid ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-amber-100 text-amber-700 border-amber-200'}`}>
                  {r.estado}
                </span>
              </td>
              <td className="p-8 text-center">
                <button onClick={() => onDelete(r)} className="p-3 text-rose-500 hover:text-rose-700 transition-colors border-none bg-transparent cursor-pointer hover:bg-rose-50 rounded-xl"><Trash2 size={22} /></button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

// --- COMPONENTE: BOOKING CARD (PARA DASHBOARD) ---
export const BookingCard = ({ reserva }) => {
  const isPaid = reserva.estado?.toUpperCase() === 'CONFIRMADA';
  return (
    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <CalendarDays size={80} className="text-slate-900" />
      </div>
      
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black italic text-xl shadow-lg shadow-blue-200">
            #{reserva.habitacionNumero}
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reserva #{reserva.id}</p>
            <h4 className="font-black text-slate-800 text-lg leading-tight">{reserva.usuarioNombre}</h4>
          </div>
        </div>
      </div>

      <div className="space-y-4 relative z-10">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400 font-bold flex items-center gap-2"><IdCard size={16} className="text-blue-500"/> DNI</span>
          <span className="text-slate-700 font-mono font-black bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">{reserva.usuarioDni}</span>
        </div>
        
        <div className="p-4 bg-slate-50 rounded-[1.5rem] border border-slate-100 flex items-center justify-between shadow-inner">
          <div className="text-center">
            <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Entrada</p>
            <p className="text-xs font-mono font-black text-slate-800">{reserva.fechaInicio}</p>
          </div>
          <div className="h-8 w-[1px] bg-slate-200"></div>
          <div className="text-center">
            <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Salida</p>
            <p className="text-xs font-mono font-black text-slate-800">{reserva.fechaFin}</p>
          </div>
        </div>

        <div className="flex justify-between items-center pt-2">
          <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${isPaid ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
            {reserva.estado}
          </span>
          <span className="text-2xl font-black text-slate-900 tracking-tighter">${Number(reserva.montoTotal).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};