import { PlayerState } from './player-state.enum';
import { Track } from './track.model';

/**
 * Interface représentant l'état complet du lecteur audio
 */
export interface AudioPlayerState {
    /** État actuel du lecteur (playing, paused, stopped, buffering) */
    status: PlayerState;

    /** Piste actuellement en cours de lecture */
    currentTrack: Track | null;

    /** Volume actuel (0-100) */
    volume: number;

    /** Progression actuelle en secondes */
    currentTime: number;

    /** Durée totale de la piste en secondes */
    duration: number;

    /** Mode aléatoire activé */
    shuffle: boolean;

    /** Mode répétition activé */
    repeat: boolean;
}
