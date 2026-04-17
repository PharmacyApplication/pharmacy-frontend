import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageMedicineComponent } from './manage-medicine.component';

describe('ManageMedicineComponent', () => {
  let component: ManageMedicineComponent;
  let fixture: ComponentFixture<ManageMedicineComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageMedicineComponent]
    });
    fixture = TestBed.createComponent(ManageMedicineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
