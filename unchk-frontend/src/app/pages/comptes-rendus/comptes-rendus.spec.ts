import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComptesRendus } from './comptes-rendus';

describe('ComptesRendus', () => {
  let component: ComptesRendus;
  let fixture: ComponentFixture<ComptesRendus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComptesRendus],
    }).compileComponents();

    fixture = TestBed.createComponent(ComptesRendus);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
