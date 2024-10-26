import { Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SelectZoneComponent } from './select-zone/select-zone.component';
import { BoothComponent } from './booth/booth.component';
import { MyBoothsComponent } from './my-booths/my-booths.component';
import { BoothDetailsComponent } from './booth-details/booth-details.component';
import { SettingsComponent } from './settings/settings.component';
export const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'select-zone', component: SelectZoneComponent },
  { path: 'booth', component: BoothComponent },
  { path: 'my-booths', component: MyBoothsComponent },
  { path: 'booth-details', component: BoothDetailsComponent},
  { path: 'settings', component: SettingsComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
