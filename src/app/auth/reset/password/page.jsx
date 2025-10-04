'use client'

import { useState } from "react";
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'

const initialState = {
  message: null,
  success: false
};

export default function ResetPasswordPage() {
  const [state, setState] = useState(initialState);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState({ message: null, success: false });

    if (password !== confirmPassword) {
      setState({ message: "Las contraseñas no coinciden", success: false });
      return;
    }

    if (password.length < 6) {
      setState({ message: "La contraseña debe tener al menos 6 caracteres", success: false });
      return;
    }

    // Supabase client automatically handles the session from the URL hash.
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setState({ message: "Hubo un error al reestablecer contraseña", success: false });
      console.error("Password reset error:", error);
    } else {
      setState({ message: "Contraseña actualizada correctamente. Serás redirigido a la página de inicio.", success: true });
      setTimeout(() => {
        router.push('/');
      }, 3000);
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 text-slate-200 flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className='bg-slate-800 p-6 sm:p-8 rounded-lg shadow-lg'>
          <header className="mb-6 sm:mb-8 text-center">
            <h1 className='text-2xl sm:text-3xl font-bold'>Reestablecer Contraseña</h1>
            <p className="text-slate-400 mt-2 text-sm sm:text-base">Ingresa tu nueva contraseña</p>
          </header>

          <div className="mb-4 sm:mb-6">
            <label className='block text-slate-400 text-sm font-bold mb-2' htmlFor="password">Nueva Contraseña</label>
            <input
              className='w-full bg-slate-700 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 transition text-slate-200'
              type="password"
              id='password'
              name='password'
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="mb-4 sm:mb-6">
            <label className='block text-slate-400 text-sm font-bold mb-2' htmlFor="confirmPassword">Confirmar Contraseña</label>
            <input
              className='w-full bg-slate-700 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 transition text-slate-200'
              type="password"
              id='confirmPassword'
              name='confirmPassword'
              placeholder="••••••••"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className='flex flex-col gap-4'>
            <button
              className='w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 px-4 rounded-md focus:outline-none focus:shadow-outline transition-colors'
              type='submit'>
              Reestablecer Contraseña
            </button>
          </div>
        </form>
        {state?.message && (
          <div className={`mt-4 text-center p-2 rounded-md ${state.success ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
            <p>{state.message}</p>
          </div>
        )}
      </div>
    </main>
  )
}