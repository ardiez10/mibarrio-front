import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfertaDetail } from './oferta-detail';

describe('OfertaDetail', () => {
  let component: OfertaDetail;
  let fixture: ComponentFixture<OfertaDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfertaDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(OfertaDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
