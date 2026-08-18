# Mindata-Superheroes-SPA

Aplicación SPA de mantenimiento (CRUD) de súper héroes, desarrollada como prueba técnica para el proceso de Frontend Developer de Mindata.

## Idea inicial del proyecto

La aplicación permite registrar, consultar, filtrar, editar y eliminar súper héroes desde una interfaz paginada, sin depender de un backend real: toda la información se gestiona en memoria a través de un servicio Angular que expone un CRUD completo mediante programación reactiva (RxJS). El alta y la edición se resuelven en un modal (`HeroFormComponent` vía `MatDialog`), mientras que cada card navega a la ruta de detalle del héroe (`/heroe/:id`), donde se despliega su historia completa. Incluye además una pantalla de login (autenticación mock en memoria) que protege el acceso al mantenimiento de héroes mediante un `AuthGuard`, y un set de componentes reutilizables en `shared/` (cards, listas paginadas, buscador) para no repetir UI entre features.

El objetivo no es solo cumplir el checklist funcional, sino demostrar:

- Un buen modelo de datos.
- Separación clara de responsabilidades (servicio / componentes / modelos).
- Uso de programación reactiva de punta a punta (Observables y signals).
- Código testeado (cobertura ≥ 80%) y desarrollado bajo TDD.
- Un historial de Git ordenado, con ramas y commits descriptivos.

## Stack tecnológico

| Tecnología       | Versión                          | Motivo                                                                                                                                            |
| ---------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Angular          | **21.x (LTS)**                   | Última versión de Angular en fase de Long Term Support al momento de arrancar el proyecto (Angular 22 aún está en fase de soporte activo, no LTS) |
| Angular Material | **21.x (LTS)**                   | Alineado a la misma major que Angular, para garantizar compatibilidad total                                                                       |
| Angular CDK      | 21.x                             | Utilidades de layout, overlay (diálogos) y accesibilidad, base de Angular Material                                                                |
| RxJS             | ^7.4.0                           | Programación reactiva en el servicio y en los componentes                                                                                         |
| TypeScript       | Última compatible con Angular 21 | Tipado estricto del modelo de datos                                                                                                               |
| Jasmine / Karma  | Incluidos en Angular CLI         | Testing unitario                                                                                                                                  |
| Docker + Nginx   | —                                | Contenedorización y servido del build de producción                                                                                               |

## Arquitectura del proyecto

Arquitectura por features (screaming architecture) con capas transversales en `core/`, separando el dominio (modelos y servicio) de la presentación (componentes):

![Arquitectura del proyecto](docs/arquitectura.svg)

### Estructura de carpetas

```
src/app/
├── core/
│   ├── interceptors/
│   │   └── loading.interceptor.ts
│   ├── guards/
│   │   └── auth.guard.ts
│   ├── directives/
│   │   └── uppercase.directive.ts
│   ├── models/
│   │   └── paged-result.model.ts
│   └── services/
│       ├── mock-api.service.ts       # simula una API paginada (sin backend real)
│       ├── mock-api.service.spec.ts
│       ├── loading.service.ts        # signal booleano de loading global
│       └── loading.service.spec.ts
├── features/
│   ├── auth/
│   │   ├── login/
│   │   │   ├── login.component.ts
│   │   │   └── login.component.spec.ts
│   │   └── services/
│   │       └── auth.service.ts
│   └── heroes/
│       ├── models/
│       │   └── super-hero.model.ts
│       ├── services/
│       │   ├── hero.service.ts
│       │   └── hero.service.spec.ts
│       ├── data/
│       │   └── heroes.seed.ts
│       ├── hero-list/
│       │   ├── hero-list.component.ts
│       │   └── hero-list.component.spec.ts
│       ├── hero-detail/
│       │   ├── hero-detail.component.ts
│       │   └── hero-detail.component.spec.ts
│       └── hero-form/
│           ├── hero-form.component.ts       # se abre vía MatDialog, no es ruta
│           └── hero-form.component.spec.ts
├── shared/
│   ├── components/
│   │   ├── card/
│   │   │   ├── card.component.ts
│   │   │   └── card.component.spec.ts
│   │   ├── header/
│   │   │   ├── header.component.ts
│   │   │   └── header.component.spec.ts
│   │   ├── confirm-dialog/
│   │   │   ├── confirm-dialog.component.ts
│   │   │   └── confirm-dialog.component.spec.ts
│   │   ├── paginated-list/
│   │   │   ├── paginated-list.component.ts
│   │   │   └── paginated-list.component.spec.ts
│   │   ├── search-input/
│   │   │   ├── search-input.component.ts
│   │   │   └── search-input.component.spec.ts
│   │   └── empty-state/
│   │       ├── empty-state.component.ts
│   │       └── empty-state.component.spec.ts
│   └── pipes/
│       └── (pipes reutilizables, si surgen)
└── app.routes.ts
```

