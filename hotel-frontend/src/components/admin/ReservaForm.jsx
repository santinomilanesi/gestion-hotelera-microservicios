import React, { useState, useEffect } from 'react';
import { UserPlus, CheckCircle2, Search, XCircle, Save, IdCard, Loader2 } from 'lucide-react';

export const ReservaForm = ({ usuarios = [], onConfirm, onCancel, onRegisterRedirect }) => {
    const [dni, setDni] = useState('');
    const [user, setUser] = useState(null);
    const [buscando, setBuscando] = useState(false);

    useEffect(() => {
        if (dni.length >= 7) {
            setBuscando(true);
            const timer = setTimeout(() => {
                const foundUser = usuarios.find(u => String(u.dni).trim() === String(dni).trim());
                if (foundUser) {
                    setUser({ ...foundUser, inicial: foundUser.nombre.charAt(0).toUpperCase() });
                } else {
                    setUser('not_found');
                }
                setBuscando(false);
            }, 500);
            return () => clearTimeout(timer);
        } else {
            setUser(null);
            setBuscando(false);
        }
    }, [dni, usuarios]);

    return (
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100 max-w-md w-full mx-auto animate-in fade-in zoom-in duration-300">
            <h3 className="text-2xl font-black text-slate-900 italic uppercase tracking-tighter mb-8 flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-100">
                    <IdCard size={20} />
                </div>
                Nueva Reserva
            </h3>
            
            <div className="space-y-6">
                <div className="flex flex-col gap-2 group">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-[-8px] z-10 bg-white w-fit px-2 group-focus-within:text-blue-600 transition-colors">
                        Identificación (DNI)
                    </label>
                    <div className="relative">
                        <input 
                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 font-bold text-slate-700 focus:bg-white focus:border-blue-500 outline-none transition-all" 
                            value={dni} 
                            onChange={e => setDni(e.target.value.replace(/\D/g, ''))} 
                            placeholder="Buscar cliente..." 
                        />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2">
                            {buscando ? <Loader2 size={18} className="text-blue-500 animate-spin" /> : <Search size={18} className="text-slate-300" />}
                        </div>
                    </div>
                </div>

                {/* AREA DE RESULTADO DINAMICO */}
                <div className="min-h-[100px] flex items-center justify-center">
                    {user === 'not_found' && (
                        <div className="w-full flex items-center justify-between p-4 bg-rose-50 border border-rose-100 rounded-2xl animate-in slide-in-from-top-2">
                            <div className="flex items-center gap-3">
                                <XCircle className="text-rose-500" size={20} />
                                <span className="font-black text-rose-600 uppercase text-[10px] tracking-tight">DNI no encontrado</span>
                            </div>
                            <button 
                                onClick={() => onRegisterRedirect(dni)} 
                                className="bg-rose-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 hover:bg-rose-600 shadow-xl shadow-rose-200 transition-all border-none cursor-pointer active:scale-95"
                            >
                                <UserPlus size={14} /> Registrar
                            </button>
                        </div>
                    )}

                    {user && user !== 'not_found' && (
                        <div className="w-full flex items-center gap-4 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl animate-in slide-in-from-top-2">
                            <div className="w-12 h-12 bg-emerald-500 text-white rounded-xl flex items-center justify-center font-black text-xl shadow-lg ring-4 ring-emerald-100/50">
                                {user.inicial}
                            </div>
                            <div>
                                <p className="text-emerald-600 font-black text-[9px] uppercase tracking-widest flex items-center gap-1">
                                    <CheckCircle2 size={12}/> Huésped Encontrado
                                </p>
                                <p className="font-black text-slate-800 italic uppercase text-lg leading-tight mt-1">
                                    {user.nombre}
                                </p>
                            </div>
                        </div>
                    )}

                    {!user && !buscando && (
                        <p className="text-slate-300 text-[10px] font-bold uppercase tracking-[0.2em] italic">Ingrese DNI para validar</p>
                    )}
                </div>
                
                <div className="flex gap-4 pt-4 border-t border-slate-50">
                    <button onClick={onCancel} className="flex-1 py-4 text-slate-400 font-black uppercase text-[11px] border-none bg-transparent cursor-pointer">Cancelar</button>
                    <button 
                        disabled={!user || user === 'not_found'}
                        onClick={() => onConfirm(user)}
                        className={`flex-[2] py-4 rounded-2xl font-black uppercase text-[11px] flex items-center justify-center gap-2 transition-all shadow-xl ${user && user !== 'not_found' ? 'bg-slate-900 text-white hover:bg-blue-600 active:scale-95' : 'bg-slate-100 text-slate-300 cursor-not-allowed'}`}
                    >
                        <Save size={16}/> Confirmar Huésped
                    </button>
                </div>
            </div>
        </div>
    );
};