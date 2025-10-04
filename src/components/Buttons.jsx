'use client'
import { useRouter } from 'next/navigation';
import { Logout } from '@/actions/auth';
import { useActionState, useState } from 'react';

export function BNew() {
    const router = useRouter();

    return (
        <div>
            <button className='bg-slate-800 p-3 mb-2 text-white' onClick={() => router.push('/new')}>Nueva Tarea</button>
        </div>
    )
}

export function BEdit({ id, disabled }) {
    const router = useRouter();

    return (
        <button 
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed' 
            onClick={() => router.push(`/tasks/edit/${id}`)} 
            disabled={disabled}
        >
            Editar
        </button>
    )
}

export function BDelete({ onClick, disabled }) {
    return (
        <button
            className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed'
            onClick={onClick}
            disabled={disabled}
        >
            {disabled ? 'Eliminando...' : 'Eliminar'}
        </button>
    )
}

export function LogOut() {
    const [state, formAction] = useActionState(Logout, { message: null });

    return (
        <div className='mt-4'>
            <form action={formAction}>
                <button type='submit' className='p-2 bg-red-800 h-10 pointer hover:bg-red-700 transition-all rounded-sm flex items-center justify-center text-white font-bold w-full'>Log Out</button>
            </form>
            {state?.message && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-2 shadow-md">
                    <p className="text-red-500 text-center text-sm">
                        {state.message}
                    </p>
                </div>
            )}
        </div>
    )
}