**Regla de dependencia:** los componentes de `features/heroes` solo conocen al `HeroService` y al modelo `SuperHero`; nunca acceden directamente al seed de datos. `core/` contiene piezas transversales (interceptor, guard, directiva, y ahora el `MockApiService` + `PagedResult<T>`) que no dependen de ninguna feature. `shared/` contiene componentes de presentación puros (cards, listas paginadas genéricas, buscador, diálogo de confirmación) sin lógica de negocio — reciben datos por `@Input()` y emiten eventos por `@Output()`, para poder reutilizarse tanto en `heroes` como en cualquier feature futura.

**Paginación server-driven:** `MockApiService` (`core/services/`) funciona como un backend en memoria. Guarda los datos en colecciones nombradas y expone `paginate<T>(resource, offset, limit): Observable<PagedResult<T>>`, que devuelve `{ items, total, offset, limit }` — la misma forma que devolvería un endpoint REST paginado real. `HeroService` siembra `HEROES_SEED` bajo el nombre `'heroes'` una sola vez y expone `getHeroes(offset, limit)`, que delega en `MockApiService.paginate()`.

`HeroListComponent` guarda `pageIndex`, `pageSize`, `heroes` y `total` como signals. `fetchData()` calcula el `offset` a partir de la página actual, pide los datos y vuelca el resultado en `heroes`/`total`. `PaginatedListComponent` es puramente presentacional: recibe `total`/`pageIndex`/`pageSize`, muestra el paginador de Material, y emite `pageChange` cuando el usuario cambia de página — el listado en sí lo arma quien lo usa, proyectando contenido con `<ng-content>`.

**Loading global:** `LoadingService` (`core/services/`) expone un signal booleano `isLoading` con `start()`/`stop()`. `withLoadingInterceptor` (`core/interceptors/loading.interceptor.ts`) es un operador de RxJS que se incluye en el pipe de cualquier Observable async y llama `start()`/`stop()` automáticamente alrededor de él. `MockApiService.paginate()` lo usa junto con un `delay()` para simular latencia de red, haciendo que el spinner (`mat-progress-spinner` en overlay, en `App`) sea visible al cambiar de página.

Para que el booleano nunca quede pisado por un pedido viejo, `HeroListComponent` aplica debounce a los cambios de página (`debounceTime` sobre un `Subject`) antes de disparar `fetchData()`: clickear la paginación varias veces seguidas dispara un solo pedido, no uno por click.

### Convención de estilos

Los estilos propios de cada componente (`.scss`) siguen notación **BEM** (`bloque__elemento--modificador`), con el bloque nombrado según el selector del componente. Ejemplo, para `HeroCardComponent`:

```scss
.hero-card {
}
.hero-card__title {
}
.hero-card__actions {
}
.hero-card--selected {
}
```

Angular ya aísla los estilos de cada componente mediante encapsulación de vistas (por defecto), por lo que las colisiones de clases entre componentes no son un problema en sí mismo. Aun así, se adoptó BEM porque:

- Mejora la legibilidad del árbol de estilos: con solo ver una clase (`hero-card__actions`) se identifica a qué bloque pertenece y qué rol cumple.
- Evita anidamientos profundos de Sass que generan selectores con especificidad alta y difíciles de sobreescribir.
- Da consistencia si algún estilo termina siendo compartido o global, donde pueden existir colisiones.
- Mantiene el código preparado por si en algún caso puntual se desactiva la encapsulación (`ViewEncapsulation.None`), evitando depender de `::ng-deep`.

## Esquema de comunicación

### 1. Comunicación componente → servicio → estado (flujo de datos)

![Comunicación componente → servicio → estado](docs/comunicacion-componentes.svg)

### 2. Comunicación orientada a eventos entre componentes (alta / edición / borrado)

![Comunicación orientada a eventos](docs/comunicacion-eventos.svg)

### 3. Interceptor de loading (transversal a toda operación)

![Interceptor de loading](docs/comunicacion-Int-load.svg)

### 4. Login y protección de rutas con Guard

![Login y protección de rutas con Guard](docs/comunicacion-log-guard.svg)

El `AuthGuard` protege la ruta de `heroes` (`canActivate`); si no hay sesión activa, redirige a `/login`. La autenticación también es en memoria (usuario/clave hardcodeados: `admin` / `admin`), consistente con el resto del proyecto: sin backend real.

### Rutas

