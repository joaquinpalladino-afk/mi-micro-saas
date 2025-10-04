'use client'

import { useActionState } from "react";
import { SendResetPasswordEmail } from "@/actions/auth";
import Link from "next/link";

export default function ResetPage(){
  const [state, formAction, isPending] = useActionState(SendResetPasswordEmail, {message: '', success: ''});
  const {message, success} = state;

  return (
    <main className="min-h-screen bg-slate-900 text-slate-200 flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md">
        <form action={formAction} className='bg-slate-800 p-6 sm:p-8 rounded-lg shadow-lg'>
          <header className="mb-6 sm:mb-8 text-center">
            <h1 className='text-2xl sm:text-3xl font-bold'>Reestablecer Contraseña</h1>
            <p className="text-slate-400 mt-2 text-sm sm:text-base">Te enviaremos un email para que puedas reestablecer tu contraseña</p>
          </header>

          <div className="mb-6">
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

          <div className='flex flex-col gap-4'>
            <button
              className='w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 px-4 rounded-md focus:outline-none focus:shadow-outline transition-colors'
              type='submit'
              disabled={isPending}
            >
              {isPending ? 'Enviando...' : 'Enviar'}
            </button>
          </div>
        </form>
        {message && (
          <div className={`mt-4 text-center p-2 rounded-md bg-red-500/20 text-red-500`}>
            <p>{message}</p>
          </div>
        )}
        {success && (
          <div className={`mt-4 text-center p-2 rounded-md bg-green-500/20 text-green-500`}>
            <p>{success}</p>
          </div>
        )}
        <footer className="text-center mt-6">
          <p className="text-slate-400 text-sm sm:text-base">
            ¿Ya tienes una cuenta?{' '}
            <Link href="/auth/login" className="text-sky-500 hover:text-sky-400 font-semibold">
              Inicia Sesión
            </Link>
          </p>
        </footer>
      </div>
    </main>
  )
}