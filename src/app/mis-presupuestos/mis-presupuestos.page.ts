import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonMenuButton,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-mis-presupuestos',
  templateUrl: './mis-presupuestos.page.html',
  styleUrls: ['./mis-presupuestos.page.scss'],
  standalone: true,
  imports: [
    IonButtons,
    IonMenuButton,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
  ],
})
export class MisPresupuestosPage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
