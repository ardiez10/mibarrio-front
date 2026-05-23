import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfertasList } from './ofertas-list';

describe('OfertasList', () => {
  let component: OfertasList;
  let fixture: ComponentFixture<OfertasList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfertasList],
    }).compileComponents();

    fixture = TestBed.createComponent(OfertasList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
