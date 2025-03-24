
# 🥗🥞 Epic Bites - Aplicación Web de recetas

Epic Bites es una plataforma web pensada y dedicada a los amantes de la cocina y a la gente que quiera iniciarse en ella. 
La plataforma permite a los usuarios explorar un amplio catálogo de recetas, contribuir con sus propias creaciones e interactuar mediante una sección de comentarios. Con una interfaz fácil de usar y adaptada a todos los dispositivos, Epic Bites hace que cocinar sea una experiencia colaborativa y enriquecedora.

## 🚀 Objetivos y funcionalidades

- **Facilitar el acceso a recetas variadas**: Ofrecer una amplia variedad de recetas de diferentes tipos de cocina, para que los usuarios encuentren fácilmente lo que buscan, ya sea por ingredientes, dificultad o diferentes categorías.

- **Fomentar la interacción social:**:  Permitir que los usuarios compartan sus propias recetas, comenten y valoren las de otros, creando una comunidad activa en torno a la cocina.

- **Promover una cocina saludable y sostenible**:  Incluir opciones de recetas saludables, vegetarianas, veganas, sin gluten, etc.

- **Crear una plataforma accesible:**: Asegurar que la aplicación sea fácil de usar para todos los públicos, desde novatos hasta cocineros experimentados, con un diseño limpio e intuitivo.


## 🛠️ Tecnologías y Herramientas Utilizadas

### Framework y librerías:
- **VUE3** y **CSS3** (con preprocesador **SASS**).
- **Pinia**: Para la gestión del estado global de la aplicación, manteniendo el flujo de datos organizado y eficiente.
- **PrimeVue**: Para el uso de componentes como los formularios.
- **VeeValidate y Zod**: Para validación de formularios (login y registro).

### Herramientas:
- **Git y GitHub:** Para control de versiones con metodología **GitFlow**.
- **Prettier y ESLint**: Para mantener un código limpio y consistente.

### Infraestructura y despliegue:
- **AWS EC2**: Utilizamos instancias EC2 para alojar nuestra aplicación de manera escalable en la nube, asegurando alta disponibilidad y rendimiento.
- **Kubernetes y Docker**: Gestionamos la contenerización y despliegue de la aplicación utilizando Kubernetes, permitiendo la orquestación eficiente de los contenedores Docker.

## 🖥️ Mockups del Proyecto

Aquí tienes una vista previa de cómo luce **Epic Bites**:

### Versión móvil
<img src="public\images\mocks\mock1.png" alt="Versión móvil" width="60%">

### Versión escritorio

  <img src="public\images\mocks\mock2.png" alt="Escritorio 1" width="60%" />
  <img src="public\images\mocks\mock3.png" alt="Escritorio 2" width="60%" />
  <img src="public\images\mocks\mock4.png" alt="Escritorio 3" width="60%" />


## 🛠️ Instalación y Configuración

Sigue estos pasos para iniciar el proyecto en tu máquina local:

### 1️⃣ Clonar el repositorio
```bash
    git clone https://github.com/pxtricixdev/epicbites-front.git
```
    
### 2️⃣ Instalar las dependencias
```bash
    cd epicbites-front
    npm install
```

### 3️⃣ Desarrollar con Vite
```bash
    npm run dev
```


### 📂 Estructura del Proyecto

```plaintext
EPIC-Bites/
├── .vscode/                        # Configuración de Visual Studio Code
├── public/                         # Archivos públicos accesibles (imágenes, favicon, etc.)
├── src/                            # Archivos fuente de la aplicación
│   ├── assets/styles               # Archivos scss de la aplicación
│   ├── components/                 # Componentes reutilizables 
│   ├── layout/                     # Layouts de la aplicación
│   ├── data/                       # Archivos de datos de la aplicación
│   ├── pages/                      # Páginas de la aplicación
│   ├── stores/                     # Gestión del estado (Pinia)
│   ├── router/                     # Gestión de las rutas de la aplicación
│   ├── App.vue                     # Componente raíz de Vue
│   └── main.ts                     # Archivo principal para inicializar Vue y otras configuraciones
├── .editorconfig                   # Configuración de formato de código
├── .gitattributes                  # Configuración para atributos específicos de Git
├── .gitignore                      # Archivos y carpetas ignorados por Git
├── .prettierrc.json                # Configuración de Prettier
├── Dockerfile                      # Configuración para contenerizar la aplicación con Docker
├── epicbites-web-deployment.yml    # Configuración de despliegue para Kubernetes (archivo general)
├── epicbites-web-deployment-https.yml  # Configuración de despliegue para Kubernetes (con HTTPS)
├── eslint.config.ts                # Configuración de ESLint para calidad del código
├── index.html                      # Index de la aplicación
├── package-lock.json               # Archivo de bloqueo de dependencias de npm
├── package.json                    # Dependencias y scripts del proyecto
├── README.md                       # Documentación del proyecto
├── tsconfig.app.json               # Configuración de TypeScript para la aplicación
├── tsconfig.json                   # Configuración global de TypeScript
├── tsconfig.node.json              # Configuración de TypeScript para Node.js
├── vite.config.ts                  # Configuración de Vite para el bundling y desarrollo
└── env.d.ts                        # Declaraciones de tipos globales para el entorno
