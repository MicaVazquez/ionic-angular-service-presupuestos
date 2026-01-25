import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MisPresupuestosPage } from './mis-presupuestos.page';

describe('MisPresupuestosPage', () => {
  let component: MisPresupuestosPage;
  let fixture: ComponentFixture<MisPresupuestosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MisPresupuestosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
