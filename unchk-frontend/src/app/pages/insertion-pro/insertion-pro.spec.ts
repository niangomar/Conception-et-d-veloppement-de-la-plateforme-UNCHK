import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsertionPro } from './insertion-pro';

describe('InsertionPro', () => {
  let component: InsertionPro;
  let fixture: ComponentFixture<InsertionPro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsertionPro],
    }).compileComponents();

    fixture = TestBed.createComponent(InsertionPro);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
