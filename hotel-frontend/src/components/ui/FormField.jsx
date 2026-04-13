export const FormField = ({ label, children }) => (
  <div className="flex flex-col gap-1.5 mb-5 w-full">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">
      {label}
    </label>
    {children}
  </div>
);