import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreHeatmapComponent } from './explore-heatmap.component';

describe('ExploreHeatmapComponent', () => {
  let component: ExploreHeatmapComponent;
  let fixture: ComponentFixture<ExploreHeatmapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExploreHeatmapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExploreHeatmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
