'use client'

import { usePathname } from 'next/navigation'
import NavBar from '@/components/NavBar'

export default function ConditionalLayout({ children }) {
  const pathname = usePathname()
  const noNavRoutes = ['/auth/login', '/auth/signup', '/auth/reset', '/auth/reset/password', "/auth/confirm-email"]

  return (
    <>
      {!noNavRoutes.includes(pathname) && <NavBar />}
      {children}
    </>
  )
}
