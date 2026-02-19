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
import { DatabaseService } from '../services/database-service';
import { Presupuesto } from '../interfaces/presupuesto';
import { cogSharp } from 'ionicons/icons';
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
  presupuestos: Presupuesto[] = [];
  presupuestosFiltrados: Presupuesto[] = [];
  busqueda: string = '';

  constructor(private dataSrv: DatabaseService) {}

  ngOnInit() {
    this.dataSrv.obtenerTodos().then((data) => {
      this.presupuestos = data || [];
      this.presupuestosFiltrados = [...this.presupuestos];
    });
  }

  filtrarPresupuestos() {
    const q = (this.busqueda || '').trim().toLowerCase();
    if (!q) {
      this.presupuestosFiltrados = [...this.presupuestos];
      return;
    }
    this.presupuestosFiltrados = this.presupuestos.filter((p) => {
      return (p.cliente || '').toLowerCase().includes(q);
    });
  }

  formatearFecha(fecha?: string | number | Date) {
    if (!fecha) return '';
    const d = new Date(fecha);
    return d.toLocaleDateString();
  }

  getTotalPresupuesto(presupuesto: Presupuesto) {
    if (!presupuesto) return 0;
    if (typeof presupuesto.total === 'number') return presupuesto.total;
    if (!presupuesto.items) return 0;
    return presupuesto.items.reduce((s, it) => s + (it.precio || 0), 0);
  }

  getTotalItems(presupuesto: Presupuesto) {
    if (!presupuesto || !presupuesto.items) return 0;
    return presupuesto.items.length;
  }

  // Acciones (stubs — implementar según necesidad)
  editarPresupuesto(presupuesto: Presupuesto) {
    console.log('Editar', presupuesto);
  }

  descargarPDF(presupuesto: Presupuesto) {
    console.log('Descargar PDF', presupuesto);
  }

  compartirWhatsApp(presupuesto: Presupuesto) {
    console.log('Compartir WhatsApp', presupuesto);
  }

  eliminarPresupuesto(presupuesto: Presupuesto) {
    console.log('Eliminar', presupuesto);
    // ejemplo: filtrar de la lista localmente
    this.presupuestos = this.presupuestos.filter((p) => p !== presupuesto);
    this.filtrarPresupuestos();
  }

  get totalBorradores() {
    // Si no existe campo `estado`, consideramos 'borrador' a los presupuestos con total === 0
    return this.presupuestos.filter((p) =>
      (p as any).estado
        ? ((p as any).estado || '').toLowerCase() === 'borrador'
        : typeof p.total === 'number'
          ? p.total === 0
          : false,
    ).length;
  }
}
