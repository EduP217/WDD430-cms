import { Component } from '@angular/core';

@Component({
  selector: 'cms-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'WDD430-cms';
  selectedFeature = 'documents';

  swithView(feature: string){
    this.selectedFeature = feature;
  }
}
