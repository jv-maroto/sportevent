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
- [x] Eliminar `Base.metadata.create_all()` de `main.py` — usar solo Alembic
- [x] Crear migracion inicial de Alembic (`alembic.ini` + `alembic/versions/`)
- [x] Mover SECRET_KEY a variable de entorno obligatoria (sin valor por defecto)
- [x] Agregar logging estructurado en todos los routers
- [x] Configurar pool de conexiones para PostgreSQL (`pool_pre_ping`, `pool_size`)
- [x] Restringir CORS a metodos especificos (`GET, POST, PUT, DELETE`)

### 1.3 Stripe
- [x] Validar que claves Stripe estan configuradas antes de aceptar pagos
- [ ] Agregar endpoint para cancelar inscripcion (con reembolso via Stripe Refunds)
- [x] Indexar `stripe_session_id` en modelo Inscription para busquedas rapidas

---

## Fase 2 — Funcionalidad (Prioridad media)

### 2.1 Gestion de eventos
- [x] Editar evento (el organizador actualmente solo puede crear, publicar y finalizar)
- [x] Agregar campo `updated_at` a modelos Inscription y Result
- [x] Validar transiciones de status (draft -> published -> finished, no saltar pasos)
- [x] Paginacion en listado de eventos (`limit` + `offset` con page/page_size)

### 2.2 Perfil de usuario
- [x] Pagina de perfil: ver y editar nombre, telefono, email
- [x] Cambiar contrasena desde el perfil
- [x] Historial de inscripciones y resultados del usuario

### 2.3 Inscripciones
- [x] Permitir cancelar inscripcion (antes de que empiece el evento)
- [ ] Notificacion por email al confirmar inscripcion
- [x] Exportar listado de inscritos a CSV (para organizadores)

### 2.4 Resultados
- [x] Selector de participante por nombre (no por ID) en Dashboard
- [ ] Importacion masiva de resultados via CSV
- [ ] Estadisticas del evento (tiempo medio, mejor tiempo, participantes)

---

## Fase 3 — UX y frontend (Prioridad media)

### 3.1 Formularios
- [x] Validacion en tiempo real en Register y EventCreate (feedback visual)
- [x] Dialogo de confirmacion antes de publicar/finalizar evento
- [x] Debounce en busqueda de eventos (evitar peticiones por cada tecla)
- [x] Selector de deporte con opciones predefinidas (no texto libre)

### 3.2 UI/UX
- [x] Skeleton loaders en vez de spinners (EventList)
- [x] Empty states con iconos e indicaciones claras
- [x] Paginacion visual en listado de eventos
- [x] Toast de aviso cuando el token JWT expira
- [x] Revocar `URL.createObjectURL` en EventCreate (memory leak)

### 3.3 Accesibilidad
- [x] Agregar `aria-label` y `aria-expanded` en Navbar mobile
- [x] Keyboard navigation en menu mobile (role="button", onKeyDown)
- [ ] Verificar contraste WCAG AA (lime-400 sobre dark-900)
- [x] Agregar `type="button"` a botones que no son submit

### 3.4 Codigo
- [x] Extraer `SPORT_IMAGES` a archivo compartido (`src/utils/sportImages.js`)
- [x] Extraer formateo de fechas a util reutilizable (`src/utils/formatDate.js`)
- [ ] Comprimir imagenes antes de subir (client-side resize)

---

## Fase 4 — Infraestructura (Prioridad baja)

### 4.1 Docker
- [x] Crear `docker-compose.prod.yml` con builds optimizados
- [x] Frontend: multi-stage build (build + nginx) en vez de `npm run dev`
- [x] Backend: eliminar `--reload` del Dockerfile de produccion
- [x] Agregar `HEALTHCHECK` a ambos Dockerfiles
- [x] Crear usuario no-root en contenedores
- [x] Crear `.dockerignore` para frontend y backend
- [x] Mover credenciales de BD a variables de entorno (no hardcodear en compose)

### 4.2 CI/CD
- [x] GitHub Actions: lint + tests en cada push
- [ ] GitHub Actions: build Docker images en cada merge a main
- [ ] Pre-commit hooks (flake8, black, eslint)

### 4.3 Testing
- [x] Tests unitarios para schemas (validaciones)
- [x] Tests de integracion para endpoints (auth, events, inscriptions)
- [ ] Tests E2E con Playwright (registro, inscripcion, pago)
- [ ] Coverage minimo 80%

### 4.4 Monitoring
- [ ] Sentry para error tracking (backend + frontend)
- [ ] Logging centralizado con formato JSON
- [x] Health check endpoint mejorado (verificar conexion BD)

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
