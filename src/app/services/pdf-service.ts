import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { Presupuesto } from '../interfaces/presupuesto';
import { calcularSubtotal, calcularAnticipo, calcularSaldo } from '../utils/calculos';

type Rgb = [number, number, number];

@Injectable({ providedIn: 'root' })
export class PdfService {
  // Paleta
  private readonly MARRON: Rgb = [91, 55, 44];
  private readonly MARRON_OSCURO: Rgb = [42, 25, 21];
  private readonly BLANCO: Rgb = [255, 255, 255];
  private readonly GRIS_FONDO: Rgb = [245, 244, 243];
  private readonly GRIS_LINEA: Rgb = [225, 220, 217];
  private readonly TEXTO_SUAVE: Rgb = [130, 120, 116];
  private readonly TEXTO_CUERPO: Rgb = [50, 40, 36];

  // Márgenes
  private readonly ML = 20; // left
  private readonly MR = 190; // right edge
  private readonly CW = 170; // content width

  async generarPDF(p: Presupuesto) {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
    const PH = doc.internal.pageSize.getHeight(); // 297
    const PW = doc.internal.pageSize.getWidth(); // 210

    const logo     = await this.cargarLogo();
    const subtotal = calcularSubtotal(p.items || []);
    const anticipo = calcularAnticipo(subtotal, p.anticipoPercent || 0);
    const saldo    = calcularSaldo(subtotal, anticipo);

    /* ── 1. Fondo ── */
    this.dibujarFondo(doc, PW, PH);

    /* ── 2. Encabezado empresa ── */
    this.dibujarEmpresa(doc, logo);

    /* ── 3. Cajas cliente + fecha ── */
    this.dibujarCajas(doc, p, PW);

    /* ── 4. Items ── */
    let y = 108;
    this.dibujarTituloItems(doc, y, PW);
    y += 8;
    this.dibujarBarraItems(doc, y, PW);
    y += 12;

    p.items.forEach((item, i) => {
      const alto = this.altoItem(doc, item.descripcion);
      if (y + alto > PH - 72) {
        doc.addPage();
        this.dibujarFondo(doc, PW, PH);
        y = 25;
        this.dibujarBarraItems(doc, y, PW);
        y += 12;
      }
      this.dibujarItem(doc, item.descripcion, item.precio, y, PW);
      y += alto;

      if (i < p.items.length - 1) {
        doc.setDrawColor(...this.GRIS_LINEA);
        doc.setLineWidth(0.2);
        doc.line(this.ML, y - 5, this.MR, y - 5);
      }
    });

    /* ── 5. Cierre ── */
    const hoy = new Date();
    this.dibujarCierre(doc, p, subtotal, anticipo, saldo, PW, PH, hoy);

    /* ── 6. Guardar ── */
    const nombre = `Presupuesto_${this.slug(p.cliente)}_${this.fechaArchivo(hoy)}.pdf`;

    if (Capacitor.isNativePlatform()) {
      // En Android: guardar en caché y abrir con el share sheet
      const base64 = doc.output('datauristring').split(',')[1];
      await Filesystem.writeFile({
        path: nombre,
        data: base64,
        directory: Directory.Cache,
      });
      const { uri } = await Filesystem.getUri({
        path: nombre,
        directory: Directory.Cache,
      });
      await Share.share({
        title: `Presupuesto ${p.cliente}`,
        url: uri,
        dialogTitle: 'Compartir presupuesto',
      });
    } else {
      // En web: descarga normal
      doc.save(nombre);
    }
  }

  /* ─────────────────────────────────────────────────
     FONDO BLANCO LISO
  ───────────────────────────────────────────────── */
  private dibujarFondo(doc: jsPDF, PW: number, PH: number) {
    doc.setFillColor(251, 249, 247); // crema muy suave, casi blanco
    doc.rect(0, 0, PW, PH, 'F');
  }

