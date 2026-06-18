import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamensEtudiant } from './examens-etudiant';

describe('ExamensEtudiant', () => {
  let component: ExamensEtudiant;
  let fixture: ComponentFixture<ExamensEtudiant>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamensEtudiant],
    }).compileComponents();

    fixture = TestBed.createComponent(ExamensEtudiant);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
