import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-booth-details',
  templateUrl: './booth-details.component.html',
  styleUrls: ['./booth-details.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class BoothDetailsComponent implements OnInit {
  booth: any = null;
  errorMessage: string = '';
  paymentImage: File | null = null;
  bookingId: string | null = null;

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    const boothId = this.route.snapshot.queryParamMap.get('id');
    this.bookingId = this.route.snapshot.queryParamMap.get('booking_id'); 
    this.getBoothDetails(boothId);
  }

  getBoothDetails(boothId: string | null): void {
    if (!boothId) return;

    const payload = { booth_id: boothId };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.post<any>('https://wag19.bowlab.net/s_booth_by_id.php', payload, { headers }).subscribe(
      (response) => {
        if (response.status === 'success') {
          this.booth = response.booth;
        } else {
          this.errorMessage = response.message || 'เกิดข้อผิดพลาดในการดึงข้อมูลบูธ';
        }
      },
      (error) => {
        this.errorMessage = 'เกิดข้อผิดพลาดในการดึงข้อมูลบูธ';
        console.error('Error:', error);
      }
    );
  }

  onFileSelected(event: any): void {
    this.paymentImage = event.target.files[0];
  }

  uploadPaymentImage(): void {
    if (!this.paymentImage) {
      this.errorMessage = 'โปรดเลือกไฟล์ภาพก่อนอัปโหลด';
      return;
    }

    const formData = new FormData();
    formData.append('payment_slip', this.paymentImage);
    formData.append('booking_id', this.bookingId!);

    this.http.post<any>('https://wag19.bowlab.net/update_payment.php', formData).subscribe(
      (response) => {
        if (response.status === 'success') {
          alert('อัปโหลดภาพการชำระเงินสำเร็จ');
        } else {
          this.errorMessage = response.message || 'เกิดข้อผิดพลาดในการอัปโหลดภาพ';
        }
      },
      (error) => {
        this.errorMessage = 'เกิดข้อผิดพลาดในการอัปโหลดภาพ';
        console.error('Error:', error);
      }
    );
  }

  CancelPaymentImage(): void {
    if (!this.bookingId) {
      this.errorMessage = 'ไม่พบข้อมูล booking_id';
      return;
    }

    const payload = {
      status: 'cancelled',
      booking_id: this.bookingId
    };

    this.http.post<any>('https://wag19.bowlab.net/update_booking.php', payload).subscribe(
      (response) => {
        if (response.status === 'success') {
          alert('ยกเลิกการจองสำเร็จ');
          this.router.navigate(['/my-booths']);
        } else {
          this.errorMessage = response.message || 'เกิดข้อผิดพลาดในการยกเลิก';
        }
      },
      (error) => {
        this.errorMessage = 'เกิดข้อผิดพลาดในการยกเลิก';
        console.error('Error:', error);
      }
    );
  }
}
