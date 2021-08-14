import { Component, OnDestroy } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import { DyMediaBreakpoint, DyThemeService, DyMediaBreakpointsService } from 'src/framework/theme/public_api';
import { CountryOrderData } from '../../../@core/data/country-order';

@Component({
  selector: 'ngx-country-orders',
  styleUrls: ['./country-orders.component.scss'],
  template: `
    <dy-card [size]="breakpoint.width >= breakpoints.md ? 'medium' : 'giant'">
      <dy-card-header>Country Orders Statistics</dy-card-header>
      <dy-card-body>
        <ngx-country-orders-map (select)="selectCountryById($event)"
                                countryId="USA">
        </ngx-country-orders-map>
        <ngx-country-orders-chart [countryName]="countryName"
                                  [data]="countryData"
                                  [labels]="countriesCategories"
                                  maxValue="20">
        </ngx-country-orders-chart>
      </dy-card-body>
    </dy-card>
  `,
})
export class CountryOrdersComponent implements OnDestroy {

  private alive = true;

  countryName = '';
  countryData: number[] = [];
  countriesCategories: string[];
  breakpoint: DyMediaBreakpoint = { name: '', width: 0 };
  breakpoints: any;

  constructor(private themeService: DyThemeService,
              private breakpointService: DyMediaBreakpointsService,
              private countryOrderService: CountryOrderData) {
    this.breakpoints = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(takeWhile(() => this.alive))
      .subscribe(([oldValue, newValue]) => {
        this.breakpoint = newValue;
      });
    this.countryOrderService.getCountriesCategories()
      .pipe(takeWhile(() => this.alive))
      .subscribe((countriesCategories) => {
        this.countriesCategories = countriesCategories;
      });
  }

  selectCountryById(countryName: string) {
    this.countryName = countryName;

    this.countryOrderService.getCountriesCategoriesData(countryName)
      .pipe(takeWhile(() => this.alive))
      .subscribe((countryData) => {
        this.countryData = countryData;
      });
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
