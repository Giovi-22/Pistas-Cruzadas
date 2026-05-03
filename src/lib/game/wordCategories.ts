export interface WordSet {
  rows: string[];
  cols: string[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  sets: WordSet[];
}

export const WORD_CATEGORIES: Category[] = [
  {
    id: 'biblia',
    name: 'Biblia',
    icon: '📖',
    sets: [
      {
        rows: ["Moisés", "Abraham", "David", "Pedro", "María"],
        cols: ["Egipto", "Cruz", "Templo", "Arca", "Sinaí"]
      },
      {
        rows: ["Jesús", "Pablo", "Noé", "José", "Elías"],
        cols: ["Jerusalén", "Mar", "Desierto", "Cielo", "Tierra"]
      },
      {
        rows: ["Edén", "Gólgota", "Belén", "Galilea", "Samaria"],
        cols: ["Adán", "Eva", "Ángel", "Milagro", "Parábola"]
      }
    ]
  },
  {
    id: 'naturaleza',
    name: 'Naturaleza',
    icon: '🌿',
    sets: [
      {
        rows: ["Árbol", "Montaña", "Río", "Flor", "Bosque"],
        cols: ["Viento", "Sol", "Lluvia", "Nube", "Tierra"]
      },
      {
        rows: ["Océano", "Selva", "Desierto", "Volcán", "Isla"],
        cols: ["Pez", "Jaguar", "Arena", "Lava", "Palmera"]
      }
    ]
  },
  {
    id: 'deportes',
    name: 'Deportes',
    icon: '⚽',
    sets: [
      {
        rows: ["Fútbol", "Básquet", "Tenis", "Golf", "Boxeo"],
        cols: ["Pelota", "Aro", "Raqueta", "Hoyo", "Guante"]
      },
      {
        rows: ["Carrera", "Salto", "Nado", "Gimnasia", "Ciclismo"],
        cols: ["Meta", "Altura", "Agua", "Medalla", "Bicicleta"]
      }
    ]
  },
  {
    id: 'general',
    name: 'General',
    icon: '🎯',
    sets: [
      {
        rows: ["Animales", "Países", "Comidas", "Deportes", "Películas"],
        cols: ["Colores", "Profesiones", "Vehículos", "Marcas", "Lugares"]
      },
      {
        rows: ["Música", "Espacio", "Historia", "Ciencia", "Arte"],
        cols: ["Nota", "Planeta", "Pasado", "Laboratorio", "Pincel"]
      }
    ]
  },
  {
    id: 'matrimonios',
    name: 'Matrimonios',
    icon: '💍',
    sets: [
      {
        rows: ["Amor", "Anillo", "Boda", "Esposo", "Hogar"],
        cols: ["Compromiso", "Fiesta", "Pacto", "Esposa", "Familia"]
      },
      {
        rows: ["Beso", "Alianza", "Promesa", "Unión", "Pareja"],
        cols: ["Novio", "Novia", "Luna de Miel", "Iglesia", "Votos"]
      },
      {
        rows: ["Abrazo", "Aniversario", "Cariño", "Fidelidad", "Romance"],
        cols: ["Confianza", "Juntos", "Pasión", "Compañía", "Vida"]
      }
    ]
  }
];
