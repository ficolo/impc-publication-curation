import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlleleTableComponent } from './allele-table.component';

describe('AlleleTableComponent', () => {
  let component: AlleleTableComponent;
  let fixture: ComponentFixture<AlleleTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlleleTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlleleTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
