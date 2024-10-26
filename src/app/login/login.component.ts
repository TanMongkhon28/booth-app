import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // นำเข้า FormsModule
import { NgIf } from '@angular/common'; // นำเข้า NgIf

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [FormsModule, NgIf]  // เพิ่ม imports ที่จำเป็น
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  onLogin(): void {
    const payload = { email: this.email, password: this.password };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.post<any>('https://wag19.bowlab.net/login.php', payload, { headers }).subscribe(
      (response) => {
        if (response.status === 'success') {
          // เก็บข้อมูลผู้ใช้ลงใน localStorage
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('userName', response.user.name);
          localStorage.setItem('userLastName', response.user.lastname);
          localStorage.setItem('userId', response.user.id); 
          localStorage.setItem('prefix', response.user.prefix || '');
          localStorage.setItem('phone', response.user.phone || '');
          localStorage.setItem('email', response.user.email || '');
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = response.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ';
        }
      },
      (error) => {
        this.errorMessage = 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ';
        console.error('Error:', error);
      }
    );
  }
}
