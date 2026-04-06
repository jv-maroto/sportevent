Levanta el entorno de desarrollo completo:

1. Verifica que Docker esta corriendo
2. Ejecuta `docker-compose up -d` para levantar PostgreSQL, backend y frontend
3. Espera a que los servicios esten listos
4. Muestra el estado de los contenedores con `docker-compose ps`
5. Informa las URLs:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - Docs API: http://localhost:8000/docs
