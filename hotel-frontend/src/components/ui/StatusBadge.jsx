export const StatusBadge = ({ disponible }) => (
  <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase border ${
    disponible ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
  }`}>
    {disponible ? '• Disponible' : '• Ocupada'}
  </span>
);