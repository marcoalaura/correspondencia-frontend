# Plantillas Frontend

## Compilación

Puedes hacer una compilación rápida de la imagen con el comando:

```sh
docker build -t plantillas-frontend .
```

## Uso de la imagen

La imagen necesita la siguiente variable de entorno:

* `BACKEND_URL` : la URL del backend de plantillas

y expone adentro del contenedor el puerto **80**.

Por ejemplo puedes levantar una instancia del frontend con el siguiente comando:

```sh
docker run -d -e BACKEND_URL=http://192.168.9.1:5001 -p 5000:80 plantillas-frontend
```

en este ejemplo estaríamos asumiendo que nuestro backend esté arriba y corriendo
sobre la url **http://192.168.9.1:5001** y estamos exponiendo el puerto **5000**.

Una vez ejecutado el comando, podrás visitar el frontend de plantillas desde la url http://127.0.0.1:5000.
