import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AdminHarvestingComponent } from "./admin-harvesting.component";

describe("AdminHarvestingComponent", () => {
  let component: AdminHarvestingComponent;
  let fixture: ComponentFixture<AdminHarvestingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminHarvestingComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminHarvestingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
