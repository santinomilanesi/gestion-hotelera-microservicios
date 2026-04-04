import React, { useState } from 'react';
import api from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { User, Lock, LogIn, XCircle, X } from 'lucide-react';

export default function Login() {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await api.post('/auth/login', credentials);
            localStorage.setItem('token', res.data.token);
            navigate('/admin');
        } catch (err) {
            setError('Credenciales inválidas. Revisá tu usuario y contraseña.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
            <div className="relative w-full max-w-md p-4">
                
                {/* CARTEL DE ERROR (CON BOTÓN DE CIERRE) */}
                {error && (
                    <div className="absolute -top-16 left-4 right-4 bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-xl shadow-lg flex items-center justify-between animate-in fade-in slide-in-from-top-4">
                        <div className="flex items-center gap-2">
                            <XCircle size={18} />
                            <span className="text-sm font-bold">{error}</span>
                        </div>
                        <button 
                            onClick={() => setError('')}
                            className="p-1 hover:bg-red-200 rounded-full transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </div>
                )}

                <div className="bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-white/20">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg shadow-blue-500/30">
                            <LogIn className="text-white" size={32} />
                        </div>
                        <h2 className="text-3xl font-black text-slate-800 tracking-tight">Bienvenido</h2>
                        <p className="text-slate-500 font-medium">Hotel Pro Management</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="relative">
                            <label className="text-xs font-black text-slate-400 uppercase ml-1 mb-1 block">Usuario</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input 
                                    name="username" 
                                    type="text"
                                    required
                                    placeholder="Nombre de usuario" 
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-700 font-medium"
                                    onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="relative">
                            <label className="text-xs font-black text-slate-400 uppercase ml-1 mb-1 block">Contraseña</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input 
                                    name="password" 
                                    type="password" 
                                    required
                                    placeholder="••••••••" 
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-700 font-medium"
                                    onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                                />
                            </div>
                        </div>

                        <button 
                            disabled={loading}
                            className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:bg-slate-400"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>Ingresar al Sistema <LogIn size={18} /></>
                            )}
                        </button>
                    </form>

                    <p className="text-center mt-8 text-slate-400 text-xs font-medium uppercase tracking-widest">
                        Seguridad Protegida por JWT
                    </p>
                </div>
            </div>
        </div>
    );
}