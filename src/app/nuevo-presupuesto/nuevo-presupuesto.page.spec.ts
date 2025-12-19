import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NuevoPresupuestoPage } from './nuevo-presupuesto.page';

describe('NuevoPresupuestoPage', () => {
  let component: NuevoPresupuestoPage;
  let fixture: ComponentFixture<NuevoPresupuestoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NuevoPresupuestoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
