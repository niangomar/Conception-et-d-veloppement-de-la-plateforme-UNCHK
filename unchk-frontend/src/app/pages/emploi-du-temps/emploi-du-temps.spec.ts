import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmploiDuTemps } from './emploi-du-temps';

describe('EmploiDuTemps', () => {
  let component: EmploiDuTemps;
  let fixture: ComponentFixture<EmploiDuTemps>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmploiDuTemps],
    }).compileComponents();

    fixture = TestBed.createComponent(EmploiDuTemps);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
