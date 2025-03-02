<template>
    <svg 
      class="estrella-rating" 
      viewBox="0 0 50 50" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M25 5 L31.5 18.5 L46.5 20.5 L35.75 31 L38.5 46 L25 39 L11.5 46 L14.25 31 L3.5 20.5 L18.5 18.5 Z" 
        fill="#FFD700"
        stroke="#FFA500"
        stroke-width="1"
      />
    </svg>
  </template>

  
  <style lang="scss" scoped>
  .estrella-rating {
    width: 16px;
    height: 16px;
    vertical-align: middle;
    margin-right: 3px;
    filter: drop-shadow(0 0 1px rgba(255, 215, 0, 0.5));
    transition: transform 0.5s ease, filter 0.5s ease;
  }
  
  .estrella-rating:hover {
    transform: rotate(360deg);
    filter: drop-shadow(0 0 4px rgba(255, 215, 0, 1));
  }
  </style>
