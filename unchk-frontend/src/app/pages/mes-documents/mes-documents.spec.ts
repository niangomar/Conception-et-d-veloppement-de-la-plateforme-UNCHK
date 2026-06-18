import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesDocuments } from './mes-documents';

describe('MesDocuments', () => {
  let component: MesDocuments;
  let fixture: ComponentFixture<MesDocuments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MesDocuments],
    }).compileComponents();

    fixture = TestBed.createComponent(MesDocuments);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
