import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  IonApp,
  IonSplitPane,
  IonMenu,
  IonContent,
  IonList,
  IonMenuToggle,
  IonItem,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonRouterLink,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  addCircle,
  addCircleOutline,
  addCircleSharp,
  downloadOutline,
  close,
  checkmark,
  add,
  documentTextOutline,
  documentText,
  documentTextSharp,
  checkmarkCircle,
  folderOutline,
  folderSharp,
} from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [
    RouterLink,
    RouterLinkActive,
    IonApp,
    IonSplitPane,
    IonMenu,
    IonContent,
    IonList,
    IonMenuToggle,
    IonItem,
    IonIcon,
    IonLabel,
    IonRouterLink,
    IonRouterOutlet,
  ],
})
export class AppComponent {
  public appPages = [
    {
      title: 'Nuevo Presupuesto',
      url: '/nuevo-presupuesto',
      icon: 'add-circle',
    },
    {
      title: 'Mis Presupuestos',
      url: '/mis-presupuestos',
      icon: 'folder',
    },
  ];

  constructor() {
    addIcons({
      addCircle,
      addCircleOutline,
      addCircleSharp,
      documentTextOutline,
      documentText,
      documentTextSharp,
      folderOutline,
      folderSharp,
      downloadOutline,
      close,
      checkmark,
      add,
      checkmarkCircle,
    });
  }
}
