import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser, NgIf, NgFor } from '@angular/common';
import { Router } from '@angular/router'; // เพิ่มการนำเข้า Router

@Component({
  selector: 'app-my-booths',
  templateUrl: './my-booths.component.html',
  styleUrls: ['./my-booths.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor]
})
export class MyBoothsComponent implements OnInit {
  userId: string | null = null;
  bookings: any[] = [];
  errorMessage: string = '';

  constructor(
    private http: HttpClient,
    private router: Router, // เพิ่ม Router
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.userId = localStorage.getItem('userId');

      if (this.userId) {
        this.getUserBookings(this.userId);
      } else {
        this.errorMessage = 'ไม่พบข้อมูลผู้ใช้';
      }
    } else {
      this.errorMessage = 'การใช้งานนี้รองรับเฉพาะใน browser เท่านั้น';
    }
  }

getUserBookings(userId: string): void {
  const payload = { user_id: userId };
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  this.http.post<any>('https://wag19.bowlab.net/get_booking_by_user_id.php', payload, { headers }).subscribe(
    (response) => {
      console.log('Response:', response);
      if (response.status === 'success') {
        // เก็บ bookings พร้อมกับ booking_id
        this.bookings = response.booths.map((booth: any) => ({
          ...booth,
          booking_id: booth.booking_id, // ตรวจสอบว่า booking_id มีใน response
        })) || [];
      } else {
        this.errorMessage = response.message || 'เกิดข้อผิดพลาดในการดึงข้อมูลการจอง';
      }
    },
    (error) => {
      this.errorMessage = 'เกิดข้อผิดพลาดในการดึงข้อมูลการจอง';
      console.error('Error:', error);
    }
  );
}


  // ฟังก์ชันสำหรับนำทางไปยังหน้ารายละเอียดบูธ
  viewBoothDetails(boothId: number, bookingId : number): void {
    this.router.navigate(['/booth-details'], { queryParams: { id: boothId, booking_id: bookingId } });

  }
}
