import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { ChangeDetectionStrategy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatToolbarModule, MatIconModule],
  template: `
    <mat-toolbar
      color="primary"
      class="flex items-center justify-between px-6 py-4 shadow-md"
    >
      <div class="flex items-center gap-4">
        <mat-icon svgIcon="angular" class="w-10 h-10"></mat-icon>
        <span class="text-2xl font-bold tracking-tight">{{ title() }}</span>
      </div>
      <!-- <div class="flex gap-2">
        <a
          href="https://github.com/angular/angular"
          target="_blank"
          aria-label="Github"
        >
          <mat-icon svgIcon="github" class="w-6 h-6"></mat-icon>
        </a>
        <a
          href="https://twitter.com/angular"
          target="_blank"
          aria-label="Twitter"
        >
          <mat-icon svgIcon="twitter" class="w-6 h-6"></mat-icon>
        </a>
        <a
          href="https://www.youtube.com/channel/UCbn1OgGei-DV7aSRo_HaAiw"
          target="_blank"
          aria-label="Youtube"
        >
          <mat-icon svgIcon="youtube" class="w-6 h-6"></mat-icon>
        </a>
      </div> -->
    </mat-toolbar>
    <main
      class="flex flex-col items-center justify-center min-h-screen bg-gray-50"
    >
      <router-outlet />
    </main>
  `,
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly title = signal('FSA Ratings App');

  constructor() {
    const iconRegistry = inject(MatIconRegistry);
    const sanitizer = inject(DomSanitizer);
    iconRegistry.addSvgIcon(
      'github',
      sanitizer.bypassSecurityTrustResourceUrl('/icons/github.svg')
    );
    iconRegistry.addSvgIcon(
      'twitter',
      sanitizer.bypassSecurityTrustResourceUrl('/icons/twitter.svg')
    );
    iconRegistry.addSvgIcon(
      'youtube',
      sanitizer.bypassSecurityTrustResourceUrl('/icons/youtube.svg')
    );
    iconRegistry.addSvgIcon(
      'angular',
      sanitizer.bypassSecurityTrustResourceUrl('/icons/angular.svg')
    );
  }
}
