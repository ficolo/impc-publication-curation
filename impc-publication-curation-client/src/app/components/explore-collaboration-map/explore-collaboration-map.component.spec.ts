import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreCollaborationMapComponent } from './explore-collaboration-map.component';

describe('ExploreCollaborationMapComponent', () => {
  let component: ExploreCollaborationMapComponent;
  let fixture: ComponentFixture<ExploreCollaborationMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExploreCollaborationMapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExploreCollaborationMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
