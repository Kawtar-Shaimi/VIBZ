import { Routes } from '@angular/router';

/**
 * Configuration des routes de l'application
 * Utilise le lazy loading pour optimiser les performances
 */
export const routes: Routes = [
    // Route par défaut - redirige vers la bibliothèque
    {
        path: '',
        redirectTo: 'library',
        pathMatch: 'full'
    },
    // Page bibliothèque
    {
        path: 'library',
        loadComponent: () => import('./features/library/library.component').then(m => m.LibraryComponent)
    },
    // Page d'ajout de piste
    {
        path: 'upload',
        loadComponent: () => import('./features/upload/upload.component').then(m => m.UploadComponent)
    },
    // Page d'édition de piste
    {
        path: 'upload/:id',
        loadComponent: () => import('./features/upload/upload.component').then(m => m.UploadComponent)
    },
    // Page de détails d'une piste
    {
        path: 'track/:id',
        loadComponent: () => import('./features/track-detail/track-detail.component').then(m => m.TrackDetailComponent)
    },
    // Route wildcard - redirige vers la bibliothèque si la route n'existe pas
    {
        path: '**',
        redirectTo: 'library'
    }
];
