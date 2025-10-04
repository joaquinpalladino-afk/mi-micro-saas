'use client'

export default function ConfirmDeleteModal({ isOpen, onClose, onConfirm }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex justify-center items-center p-4">
            <div className="bg-slate-800 p-6 sm:p-8 rounded-lg shadow-xl max-w-sm w-full">
                <h2 className="text-2xl font-bold text-white mb-4">Confirmar Eliminación</h2>
                <p className="text-slate-300 mb-6">¿Estás seguro de que quieres eliminar tu cuenta? Esta acción es irreversible.</p>
                <div className="flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 rounded-md font-medium bg-slate-700 text-white hover:bg-slate-600 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-6 py-2 rounded-md font-medium bg-red-600 text-white hover:bg-red-500 transition-colors"
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
}
