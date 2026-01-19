import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { TrackService } from '../../services/track.service';
import { AudioPlayerService } from '../../services/audio-player.service';
import { Track } from '../../models/track.model';
import { MusicCategory } from '../../models/category.enum';

/**
 * Composant de la page bibliothèque
 * Affiche toutes les pistes avec recherche et filtres
 */
@Component({
    selector: 'app-library',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './library.component.html',
    styleUrl: './library.component.css'
})
export class LibraryComponent implements OnInit, OnDestroy {
    tracks: Track[] = [];
    filteredTracks: Track[] = [];
    searchTerm: string = '';
    activeFilter: string = 'all';
    selectedCategory: string | null = null;

    private destroy$ = new Subject<void>();

    // Filtres disponibles
    filters = [
        { id: 'all', label: 'Tous' },
        { id: 'recent', label: 'Récemment ajoutés' },
        { id: 'popular', label: 'Plus écoutés' },
        { id: 'artists', label: 'Artistes' },
        { id: 'albums', label: 'Albums' }
    ];

    constructor(
        public trackService: TrackService,
        private audioPlayerService: AudioPlayerService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        // S'abonner aux changements de pistes
        this.trackService.tracks$
            .pipe(takeUntil(this.destroy$))
            .subscribe(tracks => {
                this.tracks = tracks;
                this.applyFilters();
            });

        // S'abonner aux paramètres d'URL pour le filtrage par catégorie
        this.route.queryParams
            .pipe(takeUntil(this.destroy$))
            .subscribe(params => {
                this.selectedCategory = params['category'] || null;
                if (this.selectedCategory) {
                    this.activeFilter = 'all'; // Réinitialiser le filtre principal si on filtre par catégorie
                }
                this.applyFilters();
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    /**
     * Gère la recherche de pistes
     */
    onSearch(): void {
        this.applyFilters();
    }

    /**
     * Change le filtre actif
     */
    setFilter(filterId: string): void {
        this.activeFilter = filterId;
        this.applyFilters();
    }

    /**
     * Applique les filtres et la recherche
     */
    private applyFilters(): void {
        let result = [...this.tracks];

        // Appliquer le filtre de catégorie si présent
        if (this.selectedCategory) {
            result = result.filter(track => track.category === this.selectedCategory);
        }

        // Appliquer la recherche
        if (this.searchTerm.trim()) {
            const term = this.searchTerm.toLowerCase().trim();
            result = result.filter(track =>
                track.name.toLowerCase().includes(term) ||
                track.artist.toLowerCase().includes(term)
            );
        }

        // Appliquer le filtre principal (Récents, Populaires, etc.)
        // Si une catégorie est sélectionnée, on applique généralement "all" comme filtre de base
        const filterToApply = this.selectedCategory ? 'all' : this.activeFilter;

        switch (filterToApply) {
            case 'recent':
                result = [...result].sort((a, b) =>
                    new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
                );
                break;
            case 'popular':
                result = [...result].sort((a, b) =>
                    (b.playCount || 0) - (a.playCount || 0)
                );
                break;
            case 'artists':
                result = [...result].sort((a, b) => a.artist.localeCompare(b.artist));
                break;
            case 'albums':
                // Pas encore de logique d'album complexe
                break;
            default:
                // 'all'
                break;
        }

        this.filteredTracks = result;
    }

    /**
     * Lance la lecture d'une piste
     */
    async playTrack(track: Track): Promise<void> {
        await this.audioPlayerService.playTrack(track, this.filteredTracks);
    }

    /**
     * Navigue vers les détails d'une piste
     */
    viewTrackDetails(trackId: string): void {
        this.router.navigate(['/track', trackId]);
    }

    /**
     * Navigue vers la page d'ajout
     */
    goToUpload(): void {
        this.router.navigate(['/upload']);
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
