# 🍄 Estado de Caja - Sistema de Gestión de Hongos

Aplicación web moderna para gestionar ventas y gastos de un proyecto de venta de hongos, con división automática 50/50 entre dos socios.

## 🚀 Características

- ✅ Registro de ventas y gastos
- ✅ División automática 50/50 entre socios
- ✅ Dashboard con estadísticas y resúmenes
- ✅ Gestión de categorías de gastos y tipos de hongos
- ✅ Edición y eliminación de registros
- ✅ PWA (Progressive Web App) - Instalable en dispositivos móviles
- ✅ Diseño moderno y artístico
- ✅ Base de datos PostgreSQL con Prisma

## 🛠️ Tecnologías

- **Next.js 14** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos modernos
- **Prisma** - ORM para base de datos
- **PostgreSQL** - Base de datos (Neon)

## 📦 Instalación

1. Clonar el repositorio
2. Instalar dependencias:
```bash
npm install
```

3. Configurar la base de datos:
   - Crear un archivo `.env` en la raíz del proyecto
   - Agregar tu conexión de Neon:
   ```
   DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
   ```

4. Inicializar la base de datos:
```bash
npx prisma db push
npx prisma generate
```

5. Ejecutar en desarrollo:
```bash
npm run dev
```

6. Abrir [http://localhost:3000](http://localhost:3000)

## 🚢 Despliegue

### Vercel

1. Conectar tu repositorio a Vercel
2. Agregar la variable de entorno `DATABASE_URL`
3. Vercel ejecutará automáticamente `prisma generate` durante el build

### Netlify

1. Conectar tu repositorio a Netlify
2. Configurar el build command: `npm run build`
3. Agregar la variable de entorno `DATABASE_URL`

## 📱 PWA

La aplicación está configurada como PWA. Los usuarios pueden instalarla en sus dispositivos móviles desde el navegador.

## 🎨 Estructura del Proyecto

```
├── app/
│   ├── api/          # API routes
│   ├── dashboard/    # Dashboard con estadísticas
│   ├── ventas/       # Gestión de ventas
│   ├── gastos/       # Gestión de gastos
│   └── configuracion/ # Configuración de categorías y tipos
├── components/       # Componentes reutilizables
├── lib/             # Utilidades (Prisma client)
└── prisma/          # Schema de base de datos
```

## 📝 Uso

1. **Configuración inicial**: Ve a "Configuración" y crea categorías de gastos y tipos de hongos
2. **Registrar ventas**: Ve a "Nueva Venta" y completa el formulario
3. **Registrar gastos**: Ve a "Nuevo Gasto" y completa el formulario
4. **Ver dashboard**: Consulta estadísticas y balances en "Dashboard"
5. **Editar/Eliminar**: Usa los botones de acción en las listas de ventas/gastos

## 🔐 Notas de Seguridad

- La aplicación no tiene autenticación por ahora (como solicitado)
- Todos los usuarios pueden acceder y modificar datos
- Considera agregar autenticación para producción

## 📄 Licencia

Este proyecto es privado.