  /* ─────────────────────────────────────────────────
     ENCABEZADO EMPRESA
  ───────────────────────────────────────────────── */
  private dibujarEmpresa(doc: jsPDF, logo: string | null) {
    const y0 = 15;

    if (logo) {
      doc.addImage(logo, 'PNG', this.ML, y0, 16, 16);
      const tx = this.ML + 20;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(...this.MARRON_OSCURO);
      doc.text('CARPINTERIA PV', tx, y0 + 10);
    } else {
      // Marca CPV
      doc.setFillColor(...this.MARRON);
      doc.rect(this.ML, y0, 16, 16, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(...this.BLANCO);
      doc.text('CPV', this.ML + 8, y0 + 10, { align: 'center' });

      const tx = this.ML + 20;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(...this.MARRON_OSCURO);
      doc.text('CARPINTERIA PV', tx, y0 + 10);
    }
  }

  /* ─────────────────────────────────────────────────
     CAJAS CLIENTE (GRIS) + FECHA (MARRÓN)
  ───────────────────────────────────────────────── */
  private dibujarCajas(doc: jsPDF, p: Presupuesto, PW: number) {
    const y0 = 38;
    const h = 52;
    const gapX = 5;
    const wL = 108; // ancho caja izquierda
    const xR = this.ML + wL + gapX;
    const wR = this.MR - xR; // ancho caja derecha

    /* — Caja cliente (gris) — */
    doc.setFillColor(...this.GRIS_FONDO);
    doc.rect(this.ML, y0, wL, h, 'F');

    // Barra de acento marrón izquierda
    doc.setFillColor(...this.MARRON);
    doc.rect(this.ML, y0, 2.5, h, 'F');

    // Label
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.2);
    doc.setCharSpace(1.3);
    doc.setTextColor(...this.MARRON);
    doc.text('INFORMACIÓN DEL CLIENTE', this.ML + 7, y0 + 11);
    doc.setCharSpace(0);

    // Línea divisoria bajo label
    doc.setDrawColor(...this.GRIS_LINEA);
    doc.setLineWidth(0.2);
    doc.line(this.ML + 7, y0 + 14, this.ML + wL - 5, y0 + 14);

    // Nombre del cliente
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(...this.MARRON_OSCURO);
    const nombreLineas = doc.splitTextToSize(p.cliente || 'Cliente', wL - 14);
    doc.text(nombreLineas.slice(0, 2), this.ML + 7, y0 + 29);

    // Subtítulo
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...this.TEXTO_SUAVE);
    doc.text('Cliente Particular', this.ML + 7, y0 + 42);

    /* — Caja fecha (marrón oscuro) — */
    doc.setFillColor(...this.MARRON_OSCURO);
    doc.rect(xR, y0, wR, h, 'F');

