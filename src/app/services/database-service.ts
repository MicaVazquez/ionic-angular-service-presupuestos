import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';
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
    const { id: _, ...cambiosSinId } = cambios;

    console.log('=== DEBUG UPDATE ===');
    console.log('ID:', id);
    console.log('Cambios sin ID:', JSON.stringify(cambiosSinId, null, 2));

    // Primero verificar que el registro existe
    const { data: existe, error: errorBuscar } = await this.supabase
      .from(this.tabla)
      .select('id')
      .eq('id', id)
      .maybeSingle();

    console.log('¿Existe el registro?:', existe);
    console.log('Error al buscar:', errorBuscar);

    const { data, error } = await this.supabase
      .from(this.tabla)
      .update(cambiosSinId)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error completo:', JSON.stringify(error, null, 2));
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

  suscribirCambios(callback: () => void): RealtimeChannel {
    return this.supabase
      .channel('presupuestos-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: this.tabla },
        () => callback(),
      )
      .subscribe();
  }

  desuscribir(canal: RealtimeChannel): void {
    this.supabase.removeChannel(canal);
  }
}
