import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesDevoirs } from './mes-devoirs';

describe('MesDevoirs', () => {
  let component: MesDevoirs;
  let fixture: ComponentFixture<MesDevoirs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MesDevoirs],
    }).compileComponents();

    fixture = TestBed.createComponent(MesDevoirs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
