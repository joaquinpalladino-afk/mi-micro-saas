'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getUser } from '@/actions/user';
import Image from 'next/image';

export default function NavBar() {
    const pathname = usePathname();
    const [user, setUser] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            const userData = await getUser();
            setUser(userData);
        };
        fetchUser();
    }, []);

    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [isMenuOpen]);

    const navLinks = [
        { href: '/', label: 'Tus Tareas' },
        { href: '/new', label: 'Nueva Tarea' },
    ];

    const handleLinkClick = () => {
        setIsMenuOpen(false);
    };

    return (
        <>
            <nav className="bg-slate-800/95 shadow-lg sticky top-0 z-50 backdrop-blur-sm">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link href="/" className="text-2xl font-bold text-white hover:text-sky-400 transition-colors">
                            TasksManager
                        </Link>

                        <div className="hidden md:flex items-center space-x-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                        pathname === link.href
                                            ? 'bg-sky-600 text-white'
                                            : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        <div className="hidden md:flex items-center">
                            <Link href="/profile" className="flex items-center space-x-3 hover:bg-slate-700 p-2 rounded-md transition-colors">
                                <span className="text-white font-medium text-sm">{user?.name || 'Perfil'}</span>
                                <Image
                                    src={user?.avatar_url || '/default-avatar.svg'}
                                    alt="Foto de perfil"
                                    width={32}
                                    height={32}
                                    className="rounded-full bg-slate-600"
                                />
                            </Link>
                        </div>

                        <div className="md:hidden flex items-center">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                aria-controls="mobile-menu"
                                aria-expanded={isMenuOpen}
                            >
                                <span className="sr-only">Open main menu</span>
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            <div className={`fixed inset-0 z-40 md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
                {/* Overlay */}
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>

                {/* Menu Panel */}
                <div className={`fixed top-0 right-0 h-full w-64 bg-slate-800 shadow-xl transition-transform transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="px-2 pt-16 pb-3 space-y-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={handleLinkClick}
                                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                                    pathname === link.href
                                        ? 'bg-sky-600 text-white'
                                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                    <div className="pt-4 pb-3 border-t border-slate-700">
                        <Link href="/profile" onClick={handleLinkClick} className="flex items-center px-4 py-2 hover:bg-slate-700 transition-colors">
                            <div className="flex-shrink-0">
                                <Image
                                    src={user?.avatar_url || '/default-avatar.svg'}
                                    alt="Foto de perfil"
                                    width={40}
                                    height={40}
                                    className="rounded-full bg-slate-600"
                                />
                            </div>
                            <div className="ml-3 min-w-0">
                                <div className="text-base font-medium leading-none text-white truncate">{user?.name || 'Perfil'}</div>
                                {user?.email && <div className="text-sm font-medium leading-none text-slate-400 mt-1 truncate">{user.email}</div>}
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}