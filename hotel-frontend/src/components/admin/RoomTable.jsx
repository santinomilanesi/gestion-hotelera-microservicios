import React from 'react';
import { Trash2, Edit3, Tag, BedDouble } from 'lucide-react';
import { StatusBadge } from '../ui/AdminUI'; // Asegúrate de que la ruta sea correcta

export const RoomTable = ({ habitaciones, onEdit, onDelete }) => (
  <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="bg-slate-50/50">
          <th className="p-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] border-b">Nro. Habitación</th>
          <th className="p-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] border-b">Categoría / Tipo</th>
          <th className="p-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] border-b text-center">Estado</th>
          <th className="p-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] border-b text-center">Tarifa Diaria</th>
          <th className="p-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] border-b text-center">Acciones</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-50">
        {habitaciones.map((h) => (
          <tr key={h.id} className="group hover:bg-slate-50/30 transition-all">
            <td className="p-8">
              {/* Número de habitación con mayor peso visual */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black italic text-lg shadow-lg group-hover:bg-blue-600 transition-colors">
                  {h.numero}
                </div>
                <span className="text-slate-400 font-bold text-xs uppercase tracking-tighter">Planta {String(h.numero)[0]}</span>
              </div>
            </td>

            <td className="p-8">
              {/* Tipo de habitación con icono más grande */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3 text-slate-800 font-bold text-lg tracking-tight">
                  <BedDouble size={18} className="text-slate-400" />
                  {h.tipo}
                </div>
                <span className="inline-flex items-center gap-2 text-[10px] font-black text-blue-500 uppercase tracking-widest ml-7">
                  <Tag size={10} /> Standard Rate
                </span>
              </div>
            </td>

            <td className="p-8 text-center">
              {/* Integración del StatusBadge para coherencia visual */}
              <StatusBadge disponible={h.disponible} />
            </td>

            <td className="p-8 text-center">
              {/* Precio con estilo monetario Pro */}
              <div className="flex flex-col">
                <span className="text-2xl font-black text-slate-900 tracking-tighter">
                  <span className="text-sm text-emerald-500 mr-1">$</span>
                  {Number(h.precio).toLocaleString()}
                </span>
                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Por noche</span>
              </div>
            </td>

            <td className="p-8 text-center">
              <div className="flex justify-center gap-4">
                <button 
                  onClick={() => onEdit && onEdit(h)}
                  className="p-4 text-sky-400 hover:text-sky-600 hover:bg-sky-50 rounded-2xl transition-all cursor-pointer active:scale-90"
                  title="Editar habitación"
                >
                  <Edit3 size={20} />
                </button>
                <button 
                  onClick={() => onDelete && onDelete(h)} // Pasamos el objeto 'h' completo para el modal de borrado
                  className="p-4 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all cursor-pointer active:scale-90"
                  title="Eliminar habitación"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);