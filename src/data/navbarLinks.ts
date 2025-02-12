import { House, UtensilsCrossed, BookHeart, User } from "lucide-vue-next";
import type { Component } from "vue";

export interface navbarLinks {
  text: string;
  url: string;
  icon?: Component;
}
export const navbarLinks = [
  {
    icon: House,
    text: 'Home',
    url: '/',
  },
  {
    icon: UtensilsCrossed,
    text: 'Recetas',
    url: '/recetas',
  },
  {
    icon: BookHeart,
    text: 'Favoritos',
    url: '/favoritos',
  },
  {
    icon: User,
    text: 'Perfil',
    url: '/perfil',
  },
]
