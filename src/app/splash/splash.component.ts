import { Component, OnInit, inject } from '@angular/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { IonSpinner } from '@ionic/angular/standalone';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.scss'],
  imports: [IonSpinner],
})
export class SplashComponent implements OnInit {
  router_service = inject(Router);
  authService = inject(AuthService);
  private iniciado = false;

  constructor(private platform: Platform) {}

  ionViewDidEnter() {
    this.iniciarSplash();
  }

  ngOnInit(): void {
    this.iniciarSplash();
  }

  private iniciarSplash() {
    if (this.iniciado) {
      return;
    }

    this.iniciado = true;
    this.platform.ready().then(() => {
      SplashScreen.hide().finally(() => {
        setTimeout(() => {
          const ruta = this.authService.estaLogueado ? 'mis-presupuestos' : 'login';
          this.router_service.navigate([ruta]);
        }, 2200);
      });
    });
  }
}
