export interface Presupuesto {
  id?: string;
  cliente: string;
  fecha: string;
  anticipoMonto: number;
  anticipoPercent: number;
  items: ItemPresupuesto[];
  total: number;
  observaciones: string;
}

export interface ItemPresupuesto {
  descripcion: string;
  precio: number;
}
