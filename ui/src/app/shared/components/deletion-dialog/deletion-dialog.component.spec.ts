import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DeletionDialogComponent } from "./deletion-dialog.component";

describe("DeletionDialogComponent", () => {
  let component: DeletionDialogComponent;
  let fixture: ComponentFixture<DeletionDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeletionDialogComponent],
    });
    fixture = TestBed.createComponent(DeletionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
