import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Track } from '../models/track.model';
import { CreateTrackDto } from '../models/track.model';

/**
 * Service de gestion du stockage IndexedDB pour les pistes musicales
 * 
 * Ce service encapsule toute la logique d'interaction avec IndexedDB
 * pour stocker et récupérer les pistes et leurs fichiers audio.
 */
@Injectable({
    providedIn: 'root'
})
export class StorageService {
    private dbName = 'MusicStreamDB';
    private dbVersion = 1;
    private storeName = 'tracks';
    private db: IDBDatabase | null = null;
    private isBrowser: boolean;

    constructor(@Inject(PLATFORM_ID) platformId: Object) {
        this.isBrowser = isPlatformBrowser(platformId);

        // Initialiser la DB uniquement côté navigateur
        if (this.isBrowser) {
            this.initDatabase();
        }
    }

    /**
     * Initialise la base de données IndexedDB
     * Crée l'object store si nécessaire
     */
    private async initDatabase(): Promise<void> {
        if (!this.isBrowser) {
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = () => {
                console.error('Erreur lors de l\'ouverture de la base de données', request.error);
                reject(request.error);
            };

            request.onsuccess = () => {
                this.db = request.result;
                console.log('Base de données ouverte avec succès');
                resolve();
            };

            // Appelé seulement lors de la première création ou mise à jour de version
            request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
                const db = (event.target as IDBOpenDBRequest).result;

                // Créer l'object store s'il n'existe pas
                if (!db.objectStoreNames.contains(this.storeName)) {
                    const objectStore = db.createObjectStore(this.storeName, { keyPath: 'id' });

                    // Créer des index pour faciliter les requêtes
                    objectStore.createIndex('name', 'name', { unique: false });
                    objectStore.createIndex('artist', 'artist', { unique: false });
                    objectStore.createIndex('category', 'category', { unique: false });
                    objectStore.createIndex('dateAdded', 'dateAdded', { unique: false });

                    console.log('Object store créé avec succès');
                }
            };
        });
    }

    /**
     * Assure que la base de données est initialisée
     */
    private async ensureDbReady(): Promise<IDBDatabase> {
        if (!this.isBrowser) {
            throw new Error('IndexedDB not available in server-side rendering');
        }

        if (!this.db) {
            await this.initDatabase();
        }

        if (!this.db) {
            throw new Error('Failed to initialize IndexedDB');
        }

        return this.db;
    }

    /**
     * Génère un ID unique pour une nouvelle piste
     */
    private generateId(): string {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    }

    /**
     * Ajoute une nouvelle piste dans la base de données
     * @param trackDto - Données de la piste à créer
     * @returns La piste créée avec son ID
     */
    async createTrack(trackDto: CreateTrackDto): Promise<Track> {
        const db = await this.ensureDbReady();

        const track: Track = {
            id: this.generateId(),
            ...trackDto,
            dateAdded: new Date(),
            playCount: 0,
            duration: trackDto.duration || 0  // Durée fournie par le DTO
        };

        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.storeName], 'readwrite');
            const objectStore = transaction.objectStore(this.storeName);
            const request = objectStore.add(track);

            request.onsuccess = () => {
                console.log('Piste créée avec succès:', track.id);
                resolve(track);
            };

            request.onerror = () => {
                console.error('Erreur lors de la création de la piste', request.error);
                reject(request.error);
            };
        });
    }

    /**
     * Récupère toutes les pistes de la base de données
     * @returns Tableau de toutes les pistes
     */
    async getAllTracks(): Promise<Track[]> {
        const db = await this.ensureDbReady();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.storeName], 'readonly');
            const objectStore = transaction.objectStore(this.storeName);
            const request = objectStore.getAll();

            request.onsuccess = () => {
                const tracks = request.result as Track[];
                // Convertir les dates stockées en objets Date
                tracks.forEach(track => {
                    track.dateAdded = new Date(track.dateAdded);
                });
                resolve(tracks);
            };

            request.onerror = () => {
                console.error('Erreur lors de la récupération des pistes', request.error);
                reject(request.error);
            };
        });
    }

    /**
     * Récupère une piste par son ID
     * @param id - ID de la piste
     * @returns La piste trouvée ou null
     */
    async getTrackById(id: string): Promise<Track | null> {
        const db = await this.ensureDbReady();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.storeName], 'readonly');
            const objectStore = transaction.objectStore(this.storeName);
            const request = objectStore.get(id);

            request.onsuccess = () => {
                const track = request.result as Track | undefined;
                if (track) {
                    track.dateAdded = new Date(track.dateAdded);
                    resolve(track);
                } else {
                    resolve(null);
                }
            };

            request.onerror = () => {
                console.error('Erreur lors de la récupération de la piste', request.error);
                reject(request.error);
            };
        });
    }

    /**
     * Met à jour une piste existante
     * @param id - ID de la piste à mettre à jour
     * @param updates - Modifications à appliquer
     * @returns La piste mise à jour
     */
    async updateTrack(id: string, updates: Partial<Track>): Promise<Track> {
        const db = await this.ensureDbReady();
        const existingTrack = await this.getTrackById(id);

        if (!existingTrack) {
            throw new Error(`Piste avec l'ID ${id} non trouvée`);
        }

        const updatedTrack: Track = {
            ...existingTrack,
            ...updates,
            id // S'assurer que l'ID ne change pas
        };

        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.storeName], 'readwrite');
            const objectStore = transaction.objectStore(this.storeName);
            const request = objectStore.put(updatedTrack);

            request.onsuccess = () => {
                console.log('Piste mise à jour avec succès:', id);
                resolve(updatedTrack);
            };

            request.onerror = () => {
                console.error('Erreur lors de la mise à jour de la piste', request.error);
                reject(request.error);
            };
        });
    }

    /**
     * Supprime une piste de la base de données
     * @param id - ID de la piste à supprimer
     */
    async deleteTrack(id: string): Promise<void> {
        const db = await this.ensureDbReady();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.storeName], 'readwrite');
            const objectStore = transaction.objectStore(this.storeName);
            const request = objectStore.delete(id);

            request.onsuccess = () => {
                console.log('Piste supprimée avec succès:', id);
                resolve();
            };

            request.onerror = () => {
                console.error('Erreur lors de la suppression de la piste', request.error);
                reject(request.error);
            };
        });
    }

    /**
     * Incrémente le compteur de lectures d'une piste
     * @param id - ID de la piste
     */
    async incrementPlayCount(id: string): Promise<void> {
        const track = await this.getTrackById(id);
        if (track) {
            track.playCount = (track.playCount || 0) + 1;
            await this.updateTrack(id, { playCount: track.playCount });
        }
    }

    /**
     * Supprime toutes les pistes de la base de données
     * Utile pour le développement et les tests
     */
    async clearAllTracks(): Promise<void> {
        const db = await this.ensureDbReady();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.storeName], 'readwrite');
            const objectStore = transaction.objectStore(this.storeName);
            const request = objectStore.clear();

            request.onsuccess = () => {
                console.log('Toutes les pistes ont été supprimées');
                resolve();
            };

            request.onerror = () => {
                console.error('Erreur lors de la suppression des pistes', request.error);
                reject(request.error);
            };
        });
    }
}
