import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonIcon,
  IonButtons,
  IonMenuButton,
  IonSpinner,
} from '@ionic/angular/standalone';
import { Presupuesto } from '../interfaces/presupuesto';
import { ReactiveFormsModule } from '@angular/forms';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormArray,
  ValidationErrors,
  Validators,
} from '@angular/forms';

// Validator: rechaza strings que solo contienen espacios
function noSoloEspacios(control: AbstractControl): ValidationErrors | null {
  const valor = control.value;
  if (typeof valor !== 'string') return null;
  if (valor.length === 0) return null; // que required se encargue del vacío
  return valor.trim().length === 0 ? { soloEspacios: true } : null;
}

// Validator: rechaza strings que contienen números
function sinNumeros(control: AbstractControl): ValidationErrors | null {
  const valor = control.value;
  if (typeof valor !== 'string' || valor.length === 0) return null;
  return /\d/.test(valor) ? { contieneNumeros: true } : null;
}
import { DatabaseService } from '../services/database-service';
import { AlertService } from '../services/alert.service';
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
    IonSpinner,
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
  cargandoPresupuesto = false;
  modalExitoVisible = false;
  mensajeExito = '';
  private fechaOriginal: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private databaseService: DatabaseService,
    private alertService: AlertService,
  ) {}

  ngOnInit() {
    this.inicializarFormulario();

    this.route.params.subscribe((params) => {
      const id = params['id'];
      if (id) {
        this.modoEdicion = true;
        this.presupuestoId = id;
        this.cargandoPresupuesto = true;
        // Limpiar el item vacío que se agregó en inicializarFormulario
        this.items.clear();
        this.cargarPresupuesto(id);
      } else {
        this.modoEdicion = false;
        this.presupuestoId = null;
        this.cargandoPresupuesto = false;
      }
    });

    this.presupuestoForm.valueChanges.subscribe(() => {
      this.calcularTotal();
    });
  }

  private inicializarFormulario() {
    this.presupuestoForm = this.fb.group({
      cliente: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100),
          noSoloEspacios,
          sinNumeros,
        ],
      ],
      anticipo: [
        0,
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],
      items: this.fb.array([], Validators.required),
      observaciones: ['', Validators.maxLength(1000)],
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
          this.fechaOriginal = presupuesto.fecha;
          this.presupuestoForm.patchValue({
            cliente: presupuesto.cliente,
            anticipo: presupuesto.anticipoPercent,
            observaciones: presupuesto.observaciones || '',
          });

          // Cargar items
          const itemsArray = this.presupuestoForm.get('items') as FormArray;
          presupuesto.items.forEach((item) => {
            itemsArray.push(
              this.fb.group({
                descripcion: [
                  item.descripcion,
                  [
                    Validators.required,
                    Validators.minLength(3),
                    Validators.maxLength(500),
                    noSoloEspacios,
                  ],
                ],
                precio: [item.precio, [Validators.required]],
              }),
            );
          });

          this.calcularTotal();
        } else {
          this.alertService.error(
            'No encontrado',
            'No se encontro el presupuesto solicitado',
            () => this.router.navigate(['/mis-presupuestos']),
          );
        }
      })
      .catch((error) => {
        console.error('Error al cargar presupuesto:', error);
        this.alertService.error(
          'Error',
          'No se pudo cargar el presupuesto',
          () => this.router.navigate(['/mis-presupuestos']),
        );
      })
      .finally(() => {
        this.cargandoPresupuesto = false;
      });
  }

  // Getter
  get items(): FormArray {
    return this.presupuestoForm.get('items') as FormArray;
  }

  // Crear item
  nuevoItem(): FormGroup {
    return this.fb.group({
      descripcion: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(500),
          noSoloEspacios,
        ],
      ],
      precio: [null, [Validators.required]],
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

  // Helpers para validación en el template
  campoInvalido(nombre: string): boolean {
    const control = this.presupuestoForm.get(nombre);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  itemCampoInvalido(index: number, nombre: string): boolean {
    const control = this.items.at(index).get(nombre);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  private marcarTodoComoTocado(grupo: FormGroup | FormArray) {
    Object.values(grupo.controls).forEach((control) => {
      control.markAsTouched();
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.marcarTodoComoTocado(control);
      }
    });
  }

  // Guardar presupuesto (nuevo o edición)
  guardar() {
    if (!this.presupuestoForm.valid) {
      this.marcarTodoComoTocado(this.presupuestoForm);
      this.alertService.error(
        'Revisá los campos',
        'Hay datos faltantes o inválidos en el formulario',
      );
      return;
    }

    const observacionesRaw = this.presupuestoForm.get('observaciones')?.value;
    const observaciones =
      typeof observacionesRaw === 'string' ? observacionesRaw.trim() : '';
    const presupuesto: Presupuesto = {
      cliente: this.presupuestoForm.get('cliente')?.value,
      fecha: this.modoEdicion
        ? this.fechaOriginal
        : new Date().toISOString().slice(0, 10),
      anticipoPercent: this.presupuestoForm.get('anticipo')?.value || 0,
      items: this.items.value,
      total: this.total,
      estado: 'finalizado',
      observaciones: observaciones || null,
    };

    if (this.modoEdicion && this.presupuestoId) {
      // Actualizar presupuesto existente
      this.databaseService
        .actualizar(this.presupuestoId, presupuesto)
        .then(() => {
          this.resetearFormulario();
          this.mostrarExito('Presupuesto actualizado correctamente');
        })
        .catch((error) => {
          this.alertService.error(
            'Error',
            'Hubo un error al actualizar el presupuesto',
          );
        });
    } else {
      // Guardar presupuesto nuevo
      this.databaseService
        .guardar(presupuesto)
        .then(() => {
          this.resetearFormulario();
          this.mostrarExito('Presupuesto guardado correctamente');
        })
        .catch((error) => {
          this.alertService.error(
            'Error',
            'Hubo un error al guardar el presupuesto',
          );
        });
    }
  }

  // Cancelar y volver atrás
  cancelar() {
    this.alertService.confirmacion(
      '¿Estás seguro?',
      'Se perderán los cambios no guardados',
      () => this.confirmarCancelacion(),
    );
  }

  confirmarCancelacion() {
    this.presupuestoForm.reset();
    // Aquí puedes redirigir a otra página si lo deseas
    this.router.navigate(['/mis-presupuestos']);
  }

  mostrarExito(mensaje: string = 'Presupuesto guardado correctamente') {
    this.mensajeExito = mensaje;
    this.modalExitoVisible = true;
  }

  cerrarModalExito() {
    this.modalExitoVisible = false;
    this.router.navigate(['/mis-presupuestos']);
  }

  private resetearFormulario() {
    this.presupuestoForm.reset({
      cliente: '',
      anticipo: 0,
      observaciones: '',
    });
    this.fechaOriginal = '';
    // Limpiar items y agregar uno vacío
    this.items.clear();
    this.agregarItem();
    this.subtotal = 0;
    this.anticipoAmount = 0;
    this.total = 0;
  }
}
