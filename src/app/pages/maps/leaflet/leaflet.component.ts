import { Component } from '@angular/core';

import * as L from 'leaflet';
import 'style-loader!leaflet/dist/leaflet.css';

@Component({
  selector: 'ngx-leaflet',
  styleUrls: ['./leaflet.component.scss'],
  template: `
    <dy-card>
      <dy-card-header>Leaflet Maps</dy-card-header>
      <dy-card-body>
        <div leaflet [leafletOptions]="options"></div>
      </dy-card-body>
    </dy-card>
  `,
})
export class LeafletComponent {

  options = {
    layers: [
      L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' }),
    ],
    zoom: 5,
    center: L.latLng({ lat: 38.991709, lng: -76.886109 }),
  };
}
