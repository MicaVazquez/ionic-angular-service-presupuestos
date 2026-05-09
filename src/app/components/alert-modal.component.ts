import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

export interface AlertButton {
  text: string;
  action: () => void;
  variant?: 'primary' | 'secondary';
}

@Component({
  selector: 'app-alert-modal',
  standalone: true,
  imports: [CommonModule, IonIcon],
  template: `
    <div
      class="alert-backdrop"
      *ngIf="visible"
      role="dialog"
      aria-modal="true"
      [attr.aria-labelledby]="'alert-title-' + id"
    >
      <div class="alert-modal">
        <div [ngClass]="'alert-icon alert-' + tipo">
          <ion-icon [name]="getIcon()"></ion-icon>
        </div>

        <h2 [id]="'alert-title-' + id" class="alert-title">{{ titulo }}</h2>

        <p class="alert-message">{{ mensaje }}</p>

        <div class="alert-buttons">
          <button
            *ngFor="let btn of botones"
            type="button"
            [ngClass]="[
              'alert-btn',
              'alert-btn-' + (btn.variant || 'primary')
            ]"
            (click)="handleClick(btn)"
          >
            {{ btn.text }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: `
    .alert-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      padding: 16px;
    }

    .alert-modal {
      background: white;
      border-radius: 12px;
      padding: 32px 24px;
      max-width: 400px;
      text-align: center;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    }

    .alert-icon {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
      font-size: 32px;
    }

    .alert-icon.alert-success {
      background-color: #e8f5e9;
      color: #2e7d32;
    }

    .alert-icon.alert-error {
      background-color: #ffebee;
      color: #c62828;
    }

    .alert-icon.alert-warning {
      background-color: #fff3e0;
      color: #e65100;
    }

    .alert-icon.alert-info {
      background-color: #e3f2fd;
      color: #1565c0;
    }

    .alert-title {
      font-size: 20px;
      font-weight: 700;
      margin: 16px 0 8px;
      color: #1a1c1c;
    }

    .alert-message {
      font-size: 14px;
      color: #504441;
      margin: 8px 0 24px;
      line-height: 1.5;
    }

    .alert-buttons {
      display: flex;
      gap: 12px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .alert-btn {
      padding: 12px 24px;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: 'Public Sans', sans-serif;
      min-width: 120px;
    }

    .alert-btn-primary {
      background-color: #442a22;
      color: white;
    }

    .alert-btn-primary:hover {
      background-color: #2d1b15;
    }

    .alert-btn-secondary {
      background-color: #eeeeee;
      color: #1a1c1c;
    }

    .alert-btn-secondary:hover {
      background-color: #e8e8e8;
    }
  `,
})
export class AlertModalComponent {
  @Input() visible = false;
  @Input() tipo: AlertType = 'info';
  @Input() titulo = '';
  @Input() mensaje = '';
  @Input() botones: AlertButton[] = [];
  @Output() onClose = new EventEmitter<void>();

  id = Math.random().toString(36).substr(2, 9);

  getIcon(): string {
    const iconMap = {
      success: 'checkmark-circle',
      error: 'close-circle',
      warning: 'warning',
      info: 'information-circle',
    };
    return iconMap[this.tipo];
  }

  handleClick(btn: AlertButton) {
    btn.action();
    this.visible = false;
    this.onClose.emit();
  }
}
