import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Track } from '../models/track.model';
import { CreateTrackDto, UpdateTrackDto } from '../models/track.model';
import { LoadingState } from '../models/loading-state.enum';
import { MusicCategory } from '../models/category.enum';
import { StorageService } from './storage.service';

/**
 * Service de gestion des pistes musicales
 * 
 * Ce service gère l'état des pistes et orchestre les opérations CRUD
 * en utilisant le StorageService pour la persistance.
 */
@Injectable({
    providedIn: 'root'
})
export class TrackService {
    // État de chargement
    private loadingStateSubject = new BehaviorSubject<LoadingState>(LoadingState.IDLE);
    public loadingState$ = this.loadingStateSubject.asObservable();

    // Liste des pistes
    private tracksSubject = new BehaviorSubject<Track[]>([]);
    public tracks$ = this.tracksSubject.asObservable();

    // Message d'erreur
    private errorMessageSubject = new BehaviorSubject<string | null>(null);
    public errorMessage$ = this.errorMessageSubject.asObservable();

    // Formats audio acceptés
    private readonly ACCEPTED_AUDIO_FORMATS = ['audio/mpeg', 'audio/wav', 'audio/ogg'];

    // Taille maximale du fichier (10 MB en octets)
    private readonly MAX_FILE_SIZE = 10 * 1024 * 1024;

    constructor(private storageService: StorageService) {
        this.loadTracks();
    }

    /**
     * Charge toutes les pistes depuis le stockage
     */
    async loadTracks(): Promise<void> {
        this.loadingStateSubject.next(LoadingState.LOADING);
        this.errorMessageSubject.next(null);

        try {
            const tracks = await this.storageService.getAllTracks();
            this.tracksSubject.next(tracks);
            this.loadingStateSubject.next(LoadingState.SUCCESS);
        } catch (error) {
            console.error('Erreur lors du chargement des pistes:', error);
            this.errorMessageSubject.next('Impossible de charger les pistes');
            this.loadingStateSubject.next(LoadingState.ERROR);
        }
    }

    /**
     * Valide un fichier audio
     * @param file - Fichier à valider
     * @returns Message d'erreur ou null si valide
     */
    validateAudioFile(file: File): string | null {
        // Vérifier le type MIME
        if (!this.ACCEPTED_AUDIO_FORMATS.includes(file.type)) {
            return 'Format de fichier non supporté. Utilisez MP3, WAV ou OGG.';
        }

        // Vérifier la taille
        if (file.size > this.MAX_FILE_SIZE) {
            return 'Le fichier est trop volumineux. Taille maximale: 10 MB.';
        }

        return null;
    }

    /**
     * Calcule la durée d'un fichier audio
     * @param file - Fichier audio
     * @returns Durée en secondes
     */
    async getAudioDuration(file: File): Promise<number> {
        return new Promise((resolve, reject) => {
            const audio = new Audio();
            const url = URL.createObjectURL(file);

            audio.addEventListener('loadedmetadata', () => {
                URL.revokeObjectURL(url);
                resolve(audio.duration);
            });

            audio.addEventListener('error', () => {
                URL.revokeObjectURL(url);
                reject(new Error('Impossible de lire le fichier audio'));
            });

            audio.src = url;
        });
    }

    /**
     * Valide un fichier image
     * @param file - Fichier image à valider
     * @returns Message d'erreur ou null si valide
     */
    validateImageFile(file: File): string | null {
        // Formats acceptés
        const acceptedFormats = ['image/jpeg', 'image/png', 'image/webp'];

        // Vérifier le type MIME
        if (!acceptedFormats.includes(file.type)) {
            return 'Format d\'image non supporté. Utilisez JPG, PNG ou WebP.';
        }

        // Taille maximale : 2 MB
        const maxSize = 2 * 1024 * 1024;
        if (file.size > maxSize) {
            return 'L\'image est trop volumineuse. Taille maximale: 2 MB.';
        }

        return null;
    }

