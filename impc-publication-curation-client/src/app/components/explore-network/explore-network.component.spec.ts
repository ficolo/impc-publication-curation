import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreNetworkComponent } from './explore-network.component';

describe('ExploreNetworkComponent', () => {
  let component: ExploreNetworkComponent;
  let fixture: ComponentFixture<ExploreNetworkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExploreNetworkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExploreNetworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
