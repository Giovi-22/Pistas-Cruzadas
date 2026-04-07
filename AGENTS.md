# 🛠️ Pistas Cruzadas - Estándares de Arquitectura y Desarrollo

Este documento define la estructura y las mejores prácticas para mantener el proyecto organizado, legible y escalable. Todos los desarrolladores (y agentes IA) deben seguir estos patrones.

## 🏗️ Estructura de Carpetas

```text
src/
├── app/                # Next.js App Router (Páginas ligeras, sin lógica pesada)
├── components/         # Componentes de React
│   ├── ui/             # Componentes atómicos reutilizables (Botones, Inputs, Cards)
│   ├── game/           # Componentes específicos del dominio del juego
│   │   ├── Board/      # Tablero y celdas
│   │   └── Views/      # Vistas de estado (Lobby, Guesser, ClueGiver)
│   └── layout/         # Componentes generales de estructura (Header, Footer)
├── hooks/              # Custom React Hooks (ej: useRoom para Sockets)
├── lib/                # Utilidades, constantes y clientes (Socket Client)
├── types/              # Definiciones de TypeScript
└── styles/             # (Opcional) Archivos CSS globales
```

## 🎨 Estética y Diseño (UI/UX)

- **Tema**: Principalmente Oscuro (`slate-950`).
- **Estilo**: **Glassmorphism / Neon Retro**.
    - Usa `backdrop-blur-xl` y opacidades en fondos.
    - Bordes suaves (`rounded-2xl` o `rounded-3xl`).
    - Sombras con colores de acento (`shadow-rose-500/50`).
- **Consistencia**:
    - Rojo: `rose-500` / `rose-400`.
    - Azul: `cyan-500` / `cyan-400`.
    - Acento: `amber-500` (para avisos o estados especiales).

## 🚀 Patrones de Desarrollo

1. **Atomicidad**: Si un elemento visual se repite más de dos veces, extráelo a `src/components/ui/`.
2. **Lógica Separada**: No satures las páginas (`page.tsx`) con lógica de Sockets o estados complejos. Usa **Custom Hooks**.
3. **Pureza**: Los componentes de UI deben ser "puros" (recibir props y emitir eventos), sin efectos secundarios directos hacia el servidor.
4. **TypeScript**: Siempre define interfaces para las props en archivos `.tsx`.

## 📡 Comunicación (Sockets)

- Centraliza la comunicación en `src/lib/socketClient.ts`.
- Usa el hook `useRoom(roomId)` para sincronizar el estado de la sala automáticamente al montar un componente.

---
*Este proyecto es cooperativo y dinámico. Mantengamos el código tan divertido como el juego.*
