import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from "../app.component";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  standalone: true,
  imports: [AppComponent]
})
export class IndexComponent {
  constructor(private router: Router) {}

  // ฟังก์ชันนำไปยังหน้า Select Zone
  goToSelectZone(): void {
    this.router.navigate(['/select-zone']);
  }

  // ฟังก์ชันนำไปยังหน้า Login
  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
