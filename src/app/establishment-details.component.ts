import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { SearchService, Establishment } from './search.service';
import { signal } from '@angular/core';

@Component({
  selector: 'app-establishment-details',
  imports: [MatCardModule],
  template: `
    <div class="flex flex-col items-center gap-8 py-8">
      <mat-card class="w-full max-w-2xl shadow-lg">
        <mat-card-header>
          <mat-card-title class="text-xl font-bold"
            >Establishment Details</mat-card-title
          >
        </mat-card-header>
        <mat-card-content>
          @if (loading()) {
          <div class="text-center py-4 text-gray-500">Loading...</div>
          } @else if (establishment()) {
          <div class="flex flex-col gap-2">
            <div>
              <span class="font-semibold">Name:</span>
              {{ establishment()?.BusinessName }}
            </div>
            <div>
              <span class="font-semibold">FHRSID:</span>
              {{ establishment()?.FHRSID }}
            </div>
            <div>
              <span class="font-semibold">Address Line 1:</span>
              {{ establishment()?.AddressLine1 }}
            </div>
            <div>
              <span class="font-semibold">Address Line 2:</span>
              {{ establishment()?.AddressLine2 }}
            </div>
            <div>
              <span class="font-semibold">Address Line 3:</span>
              {{ establishment()?.AddressLine3 }}
            </div>
            <div>
              <span class="font-semibold">Address Line 4:</span>
              {{ establishment()?.AddressLine4 }}
            </div>
            <div>
              <span class="font-semibold">Postcode:</span>
              {{ establishment()?.PostCode }}
            </div>
            <div>
              <span class="font-semibold">Rating Value:</span>
              <span class="font-bold text-blue-600">{{
                establishment()?.RatingValue
              }}</span>
            </div>
            <div>
              <span class="font-semibold">Local Authority Name:</span>
              {{ establishment()?.LocalAuthorityName }}
            </div>
            <div>
              <span class="font-semibold">Scores:</span>
              <ul class="list-disc ml-6">
                <li>
                  <span class="font-semibold">Hygiene:</span>
                  {{ establishment()?.scores?.Hygiene }}
                </li>
                <li>
                  <span class="font-semibold">Structural:</span>
                  {{ establishment()?.scores?.Structural }}
                </li>
                <li>
                  <span class="font-semibold">ConfidenceInManagement:</span>
                  {{ establishment()?.scores?.ConfidenceInManagement }}
                </li>
              </ul>
            </div>
            <div>
              <span class="font-semibold">Google Maps:</span>
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
            <div class="flex items-center gap-2">
              <span class="font-semibold">Business Type:</span>
              {{ establishment()?.BusinessType }}
              @if (establishment()?.BusinessType) {
              <img
                [src]="getBusinessTypeIcon(establishment()?.BusinessType)"
                alt="{{ establishment()?.BusinessType }} icon"
                class="w-6 h-6 inline-block align-middle"
                ngOptimizedImage
              />
              }
            </div>
            <!-- Add more fields here if the API returns them -->
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
}