    /**
     * Convertit un fichier image en Data URL (base64)
     * @param file - Fichier image
     * @returns Data URL de l'image
     */
    async convertImageToDataURL(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = () => {
                resolve(reader.result as string);
            };

            reader.onerror = () => {
                reject(new Error('Erreur lors de la lecture de l\'image'));
            };

            reader.readAsDataURL(file);
        });
    }

    /**
     * Crée une nouvelle piste
     * @param trackDto - Données de la piste
     * @returns La piste créée
     */
    async createTrack(trackDto: CreateTrackDto): Promise<Track> {
        this.loadingStateSubject.next(LoadingState.LOADING);
        this.errorMessageSubject.next(null);

        try {
            const track = await this.storageService.createTrack(trackDto);

            // Mettre à jour la liste des pistes
            const currentTracks = this.tracksSubject.value;
            this.tracksSubject.next([...currentTracks, track]);

            this.loadingStateSubject.next(LoadingState.SUCCESS);
            return track;
        } catch (error) {
            console.error('Erreur lors de la création de la piste:', error);
            this.errorMessageSubject.next('Impossible de créer la piste');
            this.loadingStateSubject.next(LoadingState.ERROR);
            throw error;
        }
    }

    /**
     * Récupère une piste par son ID
     * @param id - ID de la piste
     * @returns La piste ou null
     */
    async getTrackById(id: string): Promise<Track | null> {
        try {
            return await this.storageService.getTrackById(id);
        } catch (error) {
            console.error('Erreur lors de la récupération de la piste:', error);
            this.errorMessageSubject.next('Impossible de récupérer la piste');
            return null;
        }
    }

    /**
     * Met à jour une piste existante
     * @param id - ID de la piste
     * @param updates - Modifications à appliquer
     */
    async updateTrack(id: string, updates: UpdateTrackDto): Promise<void> {
        this.loadingStateSubject.next(LoadingState.LOADING);
        this.errorMessageSubject.next(null);

        try {
            const updatedTrack = await this.storageService.updateTrack(id, updates);

            // Mettre à jour la liste des pistes
            const currentTracks = this.tracksSubject.value;
            const index = currentTracks.findIndex(t => t.id === id);
            if (index !== -1) {
                currentTracks[index] = updatedTrack;
                this.tracksSubject.next([...currentTracks]);
            }

            this.loadingStateSubject.next(LoadingState.SUCCESS);
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la piste:', error);
            this.errorMessageSubject.next('Impossible de mettre à jour la piste');
            this.loadingStateSubject.next(LoadingState.ERROR);
            throw error;
        }
    }

    /**
     * Supprime une piste
     * @param id - ID de la piste à supprimer
     */
    async deleteTrack(id: string): Promise<void> {
        this.loadingStateSubject.next(LoadingState.LOADING);
        this.errorMessageSubject.next(null);

        try {
            await this.storageService.deleteTrack(id);

            // Mettre à jour la liste des pistes
            const currentTracks = this.tracksSubject.value;
            this.tracksSubject.next(currentTracks.filter(t => t.id !== id));

            this.loadingStateSubject.next(LoadingState.SUCCESS);
        } catch (error) {
            console.error('Erreur lors de la suppression de la piste:', error);
            this.errorMessageSubject.next('Impossible de supprimer la piste');
            this.loadingStateSubject.next(LoadingState.ERROR);
            throw error;
        }
    }

    /**
     * Recherche des pistes par nom ou artiste
     * @param searchTerm - Terme de recherche
     * @returns Pistes correspondantes
     */
    searchTracks(searchTerm: string): Track[] {
        const term = searchTerm.toLowerCase().trim();
        if (!term) {
            return this.tracksSubject.value;
        }

        return this.tracksSubject.value.filter(track =>
            track.name.toLowerCase().includes(term) ||
            track.artist.toLowerCase().includes(term)
        );
    }

    /**
     * Filtre les pistes par catégorie
     * @param category - Catégorie musicale
     * @returns Pistes de la catégorie
     */
    filterByCategory(category: MusicCategory): Track[] {
        return this.tracksSubject.value.filter(track => track.category === category);
    }

    /**
     * Récupère les pistes les plus récemment ajoutées
     * @param limit - Nombre de pistes à retourner
     * @returns Pistes triées par date d'ajout (récentes en premier)
     */
    getRecentlyAdded(limit?: number): Track[] {
        const sorted = [...this.tracksSubject.value].sort((a, b) =>
            new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
        );
        return limit ? sorted.slice(0, limit) : sorted;
    }

    /**
     * Récupère les pistes les plus écoutées
     * @param limit - Nombre de pistes à retourner
     * @returns Pistes triées par nombre de lectures
     */
    getMostListened(limit?: number): Track[] {
        const sorted = [...this.tracksSubject.value].sort((a, b) =>
            (b.playCount || 0) - (a.playCount || 0)
        );
        return limit ? sorted.slice(0, limit) : sorted;
    }

    /**
     * Récupère tous les artistes uniques
     * @returns Liste des artistes
     */
    getAllArtists(): string[] {
        const artists = new Set(this.tracksSubject.value.map(track => track.artist));
        return Array.from(artists).sort();
    }

    /**
     * Filtre les pistes par artiste
     * @param artist - Nom de l'artiste
     * @returns Pistes de l'artiste
     */
    filterByArtist(artist: string): Track[] {
        return this.tracksSubject.value.filter(track => track.artist === artist);
    }

    /**
     * Récupère toutes les catégories uniques utilisées par au moins une piste
     * @returns Liste des catégories utilisées
     */
    getUsedCategories(): MusicCategory[] {
        const categories = new Set(this.tracksSubject.value.map(track => track.category));
        return Array.from(categories).sort() as MusicCategory[];
    }

    /**
     * Incrémente le compteur de lectures pour une piste
     * @param id - ID de la piste
     */
    async incrementPlayCount(id: string): Promise<void> {
        try {
            await this.storageService.incrementPlayCount(id);

            // Mettre à jour localement
            const currentTracks = this.tracksSubject.value;
            const track = currentTracks.find(t => t.id === id);
            if (track) {
                track.playCount = (track.playCount || 0) + 1;
                this.tracksSubject.next([...currentTracks]);
            }
        } catch (error) {
            console.error('Erreur lors de l\'incrémentation du compteur:', error);
        }
    }
}
