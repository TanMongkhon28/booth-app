import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-booth-list',
  templateUrl: './booth-list.component.html',
  styleUrls: ['./booth-list.component.scss'],
  standalone: true,
  imports: [FormsModule, NgIf, NgFor]
})
export class BoothListComponent implements OnInit {
  booths: any[] = [];
  errorMessage: string = '';
  private apiUrl = 'https://wag19.bowlab.net/get_booth.php'; // เปลี่ยนเป็น URL ของ API

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getBooths(); // เรียกฟังก์ชันการดึงข้อมูลเมื่อ Component โหลด
  }

  getBooths(): void {
    this.http.get<any>('https://wag19.bowlab.net/get_booth.php').subscribe(
      (data) => {
        console.log('Received data:', data); // แสดงข้อมูลที่ได้รับใน Console
  
        // ตรวจสอบสถานะและกำหนดข้อมูลบูธ
        if (data.status === 'success' && Array.isArray(data.booths)) {
          this.booths = data.booths; // กำหนดข้อมูลใน booths จาก data.booths
        } else {
          this.errorMessage = data.message || 'เกิดข้อผิดพลาดในการดึงข้อมูล';
          console.error('Error: Data is not an array:', data);
        }
      },
      (error) => {
        this.errorMessage = 'เกิดข้อผิดพลาดในการดึงข้อมูล';
        console.error('Error:', error);
      }
    );
  }
  
  
}
