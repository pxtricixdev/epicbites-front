export interface TeamMembers {
  image: string,
  name: string,
  role: string,
  description: string
}

export const teamMembers : TeamMembers[] = [
  {
    image: "/images/front.jpg",
    name: "Sofía Martínez",
    role: "Programadora Frontend",
    description: "Sofía es la mente creativa detrás del diseño y la experiencia de usuario de nuestra web. Se asegura de que todo luzca increíble y sea fácil de navegar"
  },
  {
    image: "/images/programador.jpg",
    name: "Diego Ramírez",
    role: "Programador Backend",
    description: "Diego construye la infraestructura que hace posible Epic Bites, asegurando que la plataforma sea rápida, segura y eficiente"
  },
  {
    image: "/images/cliente.jpg",
    name: "Pablo Torres",
    role: "Atención al Cliente",
    description: "Pablo es quien responde a todas tus dudas y sugerencias, garantizando que tu experiencia con Epic Bites sea excelente"
  },
  {
    image: "/images/ceo.jpg",
    name: "Valeria Gómez",
    role: "CEO & Fundadora",
    description: "Valeria es la visión y el liderazgo detrás de Epic Bites, impulsando la misión de hacer la cocina accesible y divertida para todos"
  }
]
