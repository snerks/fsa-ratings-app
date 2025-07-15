import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { signal } from '@angular/core';

export interface Establishment {
  FHRSID: number;
  BusinessName: string;
  AddressLine1: string;
  AddressLine2?: string;
  AddressLine3?: string;
  AddressLine4?: string;
  PostCode: string;
  RatingValue: string;
  LocalAuthorityName?: string;
  geocode?: {
    longitude: string;
    latitude: string;
  };
  scores?: {
    Hygiene: number;
    Structural: number;
    ConfidenceInManagement: number;
  };
  BusinessType?: string;
  RatingDate?: string;
}

export interface SearchResult {
  establishments: Establishment[];
}

@Injectable({ providedIn: 'root' })
export class SearchService {
  private readonly httpClient = inject(HttpClient);
  private readonly baseUrl = 'https://api.ratings.food.gov.uk/';
  private readonly headersOptions = {
    headers: {
      'x-api-version': '2',
    },
  };

  readonly lastQuery = signal<{ name: string; postcode: string }>({
    name: '',
    postcode: '',
  });
  readonly lastResults = signal<SearchResult | null>(null);

  searchEstablishments(
    name: string,
    postcode: string
  ): Observable<SearchResult> {
    this.lastQuery.set({ name, postcode });
    const params = [
      `name=${encodeURIComponent(name)}`,
      `address=${encodeURIComponent(postcode)}`,
      'sortOptionKey=Rating',
      'ratingKeyName=RatingValue',
      'ratingOperator=eq',
      'pageSize=50',
    ].join('&');
    const obs = this.httpClient.get<SearchResult>(
      `${this.baseUrl}Establishments?${params}`,
      this.headersOptions
    );
    obs.subscribe((results) => this.lastResults.set(results));
    return obs;
  }

  getEstablishment(FHRSID: number): Observable<Establishment> {
    return this.httpClient.get<Establishment>(
      `${this.baseUrl}Establishments/${FHRSID}`,
      this.headersOptions
    );
  }
}
