import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { TrackService } from '../../services/track.service';
import { AudioPlayerService } from '../../services/audio-player.service';
import { Track } from '../../models/track.model';
import { MusicCategory } from '../../models/category.enum';

/**
 * Composant de la page de détails d'une piste
 * Affiche toutes les informations de la piste et permet la lecture
 */
@Component({
    selector: 'app-track-detail',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './track-detail.component.html',
    styleUrl: './track-detail.component.css'
})
export class TrackDetailComponent implements OnInit {
    track: Track | null = null;
    isLoading: boolean = true;
    showDeleteConfirm: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private trackService: TrackService,
        private audioPlayerService: AudioPlayerService
    ) { }

    async ngOnInit(): Promise<void> {
        const trackId = this.route.snapshot.paramMap.get('id');
        if (trackId) {
            await this.loadTrack(trackId);
        } else {
            this.router.navigate(['/library']);
        }
    }

    /**
     * Charge les données de la piste
     */
    async loadTrack(id: string): Promise<void> {
        this.isLoading = true;
        this.track = await this.trackService.getTrackById(id);
        this.isLoading = false;

        if (!this.track) {
            // Piste non trouvée, rediriger vers la bibliothèque
            this.router.navigate(['/library']);
        }
    }

    /**
     * Lance la lecture de la piste
     */
    async playTrack(): Promise<void> {
        if (this.track) {
            await this.audioPlayerService.playTrack(this.track);
        }
    }

    /**
     * Navigue vers la page d'édition
     */
    editTrack(): void {
        if (this.track) {
            this.router.navigate(['/upload', this.track.id]);
        }
    }

    /**
     * Affiche la confirmation de suppression
     */
    confirmDelete(): void {
        this.showDeleteConfirm = true;
    }

    /**
     * Annule la suppression
     */
    cancelDelete(): void {
        this.showDeleteConfirm = false;
    }

    /**
     * Supprime la piste
     */
    async deleteTrack(): Promise<void> {
        if (!this.track) return;

        try {
            await this.trackService.deleteTrack(this.track.id);
            this.router.navigate(['/library']);
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            this.showDeleteConfirm = false;
        }
    }

    /**
     * Retourne à la bibliothèque
     */
    goBack(): void {
        this.router.navigate(['/library']);
    }

    /**
     * Formate la durée en mm:ss
     */
    formatDuration(seconds: number): string {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    /**
     * Formate la date
     */
    formatDate(date: Date): string {
        return new Date(date).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }

    /**
     * Obtient une couleur de catégorie
     */
    getCategoryColor(category: MusicCategory): string {
        const colors: Record<string, string> = {
            'Pop': '#FF006B',
            'Rock': '#FF4A4A',
            'Rap': '#FFB800',
            'Jazz': '#9B51E0',
            'Classical': '#4A9EFF',
            'Electronic': '#14B8A6',
            'Hip-Hop': '#F97316',
            'R&B': '#EC4899',
            'Country': '#84CC16',
            'Blues': '#3B82F6',
            'Metal': '#EF4444',
            'Indie': '#8B5CF6',
            'Other': '#64748B'
        };
        return colors[category] || '#64748B';
    }
}
