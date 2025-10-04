Dudas, avances y logros:
13/09/2025:
Despues de 2 dias logre conectar mi supabase con prisma y nextjs para poder crear usuarios, tanto en la tabla de usuarios, como 
autenticarlos, es un buen avance ya que me abre el camino para el siguiente gran desafio, gestionar sesiones y protejer rutas de 
manera segura y mejorar la seguridad de la base de datos, ademas de darle un entorno visual al SignUp y Login donde tambien tendre que crear endpoints correspondientes a esas rutas en el backend para comunicarme con supabase (db), todos temas que tendre que afrontar pasado-manana 15/09, sin embargo el punto mas critico esta solucionado y funciona correctamente.
15/09/2025:
Hoy logre crear los endpoints de login y signup, protegi las rutas de la app con un middleware ademas cree la interfaz de login y signup y tuve un pantallazo general de como funcionan las sesiones en next.js y supabase, sin embargo me quedo pendiente la gestion de sesiones, mejorar el codigo (refactorizar algunas cosas), mejorar la seguridad de la base de datos y hacer que todo el sistema sea funcional para pasar al siguiente paso de este proyecto full-stack, todos estos temas los vere manana 16/09, pero voy avanzando bien y sobre todo aprendiendo y mejorando cada dia.
16/09/2025:
Hoy logre terminar casi por completo el sistema de autenticacion, control de sesiones y todo lo ateniente a la creacion de cuentas de usuarios, su autenticacion y manejo de sesiones, lo que me queda ahora es optimizar el codigo para que este prolijo en un ./actions (server side) para optimizar recursos y emprolijar mi codigo, agregar RLS a la base de datos de supabase para mayor seguridad, despues me queda mejorar un poco el backend y anadir algunas optimizaciones a mi codigo para que quede 100% limpio y prolijo, una vez que termine con esto debo pasar a la vinculacion de tareas con usuarios, permisos desde el backend para ver, editar, crear y eliminar tareas, y agregar nuevas funcionalidades y asi completar mi primer proyecto de prueba para desplegar y lanzarlo, sigo manana.

A tener en cuenta:
-Error al eliminar usuario (no redirige automaticamente a login).
-Analizar la pantalla de /user/confirm para ver si es util o hay que eliminarla.
-Entender todo el codigo y como funciona mi app E2E. (IMPORTANTE)

Lo que falta (plazo de 1 semana, hasta el 30/09/2025):
-Filtrado de tareas por tags (MUY IMPORTANTE). (LISTO)
-Due dates (fecha de vencimiento) funcionales en el backend. (LISTO)
-Eliminar tareas despues de 4 dias de vencidas. (LISTO)
-Eliminar tareas despues de 1 dia de completadas. (LISTO)
-Anadir NavBar y Footer (?) estetico con todo el diseno. (LISTO)
-Onboarding minimo. (LISTO)
-Manejo y validacion de errores frontend y backend. (LISTO)
-Feedback de UI: loaders, estados de éxito/fracaso, mensajes de error legibles. (LISTO - a mejorar)
-Opcion de editar titulo y descripcion desde el detalle de la tarea (haciendo doble click). (LISTO)
-Pagina de profile con datos basicos de usuario y la opcion de editarlos. (LISTO)
-Edicion de los datos de usuario. (LISTO)
-Opcion de eliminar cuenta. (LISTO)
-Confirmacion de usuarios via email con supabase. (LISTO)
-Recuperar y modificar contrasena. (PARA DESPUES)
-Registrarse e iniciar sesion con Google y GitHub. (LISTO)
-Manejo, validacion y sanitizacion de formularios (frontend + Zod + RLS de supabase). (LISTO)
-(Investigar todo sobre como subir mi app a produccion y que herramientas usar)-
-(Investigar y comenzar con mi estrategia de marketing, poscicionamiento y ventas)-
-Subir a respositorio de Github con Git.
-Responsive + mobile friendly.
-Refactorizar y pulir un poco el codigo del backend y frontend.
-Pulir la UI/UX.
-Anadir RLS en la base de datos de supabase.
-Verificar la seguridad de toda la app E2E.
-Actualizar repositorio en GitHub con Git.
-Desplegar en Vercel y mandar supabase a produccion.

Proximas actualizaciones (primer fase):
-PWA / offline sync.
-Recordatorios automaticos (opcionales) (email/push) — requiere infra externa.
-Recordatorios programados (general o tarea especifica) (email/push) configurados por el usuario.
-Edicion y gestion de tags.
-Subtasks / checklist dentro de una tarea.
-Vista calendario y arrastrar y soltar.
-Colaboración (compartir tareas con otros usuarios).
-Importar y exportar excel y cvs de tareas (opcional).

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
