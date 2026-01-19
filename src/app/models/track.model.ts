import { MusicCategory } from './category.enum';

/**
 * Interface représentant une piste musicale dans l'application
 */
export interface Track {
    /** Identifiant unique de la piste */
    id: string;

    /** Nom de la chanson (max 50 caractères) */
    name: string;

    /** Nom de l'artiste/chanteur */
    artist: string;

    /** Description optionnelle (max 200 caractères) */
    description?: string;

    /** Date d'ajout de la piste (générée automatiquement) */
    dateAdded: Date;

    /** Durée de la chanson en secondes (calculée automatiquement) */
    duration: number;

    /** Catégorie musicale */
    category: MusicCategory;

    /** Blob du fichier audio stocké dans IndexedDB */
    audioFile: Blob;

    /** URL de l'image de couverture (optionnel) */
    coverImage?: string;

    /** Photo de l'artiste en Data URL (base64) */
    artistImage?: string;

    /** Compteur de lectures (pour les filtres "plus écoutés") */
    playCount?: number;
}

/**
 * Interface pour la création d'une nouvelle piste (sans ID et date auto-générés)
 */
export interface CreateTrackDto {
    name: string;
    artist: string;
    description?: string;
    category: MusicCategory;
    audioFile: Blob;
    duration: number;
    coverImage?: string;
    artistImage?: string;  // Photo de l'artiste (Data URL)
}

/**
 * Interface pour la mise à jour d'une piste existante
 */
export interface UpdateTrackDto {
    name?: string;
    artist?: string;
    description?: string;
    category?: MusicCategory;
    coverImage?: string;
    artistImage?: string; // Photo de l'artiste (Data URL)
}
