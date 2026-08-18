import { SuperHero } from '../models/super-hero.model';

const today = new Date();

export const HEROES_SEED: SuperHero[] = [
    {
        id: 'b1f3a2c0-1a2b-4c3d-9e4f-000000000001',
        name: 'Superman',
        realName: 'Clark Kent',
        powers: ['Vuelo', 'Súper fuerza', 'Visión de calor', 'Invulnerabilidad'],
        universe: 'DC',
        history:
            'Último hijo de Krypton, enviado a la Tierra de bebé y criado en una granja de Kansas. Protege Metrópolis como el símbolo de esperanza más reconocido de DC Comics.',
        imageUrl:
            'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/644-superman.jpg',
        createdAt: today,
        updatedAt: today,
    },
    {
        id: 'b1f3a2c0-1a2b-4c3d-9e4f-000000000002',
        name: 'Batman',
        realName: 'Bruce Wayne',
        powers: ['Inteligencia deductiva', 'Artes marciales', 'Arsenal tecnológico'],
        universe: 'DC',
        history:
            'Millonario de Gotham City que, tras presenciar el asesinato de sus padres, se convierte en un vigilante enmascarado sin poderes sobrehumanos, solo entrenamiento y tecnología.',
        imageUrl:
            'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/70-batman.jpg',
        createdAt: today,
        updatedAt: today,
    },
    {
        id: 'b1f3a2c0-1a2b-4c3d-9e4f-000000000003',
        name: 'Spider-Man',
        realName: 'Peter Parker',
        powers: ['Agilidad arácnida', 'Sentido arácnido', 'Lanzatelarañas', 'Fuerza sobrehumana'],
        universe: 'Marvel',
        history:
            'Estudiante de secundaria de Queens mordido por una araña radiactiva. Balancea su vida como superhéroe con las responsabilidades de un adolescente común.',
        imageUrl:
            'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/620-spider-man.jpg',
        createdAt: today,
        updatedAt: today,
    },
    {
        id: 'b1f3a2c0-1a2b-4c3d-9e4f-000000000004',
        name: 'Wonder Woman',
        realName: 'Diana Prince',
        powers: ['Súper fuerza', 'Lazo de la verdad', 'Combate cuerpo a cuerpo', 'Vuelo'],
        universe: 'DC',
        history:
            'Princesa amazona de Themyscira, hija de Hipólita, que llega al mundo del hombre para luchar por la paz y la justicia como una de las fundadoras de la Liga de la Justicia.',
        imageUrl:
            'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/720-wonder-woman.jpg',
        createdAt: today,
        updatedAt: today,
    },
    {
        id: 'b1f3a2c0-1a2b-4c3d-9e4f-000000000005',
        name: 'Iron Man',
        realName: 'Tony Stark',
        powers: ['Traje de combate motorizado', 'Genio tecnológico', 'Repulsores'],
        universe: 'Marvel',
        history:
            'Multimillonario industrial e ingeniero que construye una armadura motorizada para escapar del cautiverio y luego la perfecciona para proteger al mundo como Iron Man.',
        imageUrl:
            'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/346-iron-man.jpg',
        createdAt: today,
        updatedAt: today,
    },
    {
        id: 'b1f3a2c0-1a2b-4c3d-9e4f-000000000006',
        name: 'The Flash',
        realName: 'Barry Allen',
        powers: ['Súper velocidad', 'Fuerza de velocidad', 'Regeneración acelerada'],
        universe: 'DC',
        history:
            'Investigador forense de Central City que, alcanzado por un rayo y bañado en químicos, obtiene la capacidad de moverse a velocidades sobrehumanas como el hombre más rápido con vida.',
        imageUrl:
            'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/263-flash.jpg',
        createdAt: today,
        updatedAt: today,
    },
    {
        id: 'b1f3a2c0-1a2b-4c3d-9e4f-000000000007',
        name: 'Hulk',
        realName: 'Bruce Banner',
        powers: ['Fuerza descomunal', 'Regeneración', 'Resistencia extrema'],
        universe: 'Marvel',
        history:
            'Físico brillante expuesto a radiación gamma que lo transforma en una criatura de fuerza descomunal cada vez que su ira se descontrola.',
        imageUrl:
            'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/332-hulk.jpg',
        createdAt: today,
        updatedAt: today,
    },
    {
        id: 'b1f3a2c0-1a2b-4c3d-9e4f-000000000008',
        name: 'Captain America',
        realName: 'Steve Rogers',
        powers: ['Fuerza y agilidad mejoradas', 'Escudo de vibranium', 'Estratega militar'],
        universe: 'Marvel',
        history:
            'Soldado de la Segunda Guerra Mundial transformado por el suero del supersoldado, símbolo de liderazgo y sacrificio entre los Vengadores.',
        imageUrl:
            'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/149-captain-america.jpg',
        createdAt: today,
        updatedAt: today,
    },
    {
        id: 'b1f3a2c0-1a2b-4c3d-9e4f-000000000009',
        name: 'Aquaman',
        realName: 'Arthur Curry',
        powers: ['Control de los océanos', 'Súper fuerza', 'Comunicación con la vida marina'],
        universe: 'DC',
        history:
            'Hijo de un faro y una reina atlante, heredero legítimo del trono de Atlantis, capaz de sobrevivir en las profundidades y proteger tanto la superficie como el mar.',
        imageUrl:
            'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/38-aquaman.jpg',
        createdAt: today,
        updatedAt: today,
    },
    {
        id: 'b1f3a2c0-1a2b-4c3d-9e4f-000000000010',
        name: 'Centella',
        realName: 'Martina Ríos',
        powers: ['Control eléctrico', 'Súper velocidad de reflejos', 'Escudos de energía'],
        universe: 'Otro',
        history:
            'Ingeniera eléctrica de Rosario que, tras un accidente en la subestación donde trabajaba, quedó conectada a la red eléctrica de la ciudad y ahora la protege absorbiendo y redirigiendo cualquier sobrecarga que la amenace.',
        createdAt: today,
        updatedAt: today,
    },
];
