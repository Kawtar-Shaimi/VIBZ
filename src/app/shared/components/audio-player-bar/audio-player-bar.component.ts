import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { AudioPlayerService } from '../../../services/audio-player.service';
import { AudioPlayerState } from '../../../models/audio-player-state.model';
import { PlayerState } from '../../../models/player-state.enum';

/**
 * Composant de barre de lecture audio persistante
 * Affiche les contrôles du lecteur en bas de l'écran
 */
@Component({
    selector: 'app-audio-player-bar',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './audio-player-bar.component.html',
    styleUrl: './audio-player-bar.component.css'
})
export class AudioPlayerBarComponent implements OnInit, OnDestroy {
    playerState: AudioPlayerState | null = null;
    PlayerState = PlayerState; // Pour l'utiliser dans le template

    private destroy$ = new Subject<void>();

    constructor(public audioPlayerService: AudioPlayerService) { }

    ngOnInit(): void {
        // S'abonner à l'état du lecteur
        this.audioPlayerService.playerState$
            .pipe(takeUntil(this.destroy$))
            .subscribe(state => {
                this.playerState = state;
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    /**
     * Formate le temps en mm:ss
     */
    formatTime(seconds: number): string {
        if (!seconds || isNaN(seconds)) return '0:00';

        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    /**
     * Calcule le pourcentage de progression
     */
    getProgressPercentage(): number {
        if (!this.playerState || !this.playerState.duration) return 0;
        return (this.playerState.currentTime / this.playerState.duration) * 100;
    }

    /**
     * Gestion du clic sur la barre de progression
     */
    onProgressBarClick(event: MouseEvent): void {
        if (!this.playerState?.currentTrack) return;

        const progressBar = event.currentTarget as HTMLElement;
        const rect = progressBar.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const percentage = clickX / rect.width;
        const newTime = percentage * this.playerState.duration;

        this.audioPlayerService.seek(newTime);
    }

    /**
     * Gestion du contrôle du volume
     */
    onVolumeChange(event: Event): void {
        const input = event.target as HTMLInputElement;
        this.audioPlayerService.setVolume(parseInt(input.value, 10));
    }

    /**
     * Actions du lecteur
     */
    togglePlayPause(): void {
        this.audioPlayerService.togglePlayPause();
    }

    playNext(): void {
        this.audioPlayerService.next();
    }

    playPrevious(): void {
        this.audioPlayerService.previous();
    }

    toggleShuffle(): void {
        this.audioPlayerService.toggleShuffle();
    }

    toggleRepeat(): void {
        this.audioPlayerService.toggleRepeat();
    }
}
