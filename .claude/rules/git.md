---
description: Convenciones de git y workflow
globs: 
---

# Git Workflow

## Conventional Commits
Formato: `tipo: descripcion corta`

Tipos:
- `feat:` — Nueva funcionalidad
- `fix:` — Correccion de bug
- `refactor:` — Reestructuracion sin cambiar funcionalidad
- `docs:` — Documentacion
- `test:` — Tests
- `chore:` — Tareas de mantenimiento
- `perf:` — Mejoras de rendimiento
- `ci:` — Cambios en CI/CD
- `style:` — Formato, espacios, puntos y coma (no logica)

## Reglas
- Commits atomicos: un cambio logico por commit
- Mensajes en espanol o ingles, consistente dentro del proyecto
- No usar --no-verify ni --force push
- Revisar git diff antes de commitear
- PRs con descripcion clara y test plan
