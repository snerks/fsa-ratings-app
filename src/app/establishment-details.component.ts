import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { SearchService, Establishment } from './search.service';
import { signal } from '@angular/core';
import { ScoreDescriptors } from './models/score-descriptors.model';
import { DatePipe } from '@angular/common';

// import { getScoreDescription } from "../app/models/score-descriptors.model";

@Component({
  selector: 'app-establishment-details',
  imports: [MatCardModule, DatePipe],
  template: `
    <div class="flex flex-col items-center gap-8 py-8">
      <mat-card class="w-full max-w-2xl shadow-lg">
        <mat-card-header>
          <div class="flex items-center gap-3">
            @if (establishment()?.BusinessType) {
            <img
              [src]="getBusinessTypeIcon(establishment()?.BusinessType)"
              alt="{{ establishment()?.BusinessType }} icon"
              class="w-8 h-8 inline-block align-middle"
              ngOptimizedImage
            />
            }
            <div class="flex flex-col">
              <span class="font-semibold text-xl">{{
                establishment()?.BusinessName
              }}</span>
              <span class="text-gray-600">{{
                establishment()?.BusinessType
              }}</span>
            </div>
          </div>
        </mat-card-header>
        <mat-card-content>
          @if (loading()) {
          <div class="text-center py-4 text-gray-500">Loading...</div>
          } @else if (establishment()) {
          <div class="flex flex-col gap-6">
            <div class="flex flex-col gap-2 border-b pb-4">
              <!-- <div class="flex items-center gap-3">
                @if (establishment()?.BusinessType) {
                <img
                  [src]="getBusinessTypeIcon(establishment()?.BusinessType)"
                  alt="{{ establishment()?.BusinessType }} icon"
                  class="w-8 h-8 inline-block align-middle"
                  ngOptimizedImage
                />
                }
                <div class="flex flex-col">
                  <span class="font-semibold text-lg">{{
                    establishment()?.BusinessName
                  }}</span>
                  <span class="text-gray-600">{{
                    establishment()?.BusinessType
                  }}</span>
                </div>
              </div> -->
              <div class="text-sm text-gray-500 mt-2">
                FHRSID: {{ establishment()?.FHRSID }}
              </div>
            </div>
            <div class="flex flex-col gap-1 border-b pb-4">
              <span class="font-semibold">Address</span>
              <span>{{ establishment()?.AddressLine1 }}</span>
              <span>{{ establishment()?.AddressLine2 }}</span>
              <span>{{ establishment()?.AddressLine3 }}</span>
              <span>{{ establishment()?.AddressLine4 }}</span>
              <span class="font-mono">{{ establishment()?.PostCode }}</span>
            </div>
            <div class="flex flex-col gap-1 border-b pb-4">
              <span class="font-semibold">Local Authority</span>
              <span>{{ establishment()?.LocalAuthorityName }}</span>
            </div>
            <div class="flex flex-col gap-2 border-b pb-4">
              <span class="font-semibold">Scores</span>
              <ul class="list-none pl-0">
                <li class="flex items-center gap-2">
                  <!-- <img
                    src="/icons/hygiene.svg"
                    alt="Hygiene"
                    class="w-5 h-5"
                    ngOptimizedImage
                  /> -->
                  <span class="font-semibold">Hygiene:</span>
                  <span class="font-mono">{{
                    establishment()?.scores?.Hygiene
                  }}</span>
                  <span class="text-gray-600">
                    {{
                      getScoreDescription(
                        'Hygiene',
                        establishment()?.scores?.Hygiene
                      )
                    }}
                  </span>
                </li>
                <li class="flex items-center gap-2">
                  <!-- <img
                    src="/icons/structural.svg"
                    alt="Structural"
                    class="w-5 h-5"
                    ngOptimizedImage
                  /> -->
                  <span class="font-semibold">Structural:</span>
                  <span class="font-mono">{{
                    establishment()?.scores?.Structural
                  }}</span>
                  <span class="text-gray-600">
                    {{
                      getScoreDescription(
                        'Structural',
                        establishment()?.scores?.Structural
                      )
                    }}
                  </span>
                </li>
                <li class="flex items-center gap-2">
                  <!-- <img
                    src="/icons/confidence.svg"
                    alt="Confidence"
                    class="w-5 h-5"
                    ngOptimizedImage
                  /> -->
                  <span class="font-semibold">Confidence:</span>
                  <span class="font-mono">{{
                    establishment()?.scores?.ConfidenceInManagement
                  }}</span>
                  <span class="text-gray-600">
                    {{
                      getScoreDescription(
                        'Confidence',
                        establishment()?.scores?.ConfidenceInManagement
                      )
                    }}
                  </span>
                </li>
              </ul>
            </div>
            <div class="flex flex-col gap-1 border-b pb-4">
              <span class="font-semibold">Rating</span>
              <span class="font-bold text-blue-600 text-lg">
                {{ establishment()?.RatingValue }}
              </span>
            </div>
            <div class="flex flex-col gap-1 border-b pb-4">
              <span class="font-semibold">Inspection Date</span>
              <span class="font-mono">{{
                establishment()?.RatingDate
                  ? (establishment()?.RatingDate | date : 'longDate')
                  : 'N/A'
              }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="font-semibold">Location</span>
              @if (establishment()?.geocode?.latitude &&
              establishment()?.geocode?.longitude) {
              <a
                class="text-blue-600 underline"
                href="https://www.google.com/maps/search/?api=1&query={{
                  establishment()?.geocode?.latitude
                }},{{ establishment()?.geocode?.longitude }}"
                target="_blank"
                rel="noopener"
              >
                View on Google Maps
              </a>
              } @else {
              <span class="text-gray-500">Location not available</span>
              }
            </div>
          </div>
          } @else {
          <div class="text-center py-4 text-red-500">
            Establishment not found.
          </div>
          }
        </mat-card-content>
      </mat-card>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EstablishmentDetailsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly searchService = inject(SearchService);
  private readonly _establishment = signal<Establishment | null>(null);
  readonly establishment = this._establishment.asReadonly();
  readonly loading = signal(true);

  lastQuery = JSON.stringify(this.searchService.lastQuery());

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.searchService.getEstablishment(id).subscribe({
      next: (est) => {
        this._establishment.set(est);
        this.loading.set(false);
      },
      error: () => {
        this._establishment.set(null);
        this.loading.set(false);
      },
    });
  }

  getBusinessTypeIcon(type: string | undefined): string {
    if (!type) return '';
    switch (type.toLowerCase()) {
      case 'pub/bar/nightclub':
        return '/icons/pub.svg';
      case 'restaurant/cafe/canteen':
        return '/icons/restaurant.svg';
      case 'takeaway/sandwich shop':
        return '/icons/takeaway.svg';
      case 'school/college/university':
        return '/icons/school.svg';
      case 'hotel/bed & breakfast/guest house':
        return '/icons/hotel.svg';
      default:
        return '/icons/other.svg';
    }
  }

  getScoreDescription(category: string, score: number | undefined): string {
    const descriptor = ScoreDescriptors.find(
      (d) =>
        d.ScoreCategory.toLowerCase() === category.toLowerCase() &&
        d.Score === score
    );
    return descriptor ? descriptor.Description : '';
  }

  //   getScoreDescription(scoreType: string, score: number | undefined): string {
  //     if (score === undefined || score === null) return '';
  //     switch (scoreType) {
  //       case 'Hygiene':
  //         if (score === 0) return '(Very Good)';
  //         if (score === 5) return '(Poor)';
  //         return '';
  //       // Add more cases for other score types if needed
  //       default:
  //         return '';
  //     }
  //   }
}
