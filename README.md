# Perfil — Fabrizio Panduro

Sitio personal publicado en https://FabrizioPanduro.github.io

## Cómo se publica
Cada push a `main` despliega automáticamente con GitHub Pages.

## Flujo de trabajo
- `main` protegida; todo cambio entra por pull request
- Una rama por cambio: `feature/*`, `fix/*`
- Mensajes de commit en imperativo, ≤ 50 caracteres

## Historial del curso
- **S02** — Sitio inicial, ramas y pull requests

### Reto 1: Pipeline rápido

- **Decisión:** Activé la caché que ya viene integrada en las acciones de Node y Docker para que el pipeline no tenga que descargar todo desde cero en cada ejecución.
- **Alternativas que evalué:** Pensé en configurar la caché a mano usando `actions/cache` (te da más control, pero ensucia mucho el código) o usar las opciones nativas de `setup-node` y `build-push-action` (súper simple, literal un par de líneas extra).
- **Por qué elegí esta:** Me fui por lo más práctico. No valía la pena complicar el archivo `ci-cd.yml` cuando GitHub ya hace el trabajo pesado por ti con solo prender un interruptor en las acciones oficiales.
- **Fuentes consultadas:** 
  - [Documentación oficial de actions/setup-node sobre caché](https://github.com/actions/setup-node#caching-global-packages-data)
  - [Guía de caché GHA de Docker](https://docs.docker.com/build/ci/github-actions/cache/#github-cache)
- **Cómo lo verifiqué:** (https://github.com/FabrizioPanduro/FabrizioPanduro.github.io/actions/runs/37997757087)
- **Qué no me funcionó:** Al principio, las imágenes de Docker seguían tardando lo mismo en construirse. Me di cuenta de que no bastaba con decirle a Docker de dónde leer la caché (`cache-from`), también tenía que decirle explícitamente que la guardara al terminar agregando `cache-to: type=gha,mode=max`.

### Reto 6: El pipeline se explica solo

- **Decisión:** Hice que los resultados del escaneo de Trivy se guarden en archivos de texto y se inyecten directamente en la pantalla de resumen del PR en GitHub. También puse el escudito (badge) del estado del pipeline arriba en el README.
- **Alternativas que evalué:** Dudé entre buscar alguna acción creada por la comunidad que formatee los resultados para que se vean bonitos (se ve mejor, pero es riesgoso meter código de terceros) o usar comandos básicos de consola para mandar el texto plano al resumen de GitHub (`$GITHUB_STEP_SUMMARY`).
- **Por qué elegí esta:** Preferí usar comandos básicos de consola. Es mucho más seguro, no dependo de plugins de gente desconocida y cumple perfecto la idea de que cualquiera pueda ver si la imagen tiene problemas de seguridad antes de dar el OK.
- **Fuentes consultadas:** 
  - [La guía de GitHub sobre resúmenes de trabajo (Step Summaries)](https://docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions#adding-a-job-summary)
  - [Documentación de Trivy sobre salidas y formatos](https://aquasecurity.github.io/trivy/v0.49/docs/references/configuration/cli/trivy_image/)
- **Cómo lo verifiqué:** https://github.com/FabrizioPanduro/FabrizioPanduro.github.io/actions/runs/37997757087
- **Qué no me funcionó:** Como Trivy estaba configurado para fallar automáticamente si encontraba vulnerabilidades críticas, el job se cancelaba de golpe y nunca llegaba al paso de imprimir el resumen. Tuve que agregar un `if: always()` para obligar a GitHub a mostrar el reporte pase lo que pase.