import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule]
})
export class SettingsComponent implements OnInit {
  settingsForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.settingsForm = this.fb.group({
      prefix: ['', Validators.required],
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      new_password: [''],
      confirm_password: ['']
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadUserData();
    }
  }

  // ดึงข้อมูลผู้ใช้จาก localStorage
  loadUserData(): void {
    if (isPlatformBrowser(this.platformId)) {
      const userId = localStorage.getItem('userId'); 

      if (!userId) {
        this.errorMessage = 'ไม่พบข้อมูลผู้ใช้';
        return;
      }

      const mockUserData = {
        prefix: localStorage.getItem('prefix') || '',
        name: localStorage.getItem('userName') || '',
        lastname: localStorage.getItem('userLastName') || '',
        phone: localStorage.getItem('phone') || '',
        email: localStorage.getItem('email') || ''
      };

      this.settingsForm.patchValue(mockUserData);
    }
  }

  // ตรวจสอบว่ารหัสผ่านและการยืนยันรหัสผ่านตรงกัน
  passwordMatchValidator(form: FormGroup): any {
    const newPassword = form.get('new_password')?.value;
    const confirmPassword = form.get('confirm_password')?.value;

    if (newPassword !== confirmPassword) {
      form.get('confirm_password')?.setErrors({ mismatch: true });
    } else {
      form.get('confirm_password')?.setErrors(null);  // Clear errors when matched
      return null;
    }
  }

  // ฟังก์ชันบันทึกข้อมูลผู้ใช้
  saveSettings(): void {
    if (this.settingsForm.valid) {
      const userId = localStorage.getItem('userId');
      const payload = { ...this.settingsForm.value, user_id: userId };

      const apiUrl = 'https://wag19.bowlab.net/edit_data_user.php';
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

      this.http.post<any>(apiUrl, payload, { headers }).subscribe(
        (response) => {
          if (response.status === 'success') {
            alert('บันทึกข้อมูลสำเร็จ');
            this.router.navigate(['/dashboard']);
          } else {
            this.errorMessage = response.message || 'ไม่สามารถบันทึกข้อมูลได้';
          }
        },
        (error) => {
          this.errorMessage = 'เกิดข้อผิดพลาดในการบันทึกข้อมูล';
          console.error('Error:', error);
        }
      );
    } else {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
    }
  }
}
