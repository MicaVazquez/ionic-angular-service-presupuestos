import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import {
  IonContent,
  IonIcon,
} from '@ionic/angular/standalone';
import { AuthService } from '../services/auth.service';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonContent, IonIcon],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  cargando = false;
  mostrarPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private alertService: AlertService,
    private router: Router,
  ) {}

  async login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.cargando = true;
    try {
      const { email, password } = this.loginForm.value;
      await this.authService.login(email!, password!);
      this.router.navigate(['/mis-presupuestos']);
    } catch (error: any) {
      this.alertService.error(
        'Error al iniciar sesión',
        'Email o contraseña incorrectos',
      );
    } finally {
      this.cargando = false;
    }
  }

  campoInvalido(nombre: string): boolean {
    const control = this.loginForm.get(nombre);
    return !!control && control.invalid && control.touched;
  }
}
