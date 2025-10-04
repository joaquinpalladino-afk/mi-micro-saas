'use client'

import { useFormStatus } from 'react-dom'

export function SubmitButton({ children, pendingText }) {
  const { pending } = useFormStatus()

  return (
    <button
      className='w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 px-4 rounded-md focus:outline-none focus:shadow-outline transition-colors'
      type='submit'
      disabled={pending}
    >
      {pending ? pendingText : children}
    </button>
  )
}