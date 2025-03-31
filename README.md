# Simulador de Planificación de Procesos (Serie, Round Robin y Lotes)

Este proyecto es una aplicación web desarrollada con **Python** y **Flask** que permite simular tres técnicas de planificación de procesos: **Procesamiento en Serie**, **Round Robin** y **Procesamiento por Lotes**.

## Tecnologías utilizadas

- **Lenguaje**: Python 3.12
- **Framework Backend**: Flask 2.3.3
- **Frontend**: HTML, CSS, JavaScript
- **Sistema Operativo de Desarrollo**: Windows 11
- **Procesador**: AMD Ryzen 5 5500U
- **Memoria RAM**: 12 GB

## Instalación y ejecución local

1. **Clona este repositorio**:

```bash
https://github.com/usuario/proyecto-simulador-planificacion.git
cd proyecto-simulador-planificacion
```

2. **Instala las dependencias**:

```bash
pip install -r requirements.txt
```

3. **Ejecuta la aplicación**:

```bash
python app.py
```

4. **Abre tu navegador** y accede a:

```
http://127.0.0.1:5000/
```

## Estructura del proyecto

```
/
|-- app.py                       # Servidor Flask y rutas principales
|-- /processing
|   |-- serial.py               # Lógica de planificación en serie
|   |-- roundrobin.py           # Lógica de planificación Round Robin
|-- /templates
|   |-- index.html              # Interfaz principal del simulador
|-- /static
|   |-- /css/style.css          # Estilos visuales
|   |-- /js/script.js           # Lógica frontend e interacción
|-- requirements.txt            # Dependencias necesarias
```


## Importaciones clave

```python
from flask import Flask, render_template, request, jsonify
from processing.serial import serial_processing
from processing.roundrobin import round_robin
```

Estas importaciones permiten levantar el servidor, recibir peticiones y ejecutar los algoritmos de planificación de procesos.


## Modos de simulación soportados

- **Procesamiento en Serie (FCFS)**: ejecuta procesos secuencialmente.
- **Round Robin**: gestiona procesos con reparto de tiempo (quantum).
- **Por Lotes**: agrupa procesos en lotes y los ejecuta usando Round Robin por lote.


## Consideraciones adicionales

- Los tiempos de llegada y ejecución deben ser valores positivos.
- El campo **quantum** es obligatorio para los modos Round Robin y por Lotes.
- El diagrama de Gantt se genera visualmente para facilitar la comprensión.




