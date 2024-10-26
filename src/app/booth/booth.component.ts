import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgIf, NgFor, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // เพิ่ม FormsModule

declare var bootstrap: any;

@Component({
  selector: 'app-booth',
  templateUrl: './booth.component.html',
  styleUrls: ['./booth.component.scss'],
  standalone: true,
  imports: [CommonModule, NgIf, NgFor, FormsModule] // เพิ่ม FormsModule ใน imports
})
export class BoothComponent implements OnInit {
  booths: any[] = [];
  zoneId: string = '';
  errorMessage: string = '';
  selectedBooth: any = null;
  details: string = ''; // เพิ่มตัวแปร details

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // ดึงค่า zone_id จาก Query Parameters
    this.route.queryParams.subscribe(params => {
      this.zoneId = params['zone'];
      if (this.zoneId) {
        this.getBoothsByZone(this.zoneId);
      } else {
        this.errorMessage = 'ไม่พบข้อมูล Zone';
      }
    });
  }

  // ฟังก์ชันสำหรับดึงข้อมูลบูธตาม zone_id
  getBoothsByZone(zoneId: string): void {
    const apiUrl = 'https://wag19.bowlab.net/s_booth_by_zone_id.php'; 
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.post<any>(apiUrl, { zone_id: zoneId }, { headers }).subscribe(
      (data) => {
        console.log('Received data:', data); 
        if (data.status === 'success' && Array.isArray(data.booths)) {
          this.booths = data.booths;
        } else {
          this.errorMessage = data.message || 'เกิดข้อผิดพลาดในการดึงข้อมูลบูธ';
        }
      },
      (error) => {
        this.errorMessage = 'เกิดข้อผิดพลาดในการดึงข้อมูลบูธ';
        console.error('Error:', error);
      }
    );
  }

  // ฟังก์ชันสำหรับเลือกบูธ
  async selectBooth(booth: any): Promise<void> {
    if (booth.status !== 'available') {
      this.errorMessage = 'บูธนี้ไม่พร้อมใช้งานสำหรับการจอง';
      return;
    }
    this.selectedBooth = booth;

    // Import Bootstrap แบบ Dynamic
    const { Modal } = await import('bootstrap');
    const modal = new Modal(document.getElementById('confirmBookingModal')!);
    modal.show();
  }

  // ฟังก์ชันยืนยันการจอง
  confirmBooking(): void {
    const userId = localStorage.getItem('userId');
    if (!this.selectedBooth || !userId) {
      this.errorMessage = 'กรุณา Login เพื่อทำการจอง';
      return;
    }

    // เตรียมข้อมูลสำหรับการจอง
    const payload = {
      user_id: userId,
      booth_id: this.selectedBooth.id,
      event_id: 1,
      details: this.details // ใช้ค่า details จาก input
    };

    const apiUrl = 'https://wag19.bowlab.net/bookings.php';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.post<any>(apiUrl, payload, { headers }).subscribe(
      (response) => {
        if (response.status === 'success') {
          this.router.navigate(['/my-booths']);
        } else {
          this.errorMessage = response.message || 'เกิดข้อผิดพลาดในการจองบูธ';
        }
      },
      (error) => {
        this.errorMessage = 'เกิดข้อผิดพลาดในการจองบูธ';
        console.error('Error:', error);
      }
    );
  }
}
