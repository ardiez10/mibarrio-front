import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComerciosList } from './comercios-list';

describe('ComerciosList', () => {
  let component: ComerciosList;
  let fixture: ComponentFixture<ComerciosList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComerciosList],
    }).compileComponents();

    fixture = TestBed.createComponent(ComerciosList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
