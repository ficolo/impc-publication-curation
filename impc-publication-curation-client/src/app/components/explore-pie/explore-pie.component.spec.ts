import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExplorePieComponent } from './explore-pie.component';

describe('ExplorePieComponent', () => {
  let component: ExplorePieComponent;
  let fixture: ComponentFixture<ExplorePieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExplorePieComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExplorePieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
