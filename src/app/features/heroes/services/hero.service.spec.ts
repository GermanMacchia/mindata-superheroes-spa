import { TestBed } from '@angular/core/testing';

import { HEROES_SEED } from '../data/heroes.seed';
import { HeroService } from './hero.service';

describe('HeroService', () => {
    let service: HeroService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(HeroService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should return a page of heroes from the seed', async () => {
        const result = await new Promise((resolve) => {
            service.getHeroes(0, 8).subscribe(resolve);
        });

        expect(result).toEqual({
            items: HEROES_SEED.slice(0, 8),
            total: HEROES_SEED.length,
            offset: 0,
            limit: 8,
        });
    });

    it('should filter heroes by a case-insensitive substring of the name', async () => {
        const result = await new Promise<{ items: { name: string }[] }>((resolve) => {
            service.getHeroes(0, 10, 'MAN').subscribe(resolve as never);
        });

        expect(result.items.map((h) => h.name)).toEqual([
            'Superman',
            'Batman',
            'Spider-Man',
            'Wonder Woman',
            'Iron Man',
            'Aquaman',
        ]);
    });

    it('should filter heroes by id', async () => {
        const result = await new Promise<{ items: { name: string }[] }>((resolve) => {
            service.getHeroes(0, 10, HEROES_SEED[0].id).subscribe(resolve as never);
        });

        expect(result.items.map((h) => h.name)).toEqual(['Superman']);
    });

    it('should filter heroes by universe', async () => {
        const result = await new Promise<{ items: { name: string }[] }>((resolve) => {
            service.getHeroes(0, 10, 'marvel').subscribe(resolve as never);
        });

        expect(result.items.map((h) => h.name)).toEqual([
            'Spider-Man',
            'Iron Man',
            'Hulk',
            'Captain America',
        ]);
    });

    it('should filter heroes by real name', async () => {
        const result = await new Promise<{ items: { name: string }[] }>((resolve) => {
            service.getHeroes(0, 10, 'clark kent').subscribe(resolve as never);
        });

        expect(result.items.map((h) => h.name)).toEqual(['Superman']);
    });

    it('should filter heroes by power', async () => {
        const result = await new Promise<{ items: { name: string }[] }>((resolve) => {
            service.getHeroes(0, 10, 'vuelo').subscribe(resolve as never);
        });

        expect(result.items.map((h) => h.name)).toEqual(['Superman', 'Wonder Woman']);
    });

    it('should create a hero and persist it in the collection', async () => {
        const payload = {
            name: 'Test Hero',
            history: 'A hero created for testing purposes.',
        };

        const created = await new Promise<{ id: string; name: string; createdAt: Date; updatedAt: Date }>(
            (resolve) => {
                service.createHero(payload).subscribe(resolve as never);
            },
        );

        expect(created.id).toBeTruthy();
        expect(created.name).toBe(payload.name);
        expect(created.createdAt).toBeInstanceOf(Date);
        expect(created.updatedAt).toBeInstanceOf(Date);

        const found = await new Promise((resolve) => {
            service.getHeroById(created.id).subscribe(resolve);
        });

        expect(found).toEqual(created);
    });

    it('should return a hero by id', async () => {
        const result = await new Promise((resolve) => {
            service.getHeroById(HEROES_SEED[0].id).subscribe(resolve);
        });

        expect(result).toEqual(HEROES_SEED[0]);
    });

    it('should return undefined when getting a hero by an unknown id', async () => {
        const result = await new Promise((resolve) => {
            service.getHeroById('unknown-id').subscribe(resolve);
        });

        expect(result).toBeUndefined();
    });

    it('should update a hero and persist the change', async () => {
        const target = HEROES_SEED[1];
        const payload = {
            name: 'Bruce Wayne Jr.',
            realName: target.realName,
            powers: target.powers,
            universe: target.universe,
            history: target.history,
            imageUrl: target.imageUrl,
        };

        const updated = await new Promise<{ id: string; name: string; updatedAt: Date }>((resolve) => {
            service.updateHero(target.id, payload).subscribe(resolve as never);
        });

        expect(updated.id).toBe(target.id);
        expect(updated.name).toBe('Bruce Wayne Jr.');
        expect(updated.updatedAt).toBeInstanceOf(Date);

        const found = await new Promise((resolve) => {
            service.getHeroById(target.id).subscribe(resolve);
        });

        expect(found).toEqual(updated);
    });

    it('should delete a hero from the collection', async () => {
        const target = HEROES_SEED[2];

        await new Promise((resolve) => {
            service.deleteHero(target.id).subscribe(resolve);
        });

        const found = await new Promise((resolve) => {
            service.getHeroById(target.id).subscribe(resolve);
        });

        expect(found).toBeUndefined();

        const page = await new Promise<{ total: number }>((resolve) => {
            service.getHeroes(0, HEROES_SEED.length).subscribe(resolve as never);
        });

        expect(page.total).toBe(HEROES_SEED.length - 1);
    });

    it('should detect an existing hero name case-insensitively', async () => {
        const result = await new Promise<boolean>((resolve) => {
            service.nameExists('  spider-man  ').subscribe(resolve);
        });

        expect(result).toBe(true);
    });

    it('should not detect a name that does not exist', async () => {
        const result = await new Promise<boolean>((resolve) => {
            service.nameExists('Spider-Woman').subscribe(resolve);
        });

        expect(result).toBe(false);
    });

    it('should exclude the given id when checking for an existing name', async () => {
        const result = await new Promise<boolean>((resolve) => {
            service.nameExists('Spider-Man', HEROES_SEED[2].id).subscribe(resolve);
        });

        expect(result).toBe(false);
    });

    it('should reject creating a hero with a duplicate name', async () => {
        await expect(
            new Promise((resolve, reject) => {
                service
                    .createHero({ name: 'Spider-Man', history: 'Otra historia' })
                    .subscribe({ next: resolve, error: reject });
            }),
        ).rejects.toThrow('Ya existe un héroe con ese nombre.');
    });

    it('should reject renaming a hero to a name already used by another hero', async () => {
        await expect(
            new Promise((resolve, reject) => {
                service
                    .updateHero(HEROES_SEED[0].id, { name: 'Batman', history: HEROES_SEED[0].history })
                    .subscribe({ next: resolve, error: reject });
            }),
        ).rejects.toThrow('Ya existe un héroe con ese nombre.');
    });

    it('should allow updating a hero while keeping its own name', async () => {
        const result = await new Promise((resolve, reject) => {
            service
                .updateHero(HEROES_SEED[2].id, { name: 'Spider-Man', history: 'Historia actualizada' })
                .subscribe({ next: resolve, error: reject });
        });

        expect((result as { history: string }).history).toBe('Historia actualizada');
    });
});
