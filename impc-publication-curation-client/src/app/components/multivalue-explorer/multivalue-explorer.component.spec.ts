import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultivalueExplorerComponent } from './multivalue-explorer.component';

describe('MultivalueExplorerComponent', () => {
  let component: MultivalueExplorerComponent;
  let fixture: ComponentFixture<MultivalueExplorerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultivalueExplorerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultivalueExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
