import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComercioCard } from './comercio-card';

describe('ComercioCard', () => {
  let component: ComercioCard;
  let fixture: ComponentFixture<ComercioCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComercioCard],
    }).compileComponents();

    fixture = TestBed.createComponent(ComercioCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
