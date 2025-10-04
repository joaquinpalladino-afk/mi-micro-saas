"use server"

import prisma from "@/libs/prisma"
import { revalidatePath } from "next/cache"
import { createSupabaseClient, createSupabaseAdmin } from "@/libs/supabase/server";
import { redirect } from "next/dist/server/api-utils";

export async function getUser() {

        const supabase = await createSupabaseClient();
        const session = await supabase.auth.getUser();
        const userId = session.data.user?.id;

        if (!userId) {
            return null;
        }
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });

        return user;
    } catch (error) {
        console.error("Error fetching user:", error);
        return null;
    }
}

export async function updateUser(prevState, formData) {
    const supabase = await createSupabaseClient();
    const session = await supabase.auth.getUser();
    const userId = session.data.user?.id;

    const name = formData.get('name');
    const username = formData.get('username');

    try {
        const updatedUser = await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                name,
                username
            }
        });
        revalidatePath('/profile');
        return { success: true, user: updatedUser };
    } catch (error) {
        console.error("Error updating user:", error);
        return { success: false, message: "No se pudo actualizar el usuario." };
    }
}

export const deleteUser = async () => {
const supabaseU = await createSupabaseClient();
const session = await supabaseU.auth.getUser();
const userId = session.data.user?.id;

if(!userId){
    return {success: false, error: "No se tiene acceso al usuario."}
}

    const supabase = await createSupabaseAdmin();
    const { error: authError } = await supabase.auth.admin.deleteUser(userId);

    if (authError) {
        console.error("Error deleting auth user:", authError);
        return { success: false, error: "No se pudo eliminar el usuario de autenticación." };
    }

    try {
        // Usar una transacción para asegurar que todas las operaciones se completen con éxito
        await prisma.$transaction(async (prisma) => {
            // Eliminar todas las etiquetas asociadas al usuario
            await prisma.tag.deleteMany({
                where: {
                    userId: userId,
                },
            });

            // Eliminar todas las tareas asociadas al usuario
            await prisma.task.deleteMany({
                where: {
                    userId: userId,
                },
            });

            // Finalmente, eliminar el usuario
            await prisma.user.delete({
                where: {
                    id: userId,
                },
            });
        });

        revalidatePath("/", "layout"); // Revalida el cache para reflejar los cambios
        return { success: true };
    } catch (error) {
        console.error("Error al eliminar el usuario:", error);
        return { success: false, error: "No se pudo eliminar el usuario." };
    }
};