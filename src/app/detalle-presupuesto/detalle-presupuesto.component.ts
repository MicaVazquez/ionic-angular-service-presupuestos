import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
} from '@ionic/angular/standalone';
import { Presupuesto } from '../interfaces/presupuesto';
import { DatabaseService } from '../services/database-service';
import { PdfService } from '../services/pdf-service';
import { AlertService } from '../services/alert.service';
import {
  documentOutline,
  arrowBack,
} from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-detalle-presupuesto',
  templateUrl: './detalle-presupuesto.component.html',
  styleUrls: ['./detalle-presupuesto.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
  ],
})
export class DetallePresupuestoComponent implements OnInit {
  presupuesto: Presupuesto | null = null;
  cargando = true;
  montoAnticipo = 0;
  montoSaldo = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataSrv: DatabaseService,
    private pdfSrv: PdfService,
    private alertService: AlertService,
  ) {
    addIcons({ documentOutline, arrowBack });
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      if (id) {
        this.cargarPresupuesto(id);
      }
    });
  }

  cargarPresupuesto(id: string) {
    this.cargando = true;
    this.dataSrv
      .obtenerPorId(id)
      .then((data) => {
        this.presupuesto = data;
        if (this.presupuesto) {
          this.montoAnticipo =
            this.presupuesto.anticipoMonto ||
            (this.presupuesto.total * this.presupuesto.anticipoPercent) / 100;
          this.montoSaldo = this.presupuesto.total - this.montoAnticipo;
        }
        this.cargando = false;
      })
      .catch((error) => {
        console.error('Error:', error);
        this.cargando = false;
        this.alertService.error(
          'Error',
          'No se pudo cargar el presupuesto',
          () => this.router.navigate(['/mis-presupuestos']),
        );
      });
  }

  descargarPDF() {
    if (this.presupuesto) {
      this.pdfSrv.generarPDF(this.presupuesto);
    }
  }

  formatearFecha(fecha?: string | number | Date): string {
    if (!fecha) return '';
    const d = new Date(fecha);
    return d.toLocaleDateString('es-AR');
  }

  volver() {
    this.router.navigate(['/mis-presupuestos']);
  }
}
