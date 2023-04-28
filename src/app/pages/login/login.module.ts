import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimengModule } from '../../modules/primeng.module';  
import { LoginComponent } from './login.component';            
import { LoginRoutingModule } from './login-routing.module';   
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';






@NgModule({
	declarations: [LoginComponent],
	imports: [CommonModule, PrimengModule, LoginRoutingModule, FormsModule, ReactiveFormsModule],
})
export class LoginModule {}
