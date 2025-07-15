import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface Rating {
  ratingId: number;
  ratingName: string;
  ratingKey: string;
}

export interface RatingsResponse {
  ratings: Rating[];
}

@Injectable({ providedIn: 'root' })
export class FsaRatingsService {
  private readonly httpClient = inject(HttpClient);
  private readonly baseUrl = 'https://api.ratings.food.gov.uk/';
  private readonly headersOptions = {
    headers: {
      'x-api-version': '2',
    },
  };

  getRatingsResponse(): Observable<RatingsResponse> {
    return this.httpClient.get<RatingsResponse>(
      `${this.baseUrl}Ratings`,
      this.headersOptions
    );
  }
}
