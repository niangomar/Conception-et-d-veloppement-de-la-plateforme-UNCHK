import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardFormateur } from './dashboard-formateur';

describe('DashboardFormateur', () => {
  let component: DashboardFormateur;
  let fixture: ComponentFixture<DashboardFormateur>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardFormateur],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardFormateur);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
