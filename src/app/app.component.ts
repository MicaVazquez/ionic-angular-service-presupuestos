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
import { CommonModule } from '@angular/common';
import { AlertModalComponent } from './components/alert-modal.component';
import { AlertService } from './services/alert.service';
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
  closeCircle,
  warning,
  informationCircle,
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
    CommonModule,
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
    AlertModalComponent,
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

  alert$ = this.alertService.alert$;
  visible$ = this.alertService.visible$;

  constructor(private alertService: AlertService) {
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
      closeCircle,
      warning,
      informationCircle,
    });
  }

  onAlertClose() {
    this.alertService.cerrar();
  }
}
