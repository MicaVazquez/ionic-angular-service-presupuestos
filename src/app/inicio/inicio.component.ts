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
import { DatabaseService } from '../services/database-service';

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
  constructor(private router: Router, private databaseService: DatabaseService) {}

  ngOnInit() {
    this.databaseService.obtenerTodos().then((presupuestos) => 
      console.log('Presupuestos en InicioComponent:', presupuestos));
  }

  crearPrimerPresupuesto() {
    this.router.navigate(['/nuevo-presupuesto']);
  }
 
}
