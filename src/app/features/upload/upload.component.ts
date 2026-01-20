import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TrackService } from '../../services/track.service';
import { MusicCategory } from '../../models/category.enum';
import { CreateTrackDto, UpdateTrackDto, Track } from '../../models/track.model';

/**
 * Composant de la page d'ajout/édition de piste
 * Permet d'uploader et de configurer une nouvelle piste musicale
 */
@Component({
    selector: 'app-upload',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './upload.component.html',
    styleUrl: './upload.component.css'
})
export class UploadComponent implements OnInit {
    trackForm: FormGroup;
    selectedFile: File | null = null;
    selectedArtistImage: File | null = null;  // Photo de l'artiste
    artistImagePreview: string | null = null;  // Preview de la photo
    audioDuration: number = 0;
    isEditMode: boolean = false;
    trackId: string | null = null;
    isLoading: boolean = false;
    errorMessage: string | null = null;

    // Catégories musicales disponibles
    categories = Object.values(MusicCategory);

    constructor(
        private fb: FormBuilder,
        private trackService: TrackService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        // Initialiser le formulaire
        this.trackForm = this.fb.group({
            name: ['', [Validators.required, Validators.maxLength(50)]],
            artist: ['', Validators.required],
            description: ['', Validators.maxLength(200)],
            category: [MusicCategory.OTHER, Validators.required]
        });
    }

    ngOnInit(): void {
        // Vérifier si on est en mode édition
        this.trackId = this.route.snapshot.paramMap.get('id');
        if (this.trackId) {
            this.isEditMode = true;
            this.loadTrack(this.trackId);
        }
    }

    /**
     * Charge les données d'une piste existante pour l'édition
     */
    async loadTrack(id: string): Promise<void> {
        const track = await this.trackService.getTrackById(id);
        if (track) {
            this.trackForm.patchValue({
                name: track.name,
                artist: track.artist,
                description: track.description || '',
                category: track.category
            });
            this.audioDuration = track.duration;

            // Charger la photo de l'artiste si elle existe
            if (track.artistImage) {
                this.artistImagePreview = track.artistImage;
            }
        } else {
            this.errorMessage = 'Piste non trouvée';
        }
    }

    /**
     * Gestion de la sélection du fichier audio
     */
    async onFileSelected(event: Event): Promise<void> {
        const input = event.target as HTMLInputElement;
        if (!input.files || input.files.length === 0) return;

        const file = input.files[0];
        this.errorMessage = null;

        // Valider le fichier
        const validationError = this.trackService.validateAudioFile(file);
        if (validationError) {
            this.errorMessage = validationError;
            this.selectedFile = null;
            input.value = '';
            return;
        }

        this.selectedFile = file;

        // Calculer la durée
        try {
            this.audioDuration = await this.trackService.getAudioDuration(file);
        } catch (error) {
            this.errorMessage = 'Impossible de lire le fichier audio';
            this.selectedFile = null;
            input.value = '';
        }
    }

    /**
     * Gestion de la sélection de la photo d'artiste
     */
    async onArtistImageSelected(event: Event): Promise<void> {
        const input = event.target as HTMLInputElement;
        if (!input.files || input.files.length === 0) return;

        const file = input.files[0];
        this.errorMessage = null;

        // Valider le fichier image
        const validationError = this.trackService.validateImageFile(file);
        if (validationError) {
            this.errorMessage = validationError;
            this.selectedArtistImage = null;
            this.artistImagePreview = null;
            input.value = '';
            return;
        }

        this.selectedArtistImage = file;

        // Créer preview de l'image
        try {
            this.artistImagePreview = await this.trackService.convertImageToDataURL(file);
        } catch (error) {
            this.errorMessage = 'Impossible de lire l\'image';
            this.selectedArtistImage = null;
            this.artistImagePreview = null;
            input.value = '';
        }
    }

    /**
     * Supprime la photo d'artiste sélectionnée
     */
    removeArtistImage(): void {
        this.selectedArtistImage = null;
        this.artistImagePreview = null;
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
     * Obtient le message d'erreur pour un champ
     */
    getFieldError(fieldName: string): string | null {
        const field = this.trackForm.get(fieldName);
        if (!field || !field.errors || !field.touched) return null;

        if (field.errors['required']) {
            return 'Ce champ est requis';
        }
        if (field.errors['maxlength']) {
            const maxLength = field.errors['maxlength'].requiredLength;
            return `Maximum ${maxLength} caractères`;
        }
        return null;
    }

    /**
     * Soumet le formulaire
     */
    async onSubmit(): Promise<void> {
        // Valider le formulaire
        if (this.trackForm.invalid) {
            Object.keys(this.trackForm.controls).forEach(key => {
                this.trackForm.get(key)?.markAsTouched();
            });
            return;
        }

        // En mode création, vérifier qu'un fichier est sélectionné
        if (!this.isEditMode && !this.selectedFile) {
            this.errorMessage = 'Veuillez sélectionner un fichier audio';
            return;
        }

        this.isLoading = true;
        this.errorMessage = null;

        try {
            if (this.isEditMode && this.trackId) {
                // Mode édition : mettre à jour la piste
                const updateDto: UpdateTrackDto = {
                    ...this.trackForm.value,
                    artistImage: this.artistImagePreview || undefined
                };
                await this.trackService.updateTrack(this.trackId, updateDto);
            } else if (this.selectedFile) {
                // Mode création : créer une nouvelle piste
                const trackDto: CreateTrackDto = {
                    ...this.trackForm.value,
                    audioFile: this.selectedFile,
                    duration: this.audioDuration  // Ajouter la durée calculée
                };

                // Ajouter la photo de l'artiste si sélectionnée
                if (this.artistImagePreview) {
                    trackDto.artistImage = this.artistImagePreview;
                }

                await this.trackService.createTrack(trackDto);
            }

            // Rediriger vers la bibliothèque
            this.router.navigate(['/library']);
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
            this.errorMessage = 'Une erreur est survenue lors de la sauvegarde';
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * Annule et retourne à la bibliothèque
     */
    cancel(): void {
        this.router.navigate(['/library']);
    }

    /**
     * Obtient le nom du fichier sélectionné
     */
    getFileName(): string {
        return this.selectedFile ? this.selectedFile.name : 'Aucun fichier sélectionné';
    }

    /**
     * Obtient la taille du fichier formatée
     */
    getFileSize(): string {
        if (!this.selectedFile) return '';
        const sizeInMB = this.selectedFile.size / (1024 * 1024);
        return `${sizeInMB.toFixed(2)} MB`;
    }
}
