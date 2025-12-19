import { Component, OnInit } from '@angular/core';
import {
  IonHeader,
  IonContent,
  IonMenu,
  IonButtons,
  IonToolbar,
  IonTitle,
  IonMenuButton,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss'],
  imports: [
    IonHeader,
    IonContent,
    IonMenu,
    IonButtons,
    IonToolbar,
    IonTitle,
    IonMenuButton,
  ],
})
export class InicioComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
