import { Injectable } from '@angular/core';
import { of as observableOf, Observable } from 'rxjs';
import { Camera, SecurityCamerasData } from '../data/security-cameras';

@Injectable()
export class SecurityCamerasService extends SecurityCamerasData {

  private cameras: Camera[] = [
    {
      title: '照相机 #1',
      source: 'assets/images/camera1.jpg',
    },
    {
      title: '照相机 #2',
      source: 'assets/images/camera2.jpg',
    },
    {
      title: '照相机 #3',
      source: 'assets/images/camera3.jpg',
    },
    {
      title: '照相机 #4',
      source: 'assets/images/camera4.jpg',
    },
  ];

  getCamerasData(): Observable<Camera[]> {
    return observableOf(this.cameras);
  }
}
