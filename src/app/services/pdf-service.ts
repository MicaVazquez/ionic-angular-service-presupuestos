import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import { Presupuesto } from '../interfaces/presupuesto';

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  constructor() {}

  generarPDF(presupuesto: Presupuesto) {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPos = 20;

    // Colores
    const colorPrimario = '#1a5f7a';
    const colorSecundario = '#f0f0f0';
    const colorTexto = '#333333';

    // ===== HEADER =====
    doc.setFillColor(26, 95, 122); // Color azul oscuro
    doc.rect(0, 0, pageWidth, 35, 'F');

    // Título
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text('PRESUPUESTO', 20, 20);

    // Número/ID (si existe)
    doc.setFontSize(10);
    doc.text(`ID: ${presupuesto.id || 'N/A'}`, 20, 28);

    yPos = 45;

    // ===== INFORMACIÓN CLIENTE =====
    doc.setTextColor(26, 95, 122);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('INFORMACIÓN DEL CLIENTE', 20, yPos);

    yPos += 8;
    doc.setFillColor(240, 240, 240);
    doc.rect(20, yPos - 5, pageWidth - 40, 25, 'F');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(51, 51, 51);
    doc.text(`Cliente: ${presupuesto.cliente}`, 25, yPos);
    doc.text(`Fecha: ${this.formatearFecha(presupuesto.fecha)}`, 25, yPos + 7);
    doc.text(
      `Observaciones: ${presupuesto.observaciones || 'N/A'}`,
      25,
      yPos + 14,
    );

    yPos += 35;

    // ===== TABLA DE ITEMS =====
    doc.setTextColor(26, 95, 122);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('DETALLES DEL PRESUPUESTO', 20, yPos);

    yPos += 8;

    // Headers de la tabla
    doc.setFillColor(26, 95, 122);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');

    doc.rect(20, yPos, pageWidth - 40, 7, 'F');
    doc.text('DESCRIPCIÓN', 25, yPos + 5);
    doc.text('PRECIO', pageWidth - 50, yPos + 5);

    yPos += 10;

    // Items
    doc.setTextColor(51, 51, 51);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);

    presupuesto.items.forEach((item, index) => {
      // Alternar colores de fondo
      if (index % 2 === 0) {
        doc.setFillColor(245, 245, 245);
        doc.rect(20, yPos - 2, pageWidth - 40, 6, 'F');
      }

      const maxDescripcionWidth = pageWidth - 90;
      const descripcionLineas = doc.splitTextToSize(
        item.descripcion,
        maxDescripcionWidth,
      );

      doc.text(descripcionLineas, 25, yPos);
      doc.text(`$${item.precio.toLocaleString('es-AR')}`, pageWidth - 45, yPos);

      yPos += 7;
    });

    yPos += 5;

    // ===== TOTALES =====
    doc.setFillColor(26, 95, 122);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);

    doc.rect(pageWidth - 70, yPos, 50, 8, 'F');
    doc.text('SUBTOTAL:', pageWidth - 65, yPos + 5.5);
    doc.text(
      `$${presupuesto.total.toLocaleString('es-AR')}`,
      pageWidth - 25,
      yPos + 5.5,
      { align: 'right' },
    );

    yPos += 12;

    // Anticipo
    const montoAnticipo =
      presupuesto.anticipoMonto ||
      (presupuesto.total * presupuesto.anticipoPercent) / 100;
    doc.setFillColor(240, 240, 240);
    doc.setTextColor(51, 51, 51);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);

    doc.rect(pageWidth - 70, yPos, 50, 8, 'F');
    doc.text(
      `ANTICIPO (${presupuesto.anticipoPercent}%):`,
      pageWidth - 65,
      yPos + 5.5,
    );
    doc.text(
      `$${montoAnticipo.toLocaleString('es-AR')}`,
      pageWidth - 25,
      yPos + 5.5,
      { align: 'right' },
    );

    yPos += 12;

    // Saldo
    const montoSaldo = presupuesto.total - montoAnticipo;
    doc.setFillColor(26, 95, 122);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);

    doc.rect(pageWidth - 70, yPos, 50, 8, 'F');
    doc.text('SALDO:', pageWidth - 65, yPos + 5.5);
    doc.text(
      `$${montoSaldo.toLocaleString('es-AR')}`,
      pageWidth - 25,
      yPos + 5.5,
      { align: 'right' },
    );

    // ===== PIE DE PÁGINA =====
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(8);
    doc.text('Generado por Presupuestos App', pageWidth / 2, pageHeight - 10, {
      align: 'center',
    });

    // Guardar PDF
    const nombreArchivo = `Presupuesto_${presupuesto.cliente}_${this.formatearFecha(presupuesto.fecha)}.pdf`;
    doc.save(nombreArchivo);
  }

  private formatearFecha(fecha?: string | number | Date): string {
    if (!fecha) return '';
    const d = new Date(fecha);
    return d.toLocaleDateString('es-AR');
  }
}
