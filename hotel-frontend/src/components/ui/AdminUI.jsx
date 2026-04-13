import React from 'react';

// FormField: Mantiene la estructura pero asegura que el ancho sea consistente
export const FormField = ({ label, children }) => (
  <div className="flex flex-col gap-1.5 mb-5 w-full group">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic group-focus-within:text-blue-500 transition-colors">
      {label}
    </label>
    {children}
  </div>
);

// Input: Añadido soporte para estados disabled y hover pro
export const Input = ({ label, type = "text", icon: Icon, ...props }) => (
  <FormField label={label}>
    <div className="relative">
      {Icon && (
        <Icon 
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-400 transition-colors" 
          size={18} 
        />
      )}
      <input 
        type={type} 
        {...props} 
        className={`
          w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none 
          focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 
          font-bold transition-all placeholder:text-slate-300 text-slate-800 shadow-inner
          disabled:opacity-50 disabled:cursor-not-allowed
          ${Icon ? 'pl-12' : 'px-5'}
        `} 
      />
    </div>
  </FormField>
);

// StatusBadge: Lógica booleana simplificada y estilo refinado
export const StatusBadge = ({ disponible }) => {
  // Manejamos tanto booleano puro como strings de la DB
  const isAvailable = disponible === true || String(disponible) === 'true';
  
  return (
    <span className={`
      inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase border transition-all shadow-sm
      ${isAvailable 
        ? 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-100/50' 
        : 'bg-rose-50 text-rose-600 border-rose-100 shadow-rose-100/50'
      }
    `}>
      <span className={`w-1.5 h-1.5 rounded-full ${isAvailable ? 'bg-emerald-500' : 'bg-rose-500'}`} />
      {isAvailable ? 'Disponible' : 'Ocupada'}
    </span>
  );
};