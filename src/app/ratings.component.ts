import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { FsaRatingsService, Rating } from './fsa-ratings.service';
import { inject, signal } from '@angular/core';

@Component({
  selector: 'app-ratings',
  imports: [MatCardModule, MatButtonModule],
  template: `
    <div class="flex flex-col items-center gap-8 py-8">
      <mat-card class="w-full max-w-xl shadow-lg">
        <mat-card-header>
          <mat-card-title class="text-xl font-bold">FSA Ratings</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="flex flex-col gap-4">
            @if (loading()) {
            <div class="text-center py-4 text-gray-500">Loading ratings...</div>
            } @else { @for (rating of ratings(); track rating.ratingId) {
            <div
              class="flex items-center justify-between p-4 rounded bg-gray-100"
            >
              <span class="font-medium">{{ rating.ratingName }}</span>
              <span class="text-lg font-bold text-blue-600">{{
                rating.ratingKey
              }}</span>
            </div>
            } }
          </div>
        </mat-card-content>
        <mat-card-actions>
          <button
            mat-raised-button
            color="primary"
            class="w-full"
            (click)="fetchRatings()"
          >
            Refresh Ratings
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RatingsComponent {
  private readonly fsaRatingsService = inject(FsaRatingsService);
  private readonly _ratings = signal<Rating[]>([]);
  readonly ratings = this._ratings.asReadonly();
  readonly loading = signal(false);

  fetchRatings() {
    this.loading.set(true);
    this.fsaRatingsService.getRatingsResponse().subscribe({
      next: (response) => {
        this._ratings.set(response.ratings);
        this.loading.set(false);
      },
      error: () => {
        this._ratings.set([]);
        this.loading.set(false);
      },
    });
  }

  constructor() {
    this.fetchRatings();
  }
}
