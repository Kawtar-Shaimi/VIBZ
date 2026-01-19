import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { MusicCategory } from '../../../models/category.enum';
import { TrackService } from '../../../services/track.service';

/**
 * Composant de barre latérale de navigation
 * Affiche le logo, les liens de navigation et les catégories musicales
 */
@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit, OnDestroy {
    // Liens de navigation principaux
    navItems = [
        { icon: 'home', label: 'Bibliothèque', route: '/library' },
        { icon: 'search', label: 'Recherche', route: '/library' },
        { icon: 'list', label: 'Playlists', route: '/library' },
        { icon: 'heart', label: 'Favoris', route: '/library' }
    ];

    // Liste des catégories utilisées
    categories: MusicCategory[] = [];
    activeCategory: string | null = null;
    private destroy$ = new Subject<void>();

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private trackService: TrackService
    ) { }

    ngOnInit(): void {
        this.route.queryParams
            .pipe(takeUntil(this.destroy$))
            .subscribe(params => {
                this.activeCategory = params['category'] || null;
            });

        // S'abonner aux pistes pour mettre à jour les catégories utilisées
        this.trackService.tracks$
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.categories = this.trackService.getUsedCategories();
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    /**
     * Filtre les pistes par catégorie en naviguant vers la bibliothèque
     * @param category - Catégorie sélectionnée
     */
    filterByCategory(category: string): void {
        this.router.navigate(['/library'], {
            queryParams: { category: category }
        });
    }

    /**
     * Réinitialise le filtre de catégorie
     */
    resetFilter(): void {
        this.router.navigate(['/library'], {
            queryParams: { category: null }
        });
    }

    /**
     * Obtient une couleur pour la catégorie
     */
    getCategoryColor(category: string): string {
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
