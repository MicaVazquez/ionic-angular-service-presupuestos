import { ItemPresupuesto } from '../interfaces/presupuesto';

/** Suma los precios de todos los items. */
export function calcularSubtotal(items: ItemPresupuesto[]): number {
  return (items || []).reduce((acc, item) => acc + (item.precio || 0), 0);
}

/** Calcula el monto de anticipo según el porcentaje. */
export function calcularAnticipo(subtotal: number, percent: number): number {
  return subtotal * ((percent || 0) / 100);
}

/** Calcula el saldo restante después del anticipo. */
export function calcularSaldo(subtotal: number, anticipo: number): number {
  return subtotal - anticipo;
}
