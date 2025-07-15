import { Injectable, signal } from '@angular/core';
import { inject } from '@angular/core';

export type Rating = {
  id: number;
  name: string;
  score: string;
};

@Injectable({ providedIn: 'root' })
export class RatingsService {
  private readonly _ratings = signal<Rating[]>([]);
  readonly ratings = this._ratings.asReadonly();

  async fetchRatings(): Promise<void> {
    // Simulate API call
    const response = await fetch('/api/ratings');
    const data = await response.json();
    this._ratings.set(data);
  }
}
