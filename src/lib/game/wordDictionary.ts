type WordItem = {
    word: string;
    group: string;
};

export const BIBLIA: WordItem[] = [
    // personajes
    { word: "Moisés", group: "personaje" },
    { word: "Abraham", group: "personaje" },
    { word: "Isaac", group: "personaje" },
    { word: "Jacob", group: "personaje" },
    { word: "José", group: "personaje" },
    { word: "David", group: "personaje" },
    { word: "Salomón", group: "personaje" },
    { word: "Elías", group: "personaje" },
    { word: "Eliseo", group: "personaje" },
    { word: "Noé", group: "personaje" },
    { word: "Job", group: "personaje" },
    { word: "Daniel", group: "personaje" },
    { word: "Sansón", group: "personaje" },
    { word: "Samuel", group: "personaje" },

    // apóstoles
    { word: "Pedro", group: "apostol" },
    { word: "Pablo", group: "apostol" },
    { word: "Juan", group: "apostol" },
    { word: "Mateo", group: "apostol" },
    { word: "Tomás", group: "apostol" },

    // figuras clave
    { word: "Jesús", group: "figura" },
    { word: "María", group: "figura" },
    { word: "Adán", group: "figura" },
    { word: "Eva", group: "figura" },

    // lugares
    { word: "Belén", group: "lugar" },
    { word: "Jerusalén", group: "lugar" },
    { word: "Nazaret", group: "lugar" },
    { word: "Galilea", group: "lugar" },
    { word: "Samaria", group: "lugar" },
    { word: "Egipto", group: "lugar" },
    { word: "Sinaí", group: "lugar" },
    { word: "Edén", group: "lugar" },

    // objetos / símbolos
    { word: "Arca", group: "objeto" },
    { word: "Cruz", group: "objeto" },
    { word: "Tabla", group: "objeto" },
    { word: "Templo", group: "objeto" },
    { word: "Corona", group: "objeto" },
    { word: "Espada", group: "objeto" },

    // conceptos
    { word: "Fe", group: "concepto" },
    { word: "Pecado", group: "concepto" },
    { word: "Perdón", group: "concepto" },
    { word: "Salvación", group: "concepto" },
    { word: "Milagro", group: "concepto" },
    { word: "Parábola", group: "concepto" },
    { word: "Profecía", group: "concepto" },

    // eventos / entorno
    { word: "Diluvio", group: "evento" },
    { word: "Éxodo", group: "evento" },
    { word: "Resurrección", group: "evento" },

    { word: "Cielo", group: "espiritual" },
    { word: "Infierno", group: "espiritual" },
    { word: "Ángel", group: "espiritual" },
    { word: "Demonio", group: "espiritual" },

    { word: "Desierto", group: "entorno" },
    { word: "Mar", group: "entorno" }
];

export const NATURALEZA: WordItem[] = [
    // agua
    { word: "Mar", group: "agua" },
    { word: "Océano", group: "agua" },
    { word: "Río", group: "agua" },
    { word: "Lago", group: "agua" },
    { word: "Cascada", group: "agua" },

    // clima
    { word: "Lluvia", group: "clima" },
    { word: "Tormenta", group: "clima" },
    { word: "Viento", group: "clima" },
    { word: "Nube", group: "clima" },
    { word: "Nieve", group: "clima" },

    // terreno
    { word: "Montaña", group: "relieve" },
    { word: "Colina", group: "relieve" },
    { word: "Valle", group: "relieve" },
    { word: "Volcán", group: "relieve" },
    { word: "Isla", group: "relieve" },

    // ecosistemas
    { word: "Bosque", group: "ecosistema" },
    { word: "Selva", group: "ecosistema" },
    { word: "Desierto", group: "ecosistema" },
    { word: "Sabana", group: "ecosistema" },

    // flora
    { word: "Árbol", group: "flora" },
    { word: "Flor", group: "flora" },
    { word: "Planta", group: "flora" },
    { word: "Palmera", group: "flora" },

    // fauna
    { word: "León", group: "animal" },
    { word: "Tigre", group: "animal" },
    { word: "Elefante", group: "animal" },
    { word: "Águila", group: "animal" },
    { word: "Pez", group: "animal" },

    // materiales
    { word: "Arena", group: "material" },
    { word: "Roca", group: "material" },
    { word: "Lava", group: "material" },

    // astro
    { word: "Sol", group: "astro" },
    { word: "Luna", group: "astro" },
    { word: "Estrella", group: "astro" }
];

