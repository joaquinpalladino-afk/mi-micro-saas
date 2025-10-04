'use client'

export function Alert({ message, type }) {
  const alertClasses = {
    error: 'bg-red-100 border border-red-400 text-red-700',
    success: 'bg-green-100 border border-green-400 text-green-700',
  }

  return (
    <div className={`${alertClasses[type]} px-4 py-3 rounded relative mt-4 shadow-md`}>
      <p className="text-center">
        {message}
      </p>
    </div>
  )
}