    // Label fecha
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.2);
    doc.setCharSpace(1.2);
    doc.setTextColor(180, 160, 150);
    doc.text('FECHA DE EMISIÓN', xR + 6, y0 + 11);
    doc.setCharSpace(0);

    // Fecha grande (fecha de emisión = día que se genera el PDF)
    const [dd, mm, yyyy] = this.fechaPartes(new Date());
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(...this.BLANCO);
    doc.text(`${dd} / ${mm} /`, xR + 6, y0 + 29);
    doc.text(yyyy, xR + 6, y0 + 42);
  }

  /* ─────────────────────────────────────────────────
     TÍTULO SECCIÓN ITEMS
  ───────────────────────────────────────────────── */
  private dibujarTituloItems(doc: jsPDF, y: number, PW: number) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11.5);
    doc.setTextColor(...this.MARRON_OSCURO);
    doc.text('Detalles del Presupuesto', this.ML, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.8);
    doc.setCharSpace(0);
    doc.setTextColor(...this.TEXTO_SUAVE);
    doc.text('UNIDADES EN PESOS ARGENTINOS (ARS)', this.MR, y, {
      align: 'right',
    });

    doc.setDrawColor(...this.GRIS_LINEA);
    doc.setLineWidth(0.2);
    doc.line(this.ML, y + 3, this.MR, y + 3);
  }

  /* ─────────────────────────────────────────────────
     BARRA OSCURA ENCABEZADO ITEMS
  ───────────────────────────────────────────────── */
  private dibujarBarraItems(doc: jsPDF, y: number, PW: number) {
    doc.setFillColor(...this.MARRON_OSCURO);
    doc.rect(this.ML, y, this.CW, 9, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(...this.BLANCO);
    doc.setCharSpace(1.2);
    doc.text('DESCRIPCIÓN DEL TRABAJO', this.ML + 5, y + 6);
    doc.setCharSpace(0);
    doc.text('MONTO TOTAL', this.MR, y + 6, { align: 'right' });
  }

  /* ─────────────────────────────────────────────────
     ITEM
  ───────────────────────────────────────────────── */
  private dibujarItem(
    doc: jsPDF,
    descripcion: string,
    precio: number,
    y: number,
    PW: number,
  ) {
    const lineas = doc.splitTextToSize(descripcion || '', 118);

    // Título (primera línea, negrita)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(...this.MARRON_OSCURO);
    doc.text(lineas[0] ?? '', this.ML + 3, y + 7);

    // Descripción (resto de líneas)
    if (lineas.length > 1) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...this.TEXTO_CUERPO);
      doc.text(lineas.slice(1, 5), this.ML + 3, y + 14, {
        lineHeightFactor: 1.5,
      });
    }

    // Precio
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(...this.MARRON_OSCURO);
    doc.text(this.formatMoneda(precio), this.MR, y + 7, { align: 'right' });
  }

  /* ─────────────────────────────────────────────────
     CIERRE (SUBTOTAL / ANTICIPO / SALDO)
  ───────────────────────────────────────────────── */
  private dibujarCierre(
    doc: jsPDF,
    p: Presupuesto,
    subtotal: number,
    anticipo: number,
    saldo: number,
    PW: number,
    PH: number,
    hoy: Date,
  ) {
    // Alturas de cada fila (fijas, desde el fondo hacia arriba)
    const hPie = 12; // pie de página
    const hSaldo = 20; // barra SALDO PENDIENTE
    const hAnticipo = 22; // fila anticipo + nota
    const hSubtotal = 14; // fila subtotal

    const yPie = PH - hPie;
    const yBar = yPie - hSaldo;
    const yAnti = yBar - hAnticipo;
    const ySub = yAnti - hSubtotal;

    // ── Separador superior ──
    doc.setDrawColor(...this.GRIS_LINEA);
    doc.setLineWidth(0.3);
    doc.line(this.ML, ySub, this.MR, ySub);

    // ── TOTAL (fondo gris, texto más fuerte) ──
    doc.setFillColor(235, 230, 227);  // gris más oscuro para destacar
    doc.rect(this.ML, ySub, this.CW, hSubtotal, 'F');

    // Línea de acento marrón arriba de la fila
    doc.setDrawColor(...this.MARRON);
    doc.setLineWidth(0.8);
    doc.line(this.ML, ySub, this.MR, ySub);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setCharSpace(0.8);
    doc.setTextColor(...this.MARRON_OSCURO);
    doc.text('TOTAL:', this.ML + 5, ySub + 9);
    doc.setCharSpace(0);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(...this.MARRON_OSCURO);
    doc.text(this.formatMoneda(subtotal), this.MR - 3, ySub + 9.5, {
      align: 'right',
    });

    // ── ANTICIPO (fondo blanco) ──
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setCharSpace(0.8);
    doc.setTextColor(...this.TEXTO_SUAVE);
    doc.text(`ANTICIPO (${p.anticipoPercent || 0}%):`, this.ML + 5, yAnti + 8);
    doc.setCharSpace(0);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...this.MARRON);
    doc.text(this.formatMoneda(anticipo), this.MR - 3, yAnti + 8, {
      align: 'right',
    });

    // Nota anticipo (observaciones o texto por defecto)
    const nota = p.observaciones?.trim() || 'Requerido para inicio de obra';
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(160, 100, 80);
    doc.text(nota, this.ML + 5, yAnti + 16);

    // ── SALDO PENDIENTE (barra marrón oscuro) ──
    doc.setFillColor(...this.MARRON_OSCURO);
    doc.rect(this.ML, yBar, this.CW, hSaldo, 'F');

    // Label izquierda
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setCharSpace(0.6);
    doc.setTextColor(...this.BLANCO);
    doc.text('SALDO PENDIENTE:', this.ML + 5, yBar + 10);
    doc.setCharSpace(0);

    // Monto derecha (charSpace=0 para que el right-align sea exacto)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(...this.BLANCO);
    doc.text(this.formatMoneda(saldo), this.MR - 3, yBar + 12, {
      align: 'right',
    });

    // Sub-nota dentro de la barra: precio vigente a la fecha
    const [dd, mm, yyyy] = this.fechaPartes(hoy);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(180, 160, 150);
    doc.text(
      `Precios válidos al ${dd}/${mm}/${yyyy}. Sujetos a variación.`,
      this.MR - 3,
      yBar + 18,
      { align: 'right' },
    );

    // ── Pie de página ──
    doc.setDrawColor(...this.GRIS_LINEA);
    doc.line(this.ML, yPie + 2, this.MR, yPie + 2);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.5);
    doc.setCharSpace(1.4);
    doc.setTextColor(190, 184, 180);
    doc.text('CARPINTERIA PV', this.ML, yPie + 8);
    doc.setCharSpace(0);
  }

  /* ─────────────────────────────────────────────────
     HELPERS
  ───────────────────────────────────────────────── */
  private altoItem(doc: jsPDF, descripcion: string): number {
    const lineas = doc.splitTextToSize(descripcion || '', 118);
    return Math.max(22, 10 + Math.min(lineas.length, 5) * 6);
  }

  private obtenerTotal(p: Presupuesto): number {
    if (typeof p.total === 'number' && p.total > 0) return p.total;
    return (p.items || []).reduce((s, it) => s + (it.precio || 0), 0);
  }

  private async cargarLogo(): Promise<string | null> {
    try {
      const res = await fetch('assets/logo.png');
      const blob = await res.blob();
      return await new Promise<string | null>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(blob);
      });
    } catch {
      return null;
    }
  }

  private formatMoneda(v: number): string {
    return `$${Math.round(v || 0).toLocaleString('es-AR')}`;
  }

  private fechaPartes(
    fecha?: string | number | Date,
  ): [string, string, string] {
    if (!fecha) return ['--', '--', '----'];
    let d: Date;
    if (fecha instanceof Date) {
      d = fecha;
    } else if (typeof fecha === 'number') {
      d = new Date(fecha);
    } else {
      d = /[TZ+]/.test(fecha) ? new Date(fecha) : new Date(fecha + 'T12:00:00');
    }
    if (isNaN(d.getTime())) return ['--', '--', '----'];
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = String(d.getFullYear());
    return [dd, mm, yyyy];
  }

  private fechaArchivo(fecha?: string | number | Date): string {
    if (!fecha) return '';
    let d: Date;
    if (fecha instanceof Date) {
      d = fecha;
    } else if (typeof fecha === 'number') {
      d = new Date(fecha);
    } else {
      // Si ya tiene hora (contiene T o Z o +) usamos directo, sino añadimos mediodía
      d = /[TZ+]/.test(fecha) ? new Date(fecha) : new Date(fecha + 'T12:00:00');
    }
    if (isNaN(d.getTime())) return '';
    return d.toISOString().slice(0, 10);
  }

  private slug(nombre: string): string {
    return (nombre || 'Cliente')
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-zA-Z0-9_-]+/g, '_')
      .replace(/^_+|_+$/g, '');
  }
}
