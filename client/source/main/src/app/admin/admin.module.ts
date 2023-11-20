import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { BreadcrumbComponent } from '../shared/components/breadcrumb/breadcrumb.component';
import { AllEarningsComponent } from './all-earnings/all-earnings.component';

@NgModule({
  declarations: [],
  imports: [CommonModule, AdminRoutingModule, AllEarningsComponent],
})
export class AdminModule {}