export const DEPORTES: WordItem[] = [
    // deportes
    { word: "Fútbol", group: "deporte" },
    { word: "Básquet", group: "deporte" },
    { word: "Tenis", group: "deporte" },
    { word: "Golf", group: "deporte" },
    { word: "Boxeo", group: "deporte" },
    { word: "Rugby", group: "deporte" },
    { word: "Hockey", group: "deporte" },

    // disciplinas
    { word: "Natación", group: "disciplina" },
    { word: "Ciclismo", group: "disciplina" },
    { word: "Atletismo", group: "disciplina" },

    // acciones
    { word: "Correr", group: "accion" },
    { word: "Saltar", group: "accion" },
    { word: "Lanzar", group: "accion" },

    // objetos
    { word: "Pelota", group: "objeto" },
    { word: "Raqueta", group: "objeto" },
    { word: "Guante", group: "objeto" },
    { word: "Arco", group: "objeto" },
    { word: "Red", group: "objeto" },

    // conceptos
    { word: "Gol", group: "concepto" },
    { word: "Punto", group: "concepto" },
    { word: "Victoria", group: "concepto" },
    { word: "Derrota", group: "concepto" },

    // premios
    { word: "Medalla", group: "premio" },
    { word: "Trofeo", group: "premio" },

    // entorno
    { word: "Cancha", group: "lugar" },
    { word: "Estadio", group: "lugar" }
];

export const GENERAL: WordItem[] = [
    { word: "Animales", group: "categoria" },
    { word: "Países", group: "categoria" },
    { word: "Comidas", group: "categoria" },
    { word: "Películas", group: "categoria" },

    { word: "Rojo", group: "color" },
    { word: "Azul", group: "color" },
    { word: "Verde", group: "color" },

    { word: "Doctor", group: "profesion" },
    { word: "Ingeniero", group: "profesion" },
    { word: "Profesor", group: "profesion" },

    { word: "Auto", group: "vehiculo" },
    { word: "Avión", group: "vehiculo" },
    { word: "Barco", group: "vehiculo" },

    { word: "Nike", group: "marca" },
    { word: "Apple", group: "marca" },

    { word: "Ciudad", group: "lugar" },
    { word: "Playa", group: "lugar" },

    { word: "Música", group: "arte" },
    { word: "Pintura", group: "arte" },

    { word: "Planeta", group: "ciencia" },
    { word: "Energía", group: "ciencia" },

    { word: "Pasado", group: "tiempo" },
    { word: "Futuro", group: "tiempo" }
];

export const MATRIMONIOS: WordItem[] = [
    // personas
    { word: "Esposo", group: "persona" },
    { word: "Esposa", group: "persona" },
    { word: "Novio", group: "persona" },
    { word: "Novia", group: "persona" },
    { word: "Pareja", group: "persona" },
    { word: "Familia", group: "persona" },

    // eventos
    { word: "Boda", group: "evento" },
    { word: "Fiesta", group: "evento" },
    { word: "Aniversario", group: "evento" },
    { word: "Luna de Miel", group: "evento" },

    // objetos
    { word: "Anillo", group: "objeto" },
    { word: "Alianza", group: "objeto" },
    { word: "Votos", group: "objeto" },

    // conceptos
    { word: "Amor", group: "concepto" },
    { word: "Romance", group: "concepto" },
    { word: "Pasión", group: "concepto" },
    { word: "Fidelidad", group: "concepto" },
    { word: "Confianza", group: "concepto" },

    // acciones
    { word: "Beso", group: "accion" },
    { word: "Abrazo", group: "accion" },
    { word: "Unión", group: "accion" },
    { word: "Compromiso", group: "accion" },

    // lugares
    { word: "Iglesia", group: "lugar" },
    { word: "Hogar", group: "lugar" }
];
