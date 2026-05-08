import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
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
import { DatabaseService } from '../services/database-service';
@Component({
  selector: 'app-nuevo-presupuesto',
  templateUrl: './nuevo-presupuesto.page.html',
  styleUrls: ['./nuevo-presupuesto.page.scss'],
  standalone: true,
  imports: [
    IonButtons,

    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,

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
  modoEdicion = false;
  presupuestoId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private databaseService: DatabaseService,
  ) {}

  ngOnInit() {
    this.inicializarFormulario();

    this.route.params.subscribe((params) => {
      const id = params['id'];
      if (id) {
        this.modoEdicion = true;
        this.presupuestoId = id;
        // Limpiar el item vacío que se agregó en inicializarFormulario
        this.items.clear();
        this.cargarPresupuesto(id);
      }
    });

    this.presupuestoForm.valueChanges.subscribe(() => {
      this.calcularTotal();
    });
  }

  private inicializarFormulario() {
    this.presupuestoForm = this.fb.group({
      cliente: ['', Validators.required],
      fecha: [new Date().toISOString().slice(0, 10), Validators.required],
      anticipo: [0, [Validators.required, Validators.min(0)]],
      items: this.fb.array([]),
      observaciones: [''],
    });

    // Siempre arrancamos con un item vacío
    this.agregarItem();
  }

  private cargarPresupuesto(id: string) {
    this.databaseService
      .obtenerPorId(id)
      .then((presupuesto) => {
        if (presupuesto) {
          // Cargar datos en el formulario
          this.presupuestoForm.patchValue({
            cliente: presupuesto.cliente,
            fecha: presupuesto.fecha,
            anticipo: presupuesto.anticipoPercent,
            observaciones: presupuesto.observaciones || '',
          });

          // Cargar items
          const itemsArray = this.presupuestoForm.get('items') as FormArray;
          presupuesto.items.forEach((item) => {
            itemsArray.push(
              this.fb.group({
                descripcion: [item.descripcion, Validators.required],
                precio: [item.precio, [Validators.required, Validators.min(0)]],
              }),
            );
          });

          this.calcularTotal();
        }
      })
      .catch((error) => {
        console.error('Error al cargar presupuesto:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo cargar el presupuesto',
          heightAuto: false,
        });
        this.router.navigate(['/mis-presupuestos']);
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

  // Guardar presupuesto (nuevo o edición)
  guardar() {
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

    const observaciones = this.presupuestoForm.get('observaciones')?.value;
    const presupuesto: Presupuesto = {
      cliente: this.presupuestoForm.get('cliente')?.value,
      fecha: this.presupuestoForm.get('fecha')?.value,
      anticipoPercent: this.presupuestoForm.get('anticipo')?.value || 0,
      items: this.items.value,
      total: this.total,
      estado: 'finalizado',
      ...(observaciones ? { observaciones } : {}),
    };

    if (this.modoEdicion && this.presupuestoId) {
      // Actualizar presupuesto existente
      this.databaseService
        .actualizar(this.presupuestoId, presupuesto)
        .then(() => {
          this.resetearFormulario();
          this.mostrarExito('Presupuesto actualizado correctamente');
          this.router.navigate(['/mis-presupuestos']);
        })
        .catch((error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al actualizar el presupuesto',
            heightAuto: false,
            backdrop: true,
          });
        });
    } else {
      // Guardar presupuesto nuevo
      this.databaseService
        .guardar(presupuesto)
        .then(() => {
          this.resetearFormulario();
          this.mostrarExito('Presupuesto guardado correctamente');
          this.router.navigate(['/mis-presupuestos']);
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
    }
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
    this.router.navigate(['/mis-presupuestos']);
  }

  mostrarExito(mensaje: string = 'Presupuesto guardado correctamente') {
    Swal.fire({
      icon: 'success',
      title: 'Éxito',
      text: mensaje,
      heightAuto: false,
      backdrop: true,
    });
  }

  private resetearFormulario() {
    this.presupuestoForm.reset({
      cliente: '',
      fecha: new Date().toISOString().slice(0, 10),
      anticipo: 0,
      observaciones: '',
    });
    // Limpiar items y agregar uno vacío
    this.items.clear();
    this.agregarItem();
    this.subtotal = 0;
    this.anticipoAmount = 0;
    this.total = 0;
  }
}
