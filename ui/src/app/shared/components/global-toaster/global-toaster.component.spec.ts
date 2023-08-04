import { ComponentFixture, TestBed } from "@angular/core/testing";

import { GlobalToasterComponent } from "./global-toaster.component";

describe("GlobalToasterComponent", () => {
  let component: GlobalToasterComponent;
  let fixture: ComponentFixture<GlobalToasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GlobalToasterComponent],
    });
    fixture = TestBed.createComponent(GlobalToasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
