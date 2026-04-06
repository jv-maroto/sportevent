---
description: Reglas para codigo React/Tailwind en el frontend
globs: frontend/src/**/*.{js,jsx,ts,tsx}
---

# React / Tailwind

## Componentes
- Componentes funcionales con hooks (no clases)
- Estado local con useState, global con Context API (AuthContext)
- useEffect con cleanup y dependencias correctas
- Destructuring de props

## Routing
- React Router v6 con rutas protegidas (ProtectedRoute)
- Navegacion con useNavigate()

## API
- Llamadas centralizadas en src/services/
- Axios con interceptors para JWT (Authorization header)
- Manejar loading, error y data states

## Estilos
- Tailwind CSS exclusivamente (no CSS custom salvo excepciones)
- Design system en .claude/skills/frontend-design.md
- Colores: dark-900 (fondo), lime-400 (acento)
- Fuentes: Syne (display), DM Sans (body)
- Responsive: mobile-first con breakpoints sm/md/lg/xl

## Rendimiento
- Lazy loading de paginas con React.lazy() + Suspense
- useMemo/useCallback solo cuando hay problema real de rendimiento
- Imagenes optimizadas (WebP, lazy loading)