| Ruta          | Componente            | Protección  | Descripción                                                                                                 |
| ------------- | --------------------- | ----------- | ----------------------------------------------------------------------------------------------------------- |
| `/login`      | `LoginComponent`      | pública     | Autenticación mock en memoria                                                                               |
| `/heroes`     | `HeroListComponent`   | `AuthGuard` | Listado paginado/filtrado; alta y edición se abren como modal (`HeroFormComponent`), no navegan a otra ruta |
| `/heroe/:id`  | `HeroDetailComponent` | `AuthGuard` | Detalle del héroe (historia, poderes, universo); se llega haciendo click en la card desde el listado        |

### Resolver de detalle

La ruta `/heroe/:id` resuelve el héroe **antes** de activar el componente, con un `ResolveFn` (`hero.resolver.ts`) registrado en `app.routes.ts` (`resolve: { hero: heroResolver }`). Gracias a `withComponentInputBinding()` (en `app.config.ts`), el dato resuelto llega directo al `input.required<SuperHero>()` del componente, sin `ActivatedRoute` ni suscripciones manuales. Si el id no existe, redirige a `/heroes`.

Ejemplo, para ver el detalle de Superman:

```
/heroe/b1f3a2c0-1a2b-4c3d-9e4f-000000000001
```

## Referencia de diseño

Para acelerar el diseño de cards, listas paginadas, formularios y diálogos sin perder tiempo maquetando desde cero, se toma como referencia visual la documentación oficial de **Angular Material**:

**https://material.angular.io/components**

Al ser la fuente oficial de la librería que se instala con `ng add @angular/material`, los patrones (cards, tablas, formularios, dialogs) coinciden exactamente con los componentes reales del proyecto, sin riesgo de adaptar un lenguaje visual ajeno.

## Theme visual

Los colores de la app salen de la imagen de fondo del login (`superheroes-login.webp`). Se generó la paleta completa con el schematic oficial de Angular Material (`ng generate @angular/material:m3-theme`), pasándole como semilla el rojo y el dorado que se ven en esa imagen y apoyandose en la IA para estas desiciones estéticas.

## Modelo de datos

```typescript
export interface SuperHero {
    id: string; // UUID, generado con crypto.randomUUID() al crear el héroe
    name: string;
    realName?: string;
    powers?: string[];
    universe?: 'Marvel' | 'DC' | 'Otro';
    history: string;
    imageUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}
```

`history` es el contenido que despliega `HeroDetailComponent` en la ruta `/heroe/:id` — es campo obligatorio porque sin él la ruta de detalle no tendría nada propio que mostrar más allá de lo que ya se ve en la card.

## Datos iniciales (seed)

`heroes.seed.ts` (`features/heroes/data/`) precarga 10 héroes para que el CRUD tenga contenido desde el primer render, sin depender de un backend: 9 reales (Superman, Batman, Spider-Man, Wonder Woman, Iron Man, The Flash, Hulk, Captain America, Aquaman) y 1 inventado (Centella, sin `imageUrl`, para probar el fallback a `no-photo.webp`). `createdAt`/`updatedAt` se generan con la fecha actual al levantar la app.

Las imágenes (`imageUrl`) se toman de [akabab/superhero-api](https://akabab.github.io/superhero-api/), servidas vía jsDelivr. Para agregar un héroe nuevo al seed, el formato es `https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/<id>-<slug>.jpg`. Ejemplos:

- Thor: https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/659-thor.jpg
- Wolverine: https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/717-wolverine.jpg
- Deadpool: https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/213-deadpool.jpg
- Pantera Negra: https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/106-black-panther.jpg
- Viuda Negra: https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/107-black-widow.jpg
- Linterna Verde: https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/298-green-lantern.jpg
- Doctor Strange: https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/226-doctor-strange.jpg
- Daredevil: https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/201-daredevil.jpg
- Cyborg: https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/194-cyborg.jpg
- Flecha Verde: https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/294-green-arrow.jpg

## Instalación y ejecución

```bash
npm install
ng serve
```

## Tests y cobertura

```bash
ng test --coverage
```

Para chequear el porcentaje total mirar la primera fila.

| File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s |
| --------- | ------- | -------- | ------- | ------- | ----------------- |
| All files | 90.05   | 95.1     | 78.26   | 89.13   |

## Docker

Build multi-stage: compila con Node y sirve el resultado con Nginx (`nginx.conf` incluye el fallback a `index.html` que necesita el router de Angular para rutas como `/heroe/:id`).

```bash
docker build -t mindata-superheroes-spa .
docker run -p 8080:80 mindata-superheroes-spa
```

## Autor

German — Desarrollo para proceso de selección Frontend Developer, Mindata / RIU.
