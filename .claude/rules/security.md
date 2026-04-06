---
description: Checklist de seguridad para todo el proyecto
globs: **/*.{py,js,jsx,ts,tsx}
---

# Seguridad

## Checklist antes de cada cambio
- No hay secrets hardcodeados (API keys, passwords, tokens)
- Inputs validados: Pydantic en backend, formularios controlados en frontend
- Queries parametrizadas (SQLAlchemy ORM, nunca SQL raw sin bindparams)
- CORS solo para origenes permitidos (config.py)
- JWT con expiracion, verificado en cada endpoint protegido

## Backend
- Rate limiting en endpoints sensibles (login, registro)
- No exponer stack traces en produccion (debug=False)
- Stripe webhooks verificados con firma del evento
- File uploads: validar tipo MIME, tamano maximo, sanitizar nombre

## Frontend
- No almacenar tokens en localStorage si hay alternativa (httpOnly cookies)
- Sanitizar contenido dinamico para prevenir XSS
- CSRF protection en formularios
- No exponer VITE_* variables sensibles en el bundle

## Git
- .env en .gitignore (nunca commitear)
- No commitear .env.example con valores reales
- Revisar diff antes de push por secrets accidentales
