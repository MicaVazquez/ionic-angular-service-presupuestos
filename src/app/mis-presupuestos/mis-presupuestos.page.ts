import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonMenuButton,
} from '@ionic/angular/standalone';
import { DatabaseService } from '../services/database-service';
import { PdfService } from '../services/pdf-service';
import { Presupuesto } from '../interfaces/presupuesto';
import Swal from 'sweetalert2';
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

  constructor(
    private dataSrv: DatabaseService,
    private pdfSrv: PdfService,
    private router: Router,
  ) {}

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
      const cliente = (p.cliente || '').toLowerCase();
      const items = (p.items || [])
        .map((item) => item.descripcion || '')
        .join(' ')
        .toLowerCase();
      return cliente.includes(q) || items.includes(q);
    });
  }

  formatearFecha(fecha?: string | number | Date) {
    if (!fecha) return '';
    const d = new Date(fecha);
    const dia = d.getDate();
    const mes = d.toLocaleDateString('es-AR', { month: 'long' });
    const mesCapitalizado = mes.charAt(0).toUpperCase() + mes.slice(1);
    return `${dia} de ${mesCapitalizado}, ${d.getFullYear()}`;
  }

  formatearMonto(monto: number) {
    return monto.toLocaleString('es-AR', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    });
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

  editarPresupuesto(presupuesto: Presupuesto) {
    if (!presupuesto.id) return;
    this.router.navigate(['/nuevo-presupuesto', presupuesto.id]);
  }

  nuevoPresupuesto() {
    this.router.navigate(['/nuevo-presupuesto']);
  }

  descargarPDF(presupuesto: Presupuesto) {
    this.pdfSrv.generarPDF(presupuesto);
  }

  compartirWhatsApp(presupuesto: Presupuesto) {
    console.log('Compartir WhatsApp', presupuesto);
  }

  async eliminarPresupuesto(presupuesto: Presupuesto) {
    if (!presupuesto.id) return;

    const result = await Swal.fire({
      title: '¿Eliminar presupuesto?',
      text: `Se eliminará el presupuesto de ${presupuesto.cliente}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      heightAuto: false,
      backdrop: true,
    });
    if (!result.isConfirmed) return;

    try {
      await this.dataSrv.eliminar(presupuesto.id);
      this.presupuestos = this.presupuestos.filter(
        (p) => p.id !== presupuesto.id,
      );
      this.filtrarPresupuestos();
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo eliminar el presupuesto',
        heightAuto: false,
        backdrop: true,
      });
    }
  }

  get totalBorradores() {
    return this.presupuestos.filter((p) => p.estado === 'borrador').length;
  }
}
