import { Injectable } from '@angular/core';
import { of as observableOf, Observable } from 'rxjs';
import { ProgressInfo, StatsProgressBarData } from '../data/stats-progress-bar';

@Injectable()
export class StatsProgressBarService extends StatsProgressBarData {
  private progressInfoData: ProgressInfo[] = [
    {
      title: '今天的利润',
      value: 572900,
      activeProgress: 70,
      description: '比上周好（70%）',
    },
    {
      title: '新订单',
      value: 6378,
      activeProgress: 30,
      description: '比上周好（30%）',
    },
    {
      title: '新评论',
      value: 200,
      activeProgress: 55,
      description: '比上周好（55%）',
    },
  ];

  getProgressInfoData(): Observable<ProgressInfo[]> {
    return observableOf(this.progressInfoData);
  }
}
