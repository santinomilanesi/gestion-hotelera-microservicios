import React from 'react';
import { Trash2, Clock, Hash } from 'lucide-react';

export const BookingCard = ({ reserva, onDelete }) => (
  <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 flex items-center justify-between shadow-sm hover:shadow-md transition-all group">
    <div className="flex items-center gap-5">
      <div className="w-14 h-14 bg-slate-900 text-white rounded-[1.2rem] flex items-center justify-center font-black text-xl shadow-lg group-hover:bg-blue-600 transition-colors">
        {reserva.huespedNombre.charAt(0).toUpperCase()}
      </div>
      
      <div>
        <div className="flex items-center gap-2 mb-1">
           <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-[9px] font-mono font-bold">#{String(reserva.id).padStart(4, '0')}</span>
           <h4 className="font-black text-slate-800 text-lg uppercase italic tracking-tighter leading-tight">{reserva.huespedNombre}</h4>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-1 tracking-widest italic">
            <Clock size={12} className="text-blue-500"/> {reserva.noches} Noches
          </p>
          <span className="w-1 h-1 bg-slate-200 rounded-full" />
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Hab. {reserva.nroHabitacion}</p>
        </div>
      </div>
    </div>

    <div className="flex items-center gap-4">
      <select className="bg-slate-50 border border-slate-100 text-[10px] font-black uppercase rounded-xl py-2.5 px-4 outline-none focus:ring-2 focus:ring-blue-500/10 cursor-pointer transition-all">
        <option value="pending">🔴 No Pago</option>
        <option value="partial">🟡 Seña</option>
        <option value="paid">🟢 Pagado</option>
      </select>
      
      <button 
        onClick={() => onDelete(reserva.id)}
        className="p-3 text-rose-400 hover:bg-rose-50 hover:text-rose-600 rounded-2xl transition-all active:scale-90"
      >
        <Trash2 size={20} />
      </button>
    </div>
  </div>
);