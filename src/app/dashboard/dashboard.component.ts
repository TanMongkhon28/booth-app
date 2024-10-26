import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true
})
export class DashboardComponent implements OnInit {
  userName: string = '';  
  userLastName: string = '';  

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    // ตรวจสอบการทำงานในเบราว์เซอร์
    if (isPlatformBrowser(this.platformId)) {
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      if (!isLoggedIn) {
        this.router.navigate(['/login']); 
      } else {
        this.userName = localStorage.getItem('userName') || '';
        this.userLastName = localStorage.getItem('userLastName') || '';
      }
    }
  }

  

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.clear(); 
      this.router.navigate(['/login']); 
    }
  }

  viewBooth(): void {
    this.router.navigate(['/select-zone']); 
  }

  viewMyBooths(): void {
    this.router.navigate(['/my-booths']); 
  }

  goToSettings(): void {
    this.router.navigate(['/settings']);
  }
}
