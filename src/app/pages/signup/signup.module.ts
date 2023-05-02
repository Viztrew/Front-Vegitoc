import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignupComponent } from './signup.component';
import { PrimengModule } from 'src/app/modules/primeng.module';
import { SignupRoutingModule } from './signup-routing.module';

@NgModule({
	declarations: [SignupComponent],
	imports: [CommonModule, PrimengModule, SignupRoutingModule],
})
export class SignupModule {}
