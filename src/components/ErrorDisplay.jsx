
const ErrorDisplay = ({ error, onRetry }) => {
    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-slate-900 text-white p-4 text-center">
            <h2 className="text-2xl font-semibold text-red-500 mb-4">Ha ocurrido un error</h2>
            <p className="text-slate-400 mb-8 max-w-md">{error}</p>
            <button
                onClick={onRetry}
                className="px-6 py-2 rounded-md bg-sky-600 hover:bg-sky-500 transition-colors font-semibold"
            >
                Reintentar
            </button>
        </div>
    )
}

export default ErrorDisplay
