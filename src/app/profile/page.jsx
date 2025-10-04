'use client'

import { useEffect, useState, useRef } from 'react';
import { getUser, updateUser, deleteUser } from '@/actions/user';
import Image from 'next/image';
import { Logout } from '@/actions/auth';
import { useRouter } from 'next/navigation';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';

export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingField, setEditingField] = useState(null);
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const inputRef = useRef(null);
    const router = useRouter();
    
    useEffect(() => {
        const loadUser = async () => {
            try {
                const userData = await getUser();
                if (!userData) {
                    throw new Error("No se pudo cargar el usuario.");
                }
                setUser(userData);
                setName(userData.name || '');
                setUsername(userData.username || '');
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }
        loadUser();
    }, [])

    useEffect(() => {
        if (editingField && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editingField]);

    const handleDoubleClick = (field) => {
        setEditingField(field);
    };

    const handleUpdate = async (field, value) => {
        const formData = new FormData();
        if (field === 'name') {
            formData.append('name', value);
            formData.append('username', username);
        } else if (field === 'username') {
            formData.append('name', name);
            formData.append('username', value);
        }

        const result = await updateUser(null, formData);

        if (result.success) {
            setUser(result.user);
            setName(result.user.name);
            setUsername(result.user.username);
            setEditingField(null);
            setError(null);
        } else {
            setError(result.message);
        }
    };

    const handleKeyDown = (e, field) => {
        if (e.key === 'Enter') {
            handleUpdate(field, e.target.value);
        }
        if(e.key === 'Escape') {
            setEditingField(null);
        }
    };

    const handleDelete = () => {
        setIsModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        const result = await deleteUser();
        if (result.success) {
            setIsModalOpen(false);
            router.refresh();
            await Logout();
        } else {
            setError(result.error);
            setIsModalOpen(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-slate-900 text-white">
                <p className="text-xl">Cargando perfil de usuario...</p>
            </div>
        )
    }

    if (error) {
        setTimeout(() => setError(null), 5000);
    }

    return (
        <div className="flex justify-center items-start min-h-screen bg-slate-900 text-white p-4 pt-20">
            <div className="w-full max-w-4xl">
                <div className="bg-slate-800 rounded-lg shadow-lg p-6 md:p-12">
                    <div className="flex flex-col items-center md:flex-row md:items-start">
                        <div className="relative mb-6 md:mb-0 md:mr-8">
                            <Image
                                src={user?.avatar_url || '/default-avatar.svg'}
                                alt="Foto de perfil"
                                width={128}
                                height={128}
                                className="rounded-full bg-slate-700 w-24 h-24 md:w-36 md:h-36"
                            />
                        </div>
                        <div className="w-full text-center md:text-left">
                            <div onDoubleClick={() => handleDoubleClick('name')} className="mb-4 cursor-pointer p-2 rounded-md transition-all hover:bg-slate-700/50">
                                {editingField === 'name' ? (
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        defaultValue={name}
                                        onKeyDown={(e) => handleKeyDown(e, 'name')}
                                        onBlur={() => setEditingField(null)}
                                        className="w-full bg-slate-700 p-2 rounded-md text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-sky-500"
                                    />
                                ) : (
                                    <h1 className="text-3xl sm:text-4xl font-bold">{name}</h1>
                                )}
                            </div>
                            <div onDoubleClick={() => handleDoubleClick('username')} className="mb-4 cursor-pointer p-2 rounded-md transition-all hover:bg-slate-700/50">
                                {editingField === 'username' ? (
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        defaultValue={username}
                                        onKeyDown={(e) => handleKeyDown(e, 'username')}
                                        onBlur={() => setEditingField(null)}
                                        className="w-full bg-slate-700 p-2 rounded-md text-lg text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                                    />
                                ) : (
                                    <p className="text-lg sm:text-xl text-slate-400">@{username}</p>
                                )}
                            </div>
                            <div className="mt-6">
                                <p className="text-slate-400">Correo Electrónico</p>
                                <p className="text-lg">{user?.email}</p>
                            </div>
                        </div>
                    </div>
                    {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
                    <div className="mt-8 flex flex-col sm:flex-row justify-center sm:justify-end gap-4">
                        <button onClick={handleDelete} className='w-full sm:w-auto px-6 py-2 rounded-md text-sm font-medium bg-red-600 text-white hover:bg-red-500 transition-colors'>
                            Eliminar Cuenta
                        </button>
                        <form action={Logout} className="w-full sm:w-auto">
                            <button
                                type="submit"
                                className="w-full sm:w-auto px-6 py-2 rounded-md text-sm font-medium bg-red-600 text-white hover:bg-red-500 transition-colors"
                            >
                                Cerrar Sesión
                            </button>
                        </form>
                    </div>
                </div>
                <p className="text-center text-slate-500 mt-4 text-sm">
                    Haz doble click en tu nombre o nombre de usuario para editarlos. Presiona Enter para guardar.
                </p>
            </div>
            <ConfirmDeleteModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmDelete}
            />
        </div>
    )
}
