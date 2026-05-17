import { calcularSubtotal, calcularAnticipo, calcularSaldo } from './calculos';

describe('Cálculos de presupuesto', () => {

  // ─── Subtotal ────────────────────────────────────────────────────────────────

  describe('calcularSubtotal', () => {
    it('suma correctamente varios items', () => {
      const items = [
        { descripcion: 'Placard', precio: 180000 },
        { descripcion: 'Mesada', precio: 45000 },
        { descripcion: 'Puerta', precio: 30000 },
      ];
      expect(calcularSubtotal(items)).toBe(255000);
    });

    it('devuelve 0 si no hay items', () => {
      expect(calcularSubtotal([])).toBe(0);
    });

    it('funciona con un solo item', () => {
      expect(calcularSubtotal([{ descripcion: 'Mesa', precio: 25000 }])).toBe(25000);
    });

    it('ignora precios en 0', () => {
      const items = [
        { descripcion: 'Mesa', precio: 50000 },
        { descripcion: 'Sin precio', precio: 0 },
      ];
      expect(calcularSubtotal(items)).toBe(50000);
    });

    it('maneja precios con centavos', () => {
      const items = [
        { descripcion: 'Mesa', precio: 10000.50 },
        { descripcion: 'Silla', precio: 5000.25 },
      ];
      expect(calcularSubtotal(items)).toBeCloseTo(15000.75);
    });
  });

  // ─── Anticipo ────────────────────────────────────────────────────────────────

  describe('calcularAnticipo', () => {
    it('calcula el 50% correctamente', () => {
      expect(calcularAnticipo(100000, 50)).toBe(50000);
    });

    it('calcula el 30% correctamente', () => {
      expect(calcularAnticipo(25000, 30)).toBe(7500);
    });

    it('calcula el 25% correctamente', () => {
      expect(calcularAnticipo(25000, 25)).toBe(6250);
    });

    it('devuelve 0 si el porcentaje es 0', () => {
      expect(calcularAnticipo(100000, 0)).toBe(0);
    });

    it('devuelve el total completo si el porcentaje es 100', () => {
      expect(calcularAnticipo(100000, 100)).toBe(100000);
    });
  });

  // ─── Saldo ───────────────────────────────────────────────────────────────────

  describe('calcularSaldo', () => {
    it('resta correctamente el anticipo al total', () => {
      expect(calcularSaldo(100000, 30000)).toBe(70000);
    });

    it('devuelve el total completo si no hay anticipo', () => {
      expect(calcularSaldo(100000, 0)).toBe(100000);
    });

    it('devuelve 0 si el anticipo cubre todo', () => {
      expect(calcularSaldo(100000, 100000)).toBe(0);
    });
  });

  // ─── Flujo completo ──────────────────────────────────────────────────────────

  describe('flujo completo', () => {
    it('calcula un presupuesto de dos items con 50% de anticipo', () => {
      const items = [
        { descripcion: 'Placard empotrado', precio: 180000 },
        { descripcion: 'Mesada cocina',     precio: 45000  },
      ];
      const subtotal = calcularSubtotal(items);
      const anticipo = calcularAnticipo(subtotal, 50);
      const saldo    = calcularSaldo(subtotal, anticipo);

      expect(subtotal).toBe(225000);
      expect(anticipo).toBe(112500);
      expect(saldo).toBe(112500);
    });

    it('calcula un presupuesto de un item con 30% de anticipo', () => {
      const items = [{ descripcion: 'Cocina completa', precio: 300000 }];
      const subtotal = calcularSubtotal(items);
      const anticipo = calcularAnticipo(subtotal, 30);
      const saldo    = calcularSaldo(subtotal, anticipo);

      expect(subtotal).toBe(300000);
      expect(anticipo).toBe(90000);
      expect(saldo).toBe(210000);
    });

    it('saldo + anticipo siempre suma el total', () => {
      const items = [
        { descripcion: 'Ropero', precio: 150000 },
        { descripcion: 'Cama',   precio: 80000  },
      ];
      const subtotal = calcularSubtotal(items);
      const anticipo = calcularAnticipo(subtotal, 40);
      const saldo    = calcularSaldo(subtotal, anticipo);

      expect(anticipo + saldo).toBe(subtotal);
    });
  });

});
