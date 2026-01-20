import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { AudioPlayerBarComponent } from './shared/components/audio-player-bar/audio-player-bar.component';

/**
 * Composant racine de l'application MusicStream
 * Contient la structure principale : sidebar, contenu, et lecteur audio
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidebarComponent, AudioPlayerBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'MusicStream';
}
