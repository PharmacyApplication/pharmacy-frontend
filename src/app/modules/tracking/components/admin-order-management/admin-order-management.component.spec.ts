import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOrderManagementComponent } from './admin-order-management.component';

describe('AdminOrderManagementComponent', () => {
  let component: AdminOrderManagementComponent;
  let fixture: ComponentFixture<AdminOrderManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminOrderManagementComponent]
    });
    fixture = TestBed.createComponent(AdminOrderManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
