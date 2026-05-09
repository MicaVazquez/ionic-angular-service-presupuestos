import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AlertButton, AlertType } from '../components/alert-modal.component';

export interface AlertConfig {
  tipo: AlertType;
  titulo: string;
  mensaje: string;
  botones: AlertButton[];
}

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private alertSubject = new BehaviorSubject<AlertConfig | null>(null);
  alert$ = this.alertSubject.asObservable();

  private visibleSubject = new BehaviorSubject(false);
  visible$ = this.visibleSubject.asObservable();

  private close$ = new BehaviorSubject<void>(undefined);

  mostrar(config: AlertConfig) {
    this.alertSubject.next(config);
    this.visibleSubject.next(true);
  }

  error(titulo: string, mensaje: string, accion?: () => void) {
    this.mostrar({
      tipo: 'error',
      titulo,
      mensaje,
      botones: [
        {
          text: 'Entendido',
          action: accion || (() => this.cerrar()),
          variant: 'primary',
        },
      ],
    });
  }

  exito(titulo: string, mensaje: string, accion?: () => void) {
    this.mostrar({
      tipo: 'success',
      titulo,
      mensaje,
      botones: [
        {
          text: 'Entendido',
          action: accion || (() => this.cerrar()),
          variant: 'primary',
        },
      ],
    });
  }

  confirmacion(
    titulo: string,
    mensaje: string,
    onConfirm: () => void,
    onCancel?: () => void,
  ) {
    this.mostrar({
      tipo: 'warning',
      titulo,
      mensaje,
      botones: [
        {
          text: 'Cancelar',
          action: onCancel || (() => this.cerrar()),
          variant: 'secondary',
        },
        {
          text: 'Confirmar',
          action: () => {
            onConfirm();
            this.cerrar();
          },
          variant: 'primary',
        },
      ],
    });
  }

  cerrar() {
    this.visibleSubject.next(false);
  }
}
