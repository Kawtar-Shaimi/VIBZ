import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { Track } from '../models/track.model';
import { PlayerState } from '../models/player-state.enum';
import { AudioPlayerState } from '../models/audio-player-state.model';
import { TrackService } from './track.service';

/**
 * Service de gestion du lecteur audio
 * 
 * Ce service gère la lecture audio en utilisant HTMLAudioElement
 * et maintient l'état du lecteur avec RxJS BehaviorSubject.
 */
@Injectable({
    providedIn: 'root'
})
export class AudioPlayerService {
    // Élément audio HTML
    private audio!: HTMLAudioElement;
    private isBrowser: boolean;

    // État du lecteur
    private playerStateSubject = new BehaviorSubject<AudioPlayerState>({
        status: PlayerState.STOPPED,
        currentTrack: null,
        volume: 70,
        currentTime: 0,
        duration: 0,
        shuffle: false,
        repeat: false
    });

    public playerState$ = this.playerStateSubject.asObservable();

    // Liste de lecture (queue)
    private playlist: Track[] = [];
    private currentIndex: number = -1;

    constructor(
        private trackService: TrackService,
        @Inject(PLATFORM_ID) platformId: Object
    ) {
        this.isBrowser = isPlatformBrowser(platformId);

        // Initialiser l'audio uniquement côté navigateur
        if (this.isBrowser) {
            this.audio = new Audio();
            this.setupAudioListeners();

            // Restaurer le volume depuis localStorage si disponible
            const savedVolume = localStorage.getItem('playerVolume');
            if (savedVolume) {
                this.setVolume(parseInt(savedVolume, 10));
            } else {
                this.audio.volume = 0.7; // Volume par défaut 70%
            }
        }
    }

    /**
     * Configure les écouteurs d'événements de l'élément audio
     */
    private setupAudioListeners(): void {
        // Mise à jour de la progression
        this.audio.addEventListener('timeupdate', () => {
            this.updateState({
                currentTime: this.audio.currentTime,
                duration: this.audio.duration || 0
            });
        });

        // Fin de lecture
        this.audio.addEventListener('ended', () => {
            const state = this.playerStateSubject.value;
            if (state.repeat) {
                this.play();
            } else {
                this.next();
            }
        });

        // Chargement des métadonnées
        this.audio.addEventListener('loadedmetadata', () => {
            this.updateState({
                duration: this.audio.duration
            });
        });

        // État de buffering
        this.audio.addEventListener('waiting', () => {
            this.updateState({ status: PlayerState.BUFFERING });
        });

        this.audio.addEventListener('canplay', () => {
            const currentStatus = this.playerStateSubject.value.status;
            if (currentStatus === PlayerState.BUFFERING) {
                this.updateState({ status: PlayerState.PAUSED });
            }
        });

        // Gestion des erreurs
        this.audio.addEventListener('error', (e) => {
            console.error('Erreur de lecture audio:', e);
            this.updateState({ status: PlayerState.STOPPED });
        });
    }

    /**
     * Met à jour l'état du lecteur
     * @param updates - Modifications à appliquer
     */
    private updateState(updates: Partial<AudioPlayerState>): void {
        const currentState = this.playerStateSubject.value;
        this.playerStateSubject.next({ ...currentState, ...updates });
    }

    /**
     * Charge une piste dans le lecteur
     * @param track - Piste à charger
     */
    async loadTrack(track: Track): Promise<void> {
        if (!this.isBrowser || !this.audio) return;

        try {
            // Créer une URL depuis le Blob
            const audioUrl = URL.createObjectURL(track.audioFile);

            // Libérer l'ancienne URL si elle existe
            if (this.audio.src) {
                URL.revokeObjectURL(this.audio.src);
            }

            this.audio.src = audioUrl;
            this.audio.load();

            this.updateState({
                currentTrack: track,
                status: PlayerState.STOPPED,
                currentTime: 0,
                duration: track.duration
            });

            // Incrémenter le compteur de lectures
            await this.trackService.incrementPlayCount(track.id);
        } catch (error) {
            console.error('Erreur lors du chargement de la piste:', error);
        }
    }

    /**
     * Lance la lecture
     */
    async play(): Promise<void> {
        if (!this.isBrowser || !this.audio) return;

        try {
            await this.audio.play();
            this.updateState({ status: PlayerState.PLAYING });
        } catch (error) {
            console.error('Erreur lors de la lecture:', error);
            this.updateState({ status: PlayerState.STOPPED });
        }
    }

    /**
     * Met en pause la lecture
     */
    pause(): void {
        if (!this.isBrowser || !this.audio) return;

        this.audio.pause();
        this.updateState({ status: PlayerState.PAUSED });
    }

    /**
     * Arrête la lecture
     */
    stop(): void {
        if (!this.isBrowser || !this.audio) return;

        this.audio.pause();
        this.audio.currentTime = 0;
        this.updateState({
            status: PlayerState.STOPPED,
            currentTime: 0
        });
    }

