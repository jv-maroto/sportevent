# Plan de Mejoras — SportEvent

## Estado actual

El proyecto tiene la funcionalidad base completa: auth con JWT, CRUD de eventos, inscripciones con Stripe, resultados y rankings. Se han corregido los problemas criticos de seguridad, rendimiento (N+1 queries) y validacion de schemas.

---

## Fase 1 — Seguridad y robustez (Prioridad alta)

### 1.1 Autenticacion
- [ ] Implementar verificacion de email tras registro (enviar enlace de confirmacion)
- [ ] Agregar flujo de recuperacion de contrasena (forgot password + reset token)
- [ ] Implementar refresh tokens (evitar re-login cada 60 min)
- [ ] Agregar rate limiting en endpoints de login y registro (SlowAPI)

### 1.2 Backend
- [ ] Eliminar `Base.metadata.create_all()` de `main.py` — usar solo Alembic
- [ ] Crear migracion inicial de Alembic (`alembic revision --autogenerate`)
- [ ] Mover SECRET_KEY a variable de entorno obligatoria (sin valor por defecto)
- [ ] Agregar logging estructurado en todos los routers
- [ ] Configurar pool de conexiones para PostgreSQL (`pool_pre_ping`, `pool_size`)
- [ ] Restringir CORS a metodos especificos (`GET, POST, PUT, DELETE`)

### 1.3 Stripe
- [ ] Validar que claves Stripe estan configuradas antes de aceptar pagos
- [ ] Agregar endpoint para cancelar inscripcion (con reembolso via Stripe Refunds)
- [ ] Indexar `stripe_session_id` en modelo Inscription para busquedas rapidas

---

## Fase 2 — Funcionalidad (Prioridad media)

### 2.1 Gestion de eventos
- [ ] Editar evento (el organizador actualmente solo puede crear, publicar y finalizar)
- [ ] Agregar campo `updated_at` a modelos Event, Inscription y Result
- [ ] Validar transiciones de status (draft -> published -> finished, no saltar pasos)
- [ ] Paginacion en listado de eventos (`limit` + `offset` o cursor-based)

### 2.2 Perfil de usuario
- [ ] Pagina de perfil: ver y editar nombre, telefono, email
- [ ] Cambiar contrasena desde el perfil
- [ ] Historial de inscripciones y resultados del usuario

### 2.3 Inscripciones
- [ ] Permitir cancelar inscripcion (antes de que empiece el evento)
- [ ] Notificacion por email al confirmar inscripcion
- [ ] Exportar listado de inscritos a CSV (para organizadores)

### 2.4 Resultados
- [ ] Selector de participante por nombre (no por ID) en Dashboard
- [ ] Importacion masiva de resultados via CSV
- [ ] Estadisticas del evento (tiempo medio, mejor tiempo, participantes)

---

## Fase 3 — UX y frontend (Prioridad media)

### 3.1 Formularios
- [ ] Validacion en tiempo real en Register y EventCreate (feedback visual)
- [ ] Dialogo de confirmacion antes de publicar/finalizar evento
- [ ] Debounce en busqueda de eventos (evitar peticiones por cada tecla)
- [ ] Selector de deporte con opciones predefinidas (no texto libre)

### 3.2 UI/UX
- [ ] Skeleton loaders en vez de spinners (EventList, EventDetail)
- [ ] Empty states con iconos e indicaciones claras
- [ ] Paginacion visual en listado de eventos
- [ ] Toast de aviso cuando el token JWT expira
- [ ] Revocar `URL.createObjectURL` en EventCreate (memory leak)

### 3.3 Accesibilidad
- [ ] Agregar `aria-label` y `aria-expanded` en Navbar mobile
- [ ] Keyboard navigation en menu mobile
- [ ] Verificar contraste WCAG AA (lime-400 sobre dark-900)
- [ ] Agregar `type="button"` a botones que no son submit

### 3.4 Codigo
- [ ] Extraer `SPORT_IMAGES` a archivo compartido (`src/utils/sportImages.js`)
- [ ] Extraer formateo de fechas a util reutilizable
- [ ] Comprimir imagenes antes de subir (client-side resize)

---

## Fase 4 — Infraestructura (Prioridad baja)

### 4.1 Docker
- [ ] Crear `docker-compose.prod.yml` con builds optimizados
- [ ] Frontend: multi-stage build (build + nginx) en vez de `npm run dev`
- [ ] Backend: eliminar `--reload` del Dockerfile de produccion
- [ ] Agregar `HEALTHCHECK` a ambos Dockerfiles
- [ ] Crear usuario no-root en contenedores
- [ ] Crear `.dockerignore` para frontend y backend
- [ ] Mover credenciales de BD a variables de entorno (no hardcodear en compose)

### 4.2 CI/CD
- [ ] GitHub Actions: lint + tests en cada push
- [ ] GitHub Actions: build Docker images en cada merge a main
- [ ] Pre-commit hooks (flake8, black, eslint)

### 4.3 Testing
- [ ] Tests unitarios para schemas (validaciones)
- [ ] Tests de integracion para endpoints (auth, events, inscriptions)
- [ ] Tests E2E con Playwright (registro, inscripcion, pago)
- [ ] Coverage minimo 80%

### 4.4 Monitoring
- [ ] Sentry para error tracking (backend + frontend)
- [ ] Logging centralizado con formato JSON
- [ ] Health check endpoint mejorado (verificar conexion BD)

---

## Fase 5 — Nice to have

- [ ] Notificaciones push (evento proximo, resultado publicado)
- [ ] Dashboard de administrador (estadisticas globales)
- [ ] Modo oscuro/claro toggle
- [ ] PWA con service worker para offline basico
- [ ] Internacionalizacion (i18n) ingles/espanol
- [ ] API rate limiting por usuario
- [ ] Soft delete en usuarios y eventos
- [ ] Enums en BD (SQLAlchemy Enum) en vez de strings para roles/status

---

## Orden recomendado

1. **Fase 1.2** — Eliminar `create_all`, crear migracion Alembic, logging
2. **Fase 2.1** — Editar evento, paginacion
3. **Fase 3.1** — Validacion formularios, confirmaciones
4. **Fase 1.1** — Email verification, refresh tokens
5. **Fase 2.2** — Perfil de usuario
6. **Fase 3.2** — Skeleton loaders, UX polish
7. **Fase 4.1** — Docker produccion
8. **Fase 4.3** — Tests
9. **Fase 5** — Extras segun tiempo disponible
