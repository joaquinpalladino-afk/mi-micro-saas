'use client'

import { Login, loginProvider } from "@/actions/auth";
import { createClient } from "@/libs/supabase/client";
import Link from "next/link";
import {Provider} from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { SubmitButton } from "@/components/SubmitButton";
import { Alert } from "@/components/Alert";

const initialState = {
  message: null,
};

export default function LoginPage() {
  const [state, formAction] = useActionState(Login, initialState);
  const router = useRouter();
  
  const handleLogin = async (provider) => {
    const { error, url } = await loginProvider(provider);
    if (!error && url) router.push(url);
    else console.error(error);
  };

    return (
        <main className="min-h-screen bg-slate-900 text-slate-200 flex items-center justify-center p-4 sm:p-6 md:p-8">
            <div className="w-full max-w-md">
                <form action={formAction} className='bg-slate-800 p-6 sm:p-8 rounded-lg shadow-lg'>
                    <header className="mb-6 sm:mb-8 text-center">
                        <h1 className='text-2xl sm:text-3xl font-bold'>Iniciar Sesión</h1>
                        <p className="text-slate-400 mt-2 text-sm sm:text-base">Bienvenido de nuevo</p>
                    </header>

                    <div className="mb-4 sm:mb-6">
                        <label className='block text-slate-400 text-sm font-bold mb-2' htmlFor="email">Email</label>
                        <input
                            className='w-full bg-slate-700 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 transition text-slate-200'
                            type="email"
                            id='email'
                            name='email'
                            placeholder="tu@email.com"
                            required
                        />
                    </div>

                    <div className="mb-4 sm:mb-6">
                        <label className='block text-slate-400 text-sm font-bold mb-2' htmlFor="password">Contraseña</label>
                        <input
                            className='w-full bg-slate-700 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 transition text-slate-200'
                            type="password"
                            id='password'
                            name='password'
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <div className='flex flex-col gap-4'>
                        <SubmitButton pendingText="Ingresando...">
                            Ingresar
                        </SubmitButton>
                        <button
                            type="button"
                            onClick={() => handleLogin('google')}
                            className='w-full bg-white hover:bg-gray-200 text-black font-bold py-3 px-4 rounded-md focus:outline-none focus:shadow-outline transition-colors flex items-center justify-center gap-2'
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c3.24 0 5.95-1.08 7.93-2.93l-3.57-2.77c-.98.65-2.23 1.04-4.36 1.04-3.34 0-6.18-2.15-7.17-5.1L2.87 18.2c1.97 3.85 6.04 6.8 9.13 6.8z"/>
                                <path fill="#FBBC05" d="M4.64 13.99c-.1-.32-.16-.65-.16-.99s.06-.67.16-.99L2.87 7.86c-.33.66-.53 1.39-.53 2.14s.2 1.48.53 2.14l1.77 3.49z"/>
                                <path fill="#EA4335" d="M12 4.58c1.72 0 2.91.74 3.57 1.35l3.13-3.05C17.95 1.07 15.24 0 12 0 8.96 0 4.89 2.95 2.87 6.8l1.77 3.49c.99-2.95 3.83-5.1 7.17-5.1z"/>
                            </svg>
                           Iniciar sesión con Google
                         </button>
                    </div>
                </form>
                {state?.message && (
                    <Alert message={state.message} type="error" />
                )}
                <footer className="text-center mt-6">
                    <p className="text-slate-400 text-sm sm:text-base">
                        ¿No tienes una cuenta?{' '}
                        <Link href="/auth/signup" className="text-sky-500 hover:text-sky-400 font-semibold">
                            Regístrate aquí
                        </Link>
                    </p>
                </footer>
                <footer className="text-center mt-4 sm:mt-6">
                    <p className="text-slate-400 text-sm sm:text-base">
                        ¿Olvidaste tu contraseña?{' '}
                        <Link href="/auth/reset" className="text-sky-500 hover:text-sky-400 font-semibold">
                            Recuperar contraseña
                        </Link>
                    </p>
                </footer>
            </div>
        </main>
    )
}