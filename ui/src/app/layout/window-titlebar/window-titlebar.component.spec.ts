import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WindowTitlebarComponent } from './window-titlebar.component';

describe('WindowTitlebarComponent', () => {
  let component: WindowTitlebarComponent;
  let fixture: ComponentFixture<WindowTitlebarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WindowTitlebarComponent]
    });
    fixture = TestBed.createComponent(WindowTitlebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
