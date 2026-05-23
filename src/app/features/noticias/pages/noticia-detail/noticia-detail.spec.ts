import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticiaDetail } from './noticia-detail';

describe('NoticiaDetail', () => {
  let component: NoticiaDetail;
  let fixture: ComponentFixture<NoticiaDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoticiaDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(NoticiaDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
