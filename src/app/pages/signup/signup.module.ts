import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignupComponent } from './signup.component';
import { PrimengModule } from 'src/app/modules/primeng.module';
import { SignupRoutingModule } from './signup-routing.module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { StepsModule } from 'primeng/steps';
import { CalendarModule } from 'primeng/calendar';


@NgModule({
	declarations: [SignupComponent],
	imports: [CommonModule, PrimengModule, SignupRoutingModule, FormsModule, ReactiveFormsModule, StepsModule, CalendarModule],
})
export class SignupModule {}
