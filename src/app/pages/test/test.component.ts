import { Component, OnInit } from '@angular/core';
import { DyComponentShape, DyComponentSize, DyComponentStatus, DyThemeService } from 'src/framework/theme/public_api';


@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {
  themes = [
    {
      value: 'default',
      name: 'Light',
    },
    {
      value: 'dark',
      name: 'Dark',
    },
    {
      value: 'cosmic',
      name: 'Cosmic',
    },
    {
      value: 'corporate',
      name: 'Corporate',
    },
    {
      value: 'material-light',
      name: 'Material Light',
    },
    {
      value: 'material-dark',
      name: 'Material Dark',
    },
    {
      value: 'material',
      name: 'Material',
    },
    {
      value: 'header',
      name: 'Header',
    },
  ];
  currentTheme = 'default';
  constructor(private dythemeservices:DyThemeService) { }
  statuses: DyComponentStatus[] = [ 'primary', 'success', 'info', 'warning', 'danger' ];
  shapes: DyComponentShape[] = [ 'rectangle', 'semi-round', 'round' ];
  sizes: DyComponentSize[] = [ 'tiny', 'small', 'medium', 'large', 'giant' ];

  flag: boolean = false;
  onClose() {
  this.flag = true;
  }
  ngOnInit() {
  }
  changeTheme(themeName){
    this.dythemeservices.changeTheme(themeName);
  }
}
