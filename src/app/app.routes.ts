import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      //   import('./ratings.component').then((m) => m.RatingsComponent),
      import('./search.component').then((m) => m.SearchComponent),
  },
  {
    path: 'search',
    loadComponent: () =>
      import('./search.component').then((m) => m.SearchComponent),
  },
  {
    path: 'establishment/:id',
    loadComponent: () =>
      import('./establishment-details.component').then(
        (m) => m.EstablishmentDetailsComponent
      ),
  },
];
