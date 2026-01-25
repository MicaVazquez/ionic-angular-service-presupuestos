import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  IonButtons,
  IonMenuButton,
} from '@ionic/angular/standalone';
import { Presupuesto } from '../interfaces/presupuesto';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { DatabaseService } from '../services/database-service';
@Component({
  selector: 'app-nuevo-presupuesto',
  templateUrl: './nuevo-presupuesto.page.html',
  styleUrls: ['./nuevo-presupuesto.page.scss'],
  standalone: true,
  imports: [
    IonButtons,
    IonLabel,
    IonItem,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    IonButton,
    IonInput,
    FormsModule,
    IonIcon,
    ReactiveFormsModule,
    IonMenuButton,
  ],
})
export class NuevoPresupuestoPage implements OnInit {
  presupuestoForm!: FormGroup;
  subtotal = 0;
  anticipoAmount = 0;
  total = 0;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private databaseService: DatabaseService,
  ) {}

  ngOnInit() {
    this.presupuestoForm = this.fb.group({
      cliente: ['', Validators.required],
      fecha: [new Date().toISOString().slice(0, 10), Validators.required],
      anticipo: [0, [Validators.required, Validators.min(0)]],
      items: this.fb.array([]),
      observaciones: [''],
    });

    // Arrancamos con un item
    this.agregarItem();

    // Escuchar cambios para recalcular total
    this.presupuestoForm.valueChanges.subscribe(() => {
      this.calcularTotal();
    });
  }

  // Getter
  get items(): FormArray {
    return this.presupuestoForm.get('items') as FormArray;
  }

  // Crear item
  nuevoItem(): FormGroup {
    return this.fb.group({
      descripcion: ['', Validators.required],
      precio: [0, [Validators.required, Validators.min(0)]],
    });
  }

  // Agregar item
  agregarItem() {
    this.items.push(this.nuevoItem());
  }

  // Eliminar
  eliminarItem(index: number) {
    this.items.removeAt(index);
  }

  // Calcular total
  calcularTotal() {
    this.subtotal = this.items.controls.reduce((acc, item) => {
      const precio = item.get('precio')?.value || 0;
      return acc + precio;
    }, 0);

    // Calcular Anticipo basado en el porcentaje ingresado
    const anticipoPercent = this.presupuestoForm.get('anticipo')?.value || 0;
    this.anticipoAmount = this.subtotal * (anticipoPercent / 100);

    // Total = Subtotal (sin sumar anticipo, solo se muestra como referencia)
    this.total = this.subtotal;
  }

  // Guardar presupuesto
  guardar() {
    console.log(this.presupuestoForm.value);
    // this.presupuestoForm.markAllAsTouched();
    // this.presupuestoForm.updateValueAndValidity();
    if (!this.presupuestoForm.valid) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Completá los campos obligatorios',
        heightAuto: false,
        backdrop: true,
      });
      return;
    }

    const presupuesto: Presupuesto = {
      cliente: this.presupuestoForm.get('cliente')?.value,
      fecha: this.presupuestoForm.get('fecha')?.value,
      anticipoPercent: this.presupuestoForm.get('anticipo')?.value || 0,
      anticipoMonto: this.anticipoAmount,
      items: this.items.value,
      total: this.total,
      observaciones: this.presupuestoForm.get('observaciones')?.value, //consultar lo de observaciones
    };

    // Guardar

    this.databaseService
      .guardar(presupuesto)
      .then(() => {
        this.mostrarExito();
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al guardar el presupuesto',
          heightAuto: false,
          backdrop: true,
        });
      });

    // Aquí puedes redirigir a otra página si lo deseas
    this.router.navigate(['/home']);
  }

  // Cancelar y volver atrás
  cancelar() {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Se perderán los cambios no guardados',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No, volver',
      heightAuto: false,
      backdrop: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.confirmarCancelacion();
      }
    });
  }

  confirmarCancelacion() {
    this.presupuestoForm.reset();
    // Aquí puedes redirigir a otra página si lo deseas
    this.router.navigate(['/home']);
  }

  mostrarExito() {
    Swal.fire({
      icon: 'success',
      title: 'Éxito',
      text: 'Presupuesto guardado correctamente',
      heightAuto: false,
      backdrop: true,
    }).then(() => {
      this.router.navigate(['/home']);
    });
  }
}
