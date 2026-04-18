import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  loading = false;
  user: any = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.profileForm = this.fb.group({
      fullName: ['', Validators.required],
      phoneNumber: [''],
      address: ['']
    });
  }

  ngOnInit(): void {
    this.authService.getProfile().subscribe({
      next: (res) => {
        this.user = res;
        this.profileForm.patchValue({
          fullName: res.fullName,
          phoneNumber: res.phoneNumber,
          address: res.address
        });
      },
      error: () => {
        this.snackBar.open('Failed to load profile', 'Close', { duration: 3000 });
      }
    });
  }

  onUpdate() {
    if (this.profileForm.invalid) return;
    this.loading = true;

    this.authService.updateProfile(this.profileForm.value).subscribe({
      next: () => {
        this.snackBar.open('Profile updated successfully!', 'Close', {
          duration: 3000,
          panelClass: ['success-snack']
        });
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Update failed. Try again.', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }
}