import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgIf, NgFor, CommonModule } from '@angular/common';

@Component({
  selector: 'app-select-zone',
  templateUrl: './select-zone.component.html',
  styleUrls: ['./select-zone.component.scss'],
  standalone: true,
  imports: [CommonModule, NgIf, NgFor]
})
export class SelectZoneComponent implements OnInit {
  zones: any[] = [];
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.getZones();
  }

  // ฟังก์ชันดึงข้อมูล Zone จาก API
  getZones(): void {
    this.http.get<any>('https://wag19.bowlab.net/get_zone.php').subscribe(
      (data) => {
        console.log('Received data:', data); // แสดงข้อมูลเพื่อดีบัก
        if (data.status === 'success' && Array.isArray(data.zones)) {
          this.zones = data.zones;
        } else {
          this.errorMessage = data.message || 'เกิดข้อผิดพลาดในการดึงข้อมูล Zone';
        }
      },
      (error) => {
        this.errorMessage = 'เกิดข้อผิดพลาดในการดึงข้อมูล Zone';
        console.error('Error:', error);
      }
    );
  }

  // ฟังก์ชันนำผู้ใช้ไปยังหน้า Booth List ตาม Zone ที่เลือก
  viewBooth(zoneId: string): void {
    this.router.navigate(['/booth'], { queryParams: { zone: zoneId } });
  }
}