    /**
     * Bascule entre lecture et pause
     */
    togglePlayPause(): void {
        const state = this.playerStateSubject.value;
        if (state.status === PlayerState.PLAYING) {
            this.pause();
        } else if (state.currentTrack) {
            this.play();
        }
    }

    /**
     * Passe à la piste suivante
     */
    async next(): Promise<void> {
        if (this.playlist.length === 0) return;

        const state = this.playerStateSubject.value;

        if (state.shuffle) {
            // Mode aléatoire: choisir un index aléatoire différent du courant
            let randomIndex;
            do {
                randomIndex = Math.floor(Math.random() * this.playlist.length);
            } while (randomIndex === this.currentIndex && this.playlist.length > 1);
            this.currentIndex = randomIndex;
        } else {
            // Mode normal: piste suivante
            this.currentIndex = (this.currentIndex + 1) % this.playlist.length;
        }

        const nextTrack = this.playlist[this.currentIndex];
        await this.loadTrack(nextTrack);

        // Auto-play si on était en train de jouer
        if (state.status === PlayerState.PLAYING) {
            await this.play();
        }
    }

    /**
     * Revient à la piste précédente
     */
    async previous(): Promise<void> {
        if (this.playlist.length === 0) return;

        const state = this.playerStateSubject.value;

        // Si on est à plus de 3 secondes, revenir au début
        if (this.audio.currentTime > 3) {
            this.audio.currentTime = 0;
            return;
        }

        if (state.shuffle) {
            // Mode aléatoire: choisir un index aléatoire
            let randomIndex;
            do {
                randomIndex = Math.floor(Math.random() * this.playlist.length);
            } while (randomIndex === this.currentIndex && this.playlist.length > 1);
            this.currentIndex = randomIndex;
        } else {
            // Mode normal: piste précédente
            this.currentIndex = this.currentIndex - 1;
            if (this.currentIndex < 0) {
                this.currentIndex = this.playlist.length - 1;
            }
        }

        const previousTrack = this.playlist[this.currentIndex];
        await this.loadTrack(previousTrack);

        // Auto-play si on était en train de jouer
        if (state.status === PlayerState.PLAYING) {
            await this.play();
        }
    }

    /**
     * Déplace la tête de lecture à une position spécifique
     * @param time - Temps en secondes
     */
    seek(time: number): void {
        if (!this.isBrowser || !this.audio) return;

        if (this.audio.duration && time >= 0 && time <= this.audio.duration) {
            this.audio.currentTime = time;
            this.updateState({ currentTime: time });
        }
    }

    /**
     * Définit le volume
     * @param volume - Volume (0-100)
     */
    setVolume(volume: number): void {
        if (!this.isBrowser || !this.audio) return;

        const clampedVolume = Math.max(0, Math.min(100, volume));
        this.audio.volume = clampedVolume / 100;
        this.updateState({ volume: clampedVolume });

        // Sauvegarder dans localStorage
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('playerVolume', clampedVolume.toString());
        }
    }

    /**
     * Active/désactive le mode aléatoire
     */
    toggleShuffle(): void {
        const state = this.playerStateSubject.value;
        this.updateState({ shuffle: !state.shuffle });
    }

    /**
     * Active/désactive le mode répétition
     */
    toggleRepeat(): void {
        const state = this.playerStateSubject.value;
        this.updateState({ repeat: !state.repeat });
    }

    /**
     * Définit la playlist et charge la première piste
     * @param tracks - Liste des pistes
     * @param startIndex - Index de démarrage (défaut: 0)
     */
    async setPlaylist(tracks: Track[], startIndex: number = 0): Promise<void> {
        this.playlist = tracks;
        this.currentIndex = startIndex;

        if (tracks.length > 0 && startIndex < tracks.length) {
            await this.loadTrack(tracks[startIndex]);
        }
    }

    /**
     * Joue une piste spécifique immédiatement
     * @param track - Piste à jouer
     * @param playlist - Liste de lecture optionnelle
     */
    async playTrack(track: Track, playlist?: Track[]): Promise<void> {
        if (playlist) {
            this.playlist = playlist;
            this.currentIndex = playlist.findIndex(t => t.id === track.id);
        } else {
            this.playlist = [track];
            this.currentIndex = 0;
        }

        await this.loadTrack(track);
        await this.play();
    }

    /**
     * Obtient l'état actuel du lecteur (valeur synchrone)
     */
    getCurrentState(): AudioPlayerState {
        return this.playerStateSubject.value;
    }

    /**
     * Nettoie les ressources
     */
    ngOnDestroy(): void {
        if (!this.isBrowser || !this.audio) {
            return;
        }

        if (this.audio.src) {
            URL.revokeObjectURL(this.audio.src);
        }
        this.audio.pause();
    }
}
