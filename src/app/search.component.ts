import {
  Component,
  ChangeDetectionStrategy,
  signal,
  OnInit,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { SearchService, Establishment } from './search.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

interface SearchQuery {
  name?: string;
  postcode?: string;
}

@Component({
  selector: 'app-search',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    ReactiveFormsModule,
  ],
  template: `
    <div class="flex flex-col items-center gap-8 py-8">
      <mat-card class="w-full max-w-4xl shadow-lg">
        <mat-card-header>
          <mat-card-title class="text-xl font-bold"
            >Search Establishments</mat-card-title
          >
        </mat-card-header>
        <mat-card-content>
          <form
            [formGroup]="form"
            class="flex flex-col gap-6"
            (ngSubmit)="onSearch()"
          >
            <mat-form-field class="w-full">
              <mat-label class="text-base font-semibold text-gray-700"
                >Name</mat-label
              >
              <input matInput formControlName="name" class="text-base" />
            </mat-form-field>
            <mat-form-field class="w-full">
              <mat-label class="text-base font-semibold text-gray-700"
                >Postcode</mat-label
              >
              <input matInput formControlName="postcode" class="text-base" />
            </mat-form-field>
            <button
              mat-raised-button
              color="primary"
              class="w-full mt-2"
              type="submit"
            >
              Search
            </button>
          </form>
          <div class="mt-6">
            @if (loading()) {
            <div class="text-center py-4 text-gray-500">Searching...</div>
            } @else { @if (results().length === 0 && searched()) {
            <div class="text-center py-4 text-gray-500">No results found.</div>
            } @else {
            <div class="overflow-x-auto">
              <table
                mat-table
                [dataSource]="results()"
                class="min-w-full divide-y divide-gray-200"
              >
                <ng-container matColumnDef="BusinessName">
                  <th
                    mat-header-cell
                    *matHeaderCellDef
                    class="px-4 py-2 text-left font-semibold"
                  >
                    Name
                  </th>
                  <td mat-cell *matCellDef="let est" class="px-4 py-2">
                    {{ est.BusinessName }}
                  </td>
                </ng-container>
                <ng-container matColumnDef="Address">
                  <th
                    mat-header-cell
                    *matHeaderCellDef
                    class="px-4 py-2 text-left font-semibold"
                  >
                    Address
                  </th>
                  <td mat-cell *matCellDef="let est" class="px-4 py-2">
                    {{ est.AddressLine1 }} {{ est.AddressLine2 }}
                    {{ est.AddressLine3 }} {{ est.AddressLine4 }}
                    {{ est.PostCode }}
                  </td>
                </ng-container>
                <ng-container matColumnDef="RatingValue">
                  <th
                    mat-header-cell
                    *matHeaderCellDef
                    class="px-4 py-2 text-left font-semibold"
                  >
                    Rating
                  </th>
                  <td
                    mat-cell
                    *matCellDef="let est"
                    class="px-4 py-2 font-bold text-blue-600"
                  >
                    {{ est.RatingValue }}
                  </td>
                </ng-container>
                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr
                  mat-row
                  *matRowDef="let row; columns: displayedColumns"
                  (click)="viewDetails(row.FHRSID)"
                  class="cursor-pointer hover:bg-blue-50"
                ></tr>
              </table>
            </div>
            } }
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnInit {
  private readonly searchService = inject(SearchService);
  private readonly router = inject(Router);
  form = new FormGroup({
    name: new FormControl(this.searchService.lastQuery().name),
    postcode: new FormControl(this.searchService.lastQuery().postcode),
  });
  private readonly _results = signal<Establishment[]>([]);
  readonly results = this._results.asReadonly();
  readonly loading = signal(false);
  readonly searched = signal(false);
  readonly displayedColumns = ['BusinessName', 'Address', 'RatingValue'];

  readonly lastQuery = signal<SearchQuery>({
    name: '',
    postcode: '',
  });

  onSearch() {
    this.loading.set(true);
    this.searched.set(true);
    const { name, postcode } = this.form.value;
    this.lastQuery.set({
      name: name ?? '',
      postcode: postcode ?? '',
    });
    this.searchService
      .searchEstablishments(name ?? '', postcode ?? '')
      .subscribe({
        next: (response) => {
          this._results.set(response.establishments ?? []);
          this.loading.set(false);
        },
        error: () => {
          this._results.set([]);
          this.loading.set(false);
        },
      });
  }

  viewDetails(id: number) {
    this.router.navigate(['/establishment', id]);
  }

  ngOnInit() {
    const lastResults = this.searchService.lastResults();
    const lastQuery = this.searchService.lastQuery();
    if (lastResults && lastResults.establishments.length > 0) {
      this._results.set(lastResults.establishments);
      this.form.setValue({
        name: lastQuery.name,
        postcode: lastQuery.postcode,
      });
      this.searched.set(true);
    }
  }
}
