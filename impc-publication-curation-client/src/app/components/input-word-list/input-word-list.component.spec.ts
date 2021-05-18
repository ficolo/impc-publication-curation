import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputWordListComponent } from './input-word-list.component';

describe('InputWordListComponent', () => {
  let component: InputWordListComponent;
  let fixture: ComponentFixture<InputWordListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputWordListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputWordListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
