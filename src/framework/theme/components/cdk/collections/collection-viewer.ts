import { CollectionViewer, ListRange } from '@angular/cdk/collections';
import { Observable } from 'rxjs';

export interface DyCollectionViewer extends CollectionViewer {
  viewChange: Observable<ListRange>;
}
