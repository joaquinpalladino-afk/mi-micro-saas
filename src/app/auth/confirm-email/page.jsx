import Link from 'next/link';

export default function ConfirmEmailPage() {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-slate-900 text-white p-4 sm:p-6 md:p-8">
      <div className="text-center p-6 sm:p-8 max-w-md mx-auto bg-slate-800 rounded-lg shadow-lg">
        <h1 className="text-2xl sm:text-3xl font-bold text-sky-500 mb-4">¡Confirma tu correo electrónico!</h1>
        <p className="text-slate-300 mb-6 text-sm sm:text-base">
          Hemos enviado un correo de confirmación a tu dirección de correo electrónico. Por favor, revisa tu bandeja de entrada y sigue las instrucciones para activar tu cuenta.
        </p>
        <p className="text-slate-400 text-sm mb-8">
          Si no encuentras el correo, asegúrate de revisar tu carpeta de spam.
        </p>
        <Link href="/auth/login" className="px-6 py-3 rounded-md bg-sky-600 hover:bg-sky-500 transition-colors font-semibold text-white">
          Volver a Iniciar Sesión
        </Link>
      </div>
    </div>
  );
}
