import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { Presupuesto } from '../interfaces/presupuesto';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private supabase: SupabaseClient;
  private readonly tabla = 'presupuesto';

  constructor() {
    this.supabase = createClient(
      environment.supabase.url,
      environment.supabase.key,
    );
  }

  async guardar(presupuesto: Presupuesto): Promise<Presupuesto> {
    const { data, error } = await this.supabase
      .from(this.tabla)
      .insert([presupuesto])
      .select()
      .single();
    if (error) {
      console.error('Error al guardar el presupuesto:', error);
      throw error;
    }
    return data as Presupuesto;
  }

  async obtenerTodos(): Promise<Presupuesto[]> {
    const { data, error } = await this.supabase
      .from(this.tabla)
      .select('*')
      .order('fecha', { ascending: false });
    if (error) {
      console.error('Error al obtener los presupuestos:', error);
      throw error;
    }
    return (data ?? []) as Presupuesto[];
  }

  async obtenerPorId(id: string): Promise<Presupuesto | null> {
    const { data, error } = await this.supabase
      .from(this.tabla)
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) {
      console.error('Error al obtener el presupuesto:', error);
      throw error;
    }
    return (data as Presupuesto) ?? null;
  }

  async actualizar(
    id: string,
    cambios: Partial<Presupuesto>,
  ): Promise<Presupuesto> {
    const { data, error } = await this.supabase
      .from(this.tabla)
      .update(cambios)
      .eq('id', id)
      .select()
      .single();
    if (error) {
      console.error('Error al actualizar el presupuesto:', error);
      throw error;
    }
    return data as Presupuesto;
  }

  async eliminar(id: string): Promise<void> {
    const { error } = await this.supabase
      .from(this.tabla)
      .delete()
      .eq('id', id);
    if (error) {
      console.error('Error al eliminar el presupuesto:', error);
      throw error;
    }
  }
}
