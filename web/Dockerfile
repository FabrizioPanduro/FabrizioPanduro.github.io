# Usamos una imagen oficial de Nginx que corre sin privilegios de root (Reto 3)
FROM nginxinc/nginx-unprivileged:alpine

# Copiamos nuestra configuración personalizada de proxy
COPY web/nginx.conf /etc/nginx/conf.d/default.conf

# Copiamos todos tus archivos estáticos al servidor web
COPY index.html style.css libro-de-visitas.js Foto-Perfil-CV.jpeg /usr/share/nginx/html/

# Exponemos el puerto sin privilegios
EXPOSE 8080