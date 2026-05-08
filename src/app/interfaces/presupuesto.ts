export interface Presupuesto {
  id?: string;
  cliente: string;
  fecha: string;
  anticipoPercent: number;
  items: ItemPresupuesto[];
  total: number;
  estado: 'borrador' | 'finalizado';
  observaciones?: string;
}

export interface ItemPresupuesto {
  descripcion: string;
  precio: number;
}
