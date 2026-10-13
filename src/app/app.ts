import { Component } from '@angular/core';
import { LandingPageComponent } from './landing-page/landing-page';
@Component({
  standalone: true,
  imports: [LandingPageComponent],
  selector: 'app-root',
  styleUrls: ['./app.css'],
  templateUrl: './app.html',
})
export class App {
}
