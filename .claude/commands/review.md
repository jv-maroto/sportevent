Haz un code review completo de los cambios recientes:

1. Ejecuta `git diff` para ver cambios no commiteados
2. Si no hay cambios pendientes, revisa el ultimo commit con `git diff HEAD~1`
3. Analiza los cambios buscando:
   - Problemas de seguridad (SQL injection, XSS, secrets expuestos, JWT mal usado)
   - Errores logicos o bugs potenciales
   - Violaciones de las convenciones del proyecto (ver CLAUDE.md)
   - Codigo duplicado o innecesariamente complejo
   - Falta de validacion de inputs
4. Presenta los hallazgos organizados por severidad (critico, importante, menor)
5. Sugiere correcciones concretas para cada problema encontrado
