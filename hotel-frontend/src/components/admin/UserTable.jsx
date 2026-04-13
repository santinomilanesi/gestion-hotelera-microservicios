import React from 'react';
// Importamos FileDigit o UserCheck que suelen ser más estables en renderizado
import { Trash2, Edit3, Mail, Phone, FileDigit } from 'lucide-react'; 

export const UserTable = ({ usuarios, onEdit, onDelete }) => (
  <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
    <table className="w-full text-left border-separate border-spacing-0">
      <thead>
        <tr className="bg-slate-50/30">
          <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50">Información Personal</th>
          <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 text-center">Documento (DNI)</th>
          <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50">Canales de Contacto</th>
          <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 text-center">Acciones</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-50">
        {usuarios && usuarios.map((u) => (
          <tr key={u.id} className="group hover:bg-slate-50/50 transition-all">

            <td className="p-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-lg shadow-lg">
                  {u.nombre ? u.nombre.charAt(0).toUpperCase() : '?'}
                </div>
                <span className="font-black text-slate-700 uppercase italic tracking-tight">{u.nombre}</span>
              </div>
            </td>
            
            <td className="p-8 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl font-bold">

                <FileDigit size={16} color="white" strokeWidth={2.5} />
                <span className="tabular-nums">{u.dni}</span>
              </div>
            </td>

            <td className="p-8">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-blue-500 font-bold text-xs uppercase italic">
                  <Mail size={12} /> {u.email}
                </div>
                <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs">
                  <Phone size={12} /> {u.telefono}
                </div>
              </div>
            </td>

            <td className="p-8 text-center">
              <div className="flex justify-center gap-2">
                <button 
                  onClick={() => onEdit && onEdit(u)}
                  className="w-10 h-10 flex items-center justify-center bg-slate-900 text-white rounded-xl hover:bg-blue-600 transition-all shadow-md"
                >
                  <Edit3 size={16} />
                </button>
                <button 
                  onClick={() => onDelete && onDelete(u.id)}
                  className="w-10 h-10 flex items-center justify-center bg-white text-rose-500 border border-rose-100 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);