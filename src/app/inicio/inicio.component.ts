import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonHeader,
  IonContent,
  IonButtons,
  IonToolbar,
  IonTitle,
  IonMenuButton,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss'],
  imports: [
    IonHeader,
    IonContent,

    IonButtons,
    IonToolbar,
    IonTitle,
    IonMenuButton,
    IonButton,
    IonIcon,
    RouterLink,
  ],
})
export class InicioComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  crearPrimerPresupuesto() {
    this.router.navigate(['/nuevo-presupuesto']);
  }
}
