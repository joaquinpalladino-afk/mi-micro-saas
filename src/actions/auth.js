'use server'

import { NextResponse } from "next/server";
import { createSupabaseClient } from "@/libs/supabase/server";
import { Provider } from "@supabase/supabase-js";
//import {createClient} from "@/libs/supabase/client";
import { redirect } from "next/navigation";
import {z} from "zod";
import { revalidatePath } from "next/cache";

const signUpSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(50),
    name: z.string().max(50).min(2),
    username: z.string().max(50).min(2)
});

const signInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(50)
})

export async function loginProvider(provider) {
  try {
    const supabase = await createSupabaseClient();
    console.log(process.env.NEXT_PUBLIC_BASE_URL)
    const { error, data } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/v1/callback`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (error) throw error;

    return { error: null, url: data.url };
  } catch (error) {
    return { error: "Error in login provider", url: null };
  }
}

export const SendResetPasswordEmail = async (prevState, formData) => {
const supabase = await createSupabaseClient();
const email = formData.get("email");

const {data, error} = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset/password`
});

if(error){
    console.log(error);
    return {
        success: '',
        message: "Error al enviar el correo electrónico, intentelo de nuevo."
}
}

return {
success: 'Por favor, revise su casilla de correo electronico',
message: ''
}
}

export async function SignUp(prevState, formData) {
const supabase = await createSupabaseClient();
const email = formData.get("email");
const password = formData.get("password");
const name = formData.get("name");
const username = formData.get("username");
const result = signUpSchema.safeParse({
    email,
    password,
    name,
    username
});

if(result.success){
const {data, error} = await supabase.auth.signUp({
    email: formData.get("email"),
    password: formData.get("password") ,
    options: {
        data: {
            name: formData.get("name"),
            username: formData.get("username"),
            avatar_url: null
        }
    }
})

console.log(data);

if(error){
    console.log(error);
    return {
        message: "Hubo un error al crear el usuario, intentelo de nuevo."
    }
}
}else{
  console.log(result.error);
  return {
    message: "Hubo un error al crear el usuario, llene correctamente los campos."
  }
}

revalidatePath("/", "layout");
redirect("/auth/confirm-email");
}

export async function Login(prevState, formData) {
const email = formData.get("email");
const password = formData.get("password");

const result = signInSchema.safeParse({
    email,
    password
});

if(result.success){

const supabase = await createSupabaseClient();

const {data, error} = await supabase.auth.signInWithPassword({
    email: formData.get("email"),
    password: formData.get("password"),
});

if(error){
    return {
        message: "El correo electrónico o la contraseña no son correctos, intentelo de nuevo."
}
}
}else{
  console.log(result.error);
  return {
    message: "Hubo un error al iniciar sesion, llene correctamente los campos."
  }
}

revalidatePath("/", "layout");
redirect("/");

}

export async function Logout() {

const supabase = await createSupabaseClient();

  const { error } = await supabase.auth.signOut();
  if (error){
    return NextResponse.json(error);
  }; 
  if(error){
    return {
        message: "Error al cerrar sesion, intentelo de nuevo."
}
}

  revalidatePath("/", "layout");
  redirect("/auth/login");
}