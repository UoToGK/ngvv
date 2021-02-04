import { Component, OnDestroy, OnInit } from '@angular/core';
import { DyThemeService } from 'src/framework/theme/public_api';
import { takeWhile } from 'rxjs/operators' ;
import { SolarData } from '../../@core/data/solar';
import { AbService } from '../../@core/utils/ab.service';

interface CardSettings {
  title: string;
  iconClass: string;
  type: string;
}

@Component({
  selector: 'ngx-dashboard',
  styleUrls: ['./dashboard.component.scss'],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {

  private alive = true;
  showCallAction = true;

  solarValue: number;
  lightCard: CardSettings = {
    title: '浅色',
    iconClass: 'dy-lightbulb',
    type: 'primary',
  };
  rollerShadesCard: CardSettings = {
    title: '卷帘',
    iconClass: 'dy-roller-shades',
    type: 'success',
  };
  wirelessAudioCard: CardSettings = {
    title: '无线音频',
    iconClass: 'dy-audio',
    type: 'info',
  };
  coffeeMakerCard: CardSettings = {
    title: '咖啡机',
    iconClass: 'dy-coffee-maker',
    type: 'warning',
  };

  statusCards: string;

  commonStatusCardsSet: CardSettings[] = [
    this.lightCard,
    this.rollerShadesCard,
    this.wirelessAudioCard,
    this.coffeeMakerCard,
  ];

  statusCardsByThemes: {
    default: CardSettings[];
    cosmic: CardSettings[];
    corporate: CardSettings[];
    dark: CardSettings[];
    'material-dark': CardSettings[];
    'material-light': CardSettings[];
  } = {
    default: this.commonStatusCardsSet,
    cosmic: this.commonStatusCardsSet,
    corporate: [
      {
        ...this.lightCard,
        type: 'warning',
      },
      {
        ...this.rollerShadesCard,
        type: 'primary',
      },
      {
        ...this.wirelessAudioCard,
        type: 'danger',
      },
      {
        ...this.coffeeMakerCard,
        type: 'info',
      },
    ],
    dark: this.commonStatusCardsSet,
    'material-dark': this.commonStatusCardsSet,
    'material-light': this.commonStatusCardsSet,
  };

  constructor(private themeService: DyThemeService,
              private solarService: SolarData,
              private abService: AbService) {
    this.themeService.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
        this.statusCards = this.statusCardsByThemes[theme.name];
    });

    this.solarService.getSolarData()
      .pipe(takeWhile(() => this.alive))
      .subscribe((data) => {
        this.solarValue = data;
      });
  }

  ngOnInit() {
    this.abService.onAbEvent(AbService.VARIANT_HIDE_CALL_ACTION)
      .pipe(takeWhile(() => this.alive))
      .subscribe(() => this.showCallAction = false );
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
