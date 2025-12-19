import { Component, OnInit, inject } from '@angular/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { IonSpinner, IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.scss'],
  imports: [IonSpinner, IonIcon],
})
export class SplashComponent implements OnInit {
  router_service = inject(Router);

  constructor(private platform: Platform) {}

  ionViewDidEnter() {
    this.platform.ready().then(() => {
      SplashScreen.hide().then(() => {
        setTimeout(() => {
          this.router_service.navigate(['home']);
        }, 3000);
      });
    });
  }

  ngOnInit(): void {}
}
