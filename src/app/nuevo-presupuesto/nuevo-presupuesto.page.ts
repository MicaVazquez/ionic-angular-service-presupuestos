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
  IonText,
  IonIcon,
  IonButtons,
  IonMenuButton,
  IonDatetime,
} from '@ionic/angular/standalone';
import { Presupuesto } from '../interfaces/presupuesto';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
@Component({
  selector: 'app-nuevo-presupuesto',
  templateUrl: './nuevo-presupuesto.page.html',
  styleUrls: ['./nuevo-presupuesto.page.scss'],
  standalone: true,
  imports: [
    IonDatetime,
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
    IonText,
    IonIcon,
    ReactiveFormsModule,
    IonMenuButton,
  ],
})
export class NuevoPresupuestoPage implements OnInit {
  presupuestoForm!: FormGroup;
  total = 0;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.presupuestoForm = this.fb.group({
      cliente: [''],
      fecha: [new Date().toISOString().slice(0, 10), Validators.required],
      items: this.fb.array([]),
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
      descripcion: [''],
      cantidad: [1, [Validators.required, Validators.min(1)]],
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
    this.total = this.items.controls.reduce((acc, item) => {
      const cantidad = item.get('cantidad')?.value || 0;
      const precio = item.get('precio')?.value || 0;
      return acc + cantidad * precio;
    }, 0);
  }
}
