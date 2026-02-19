import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private supabase: SupabaseClient;
  private $getTodos = Observable;
  constructor() {
    this.supabase = createClient(
      environment.supabase.url,
      environment.supabase.key,
    );
  }

  async guardar(presupuesto: any) {
    const { data, error } = await this.supabase
      .from('presupuesto')
      .insert([presupuesto]);
    if (error) {
      console.error('Error al guardar el presupuesto:', error);
      throw error;
    } else {
      console.log('Presupuesto guardado con éxito:', data);
      return data;
    }
  }

  async obtenerTodos() {
    const { data, error } = await this.supabase
      .from('presupuesto')
      .select('*')
      .order('fecha', { ascending: false });
    if (error) {
      console.error('Error al obtener los presupuestos:', error);
      throw error;
    } else {
      console.log('Presupuestos obtenidos con éxito:', data);
      return data;
    }
  }
}
