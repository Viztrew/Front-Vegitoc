import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//MODULES PRIMENG
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { InputTextModule } from 'primeng/inputtext';
@NgModule({
	declarations: [],
	imports: [CommonModule, ButtonModule, SidebarModule, InputTextModule],
	exports: [ButtonModule, SidebarModule, InputTextModule],
})
export class PrimengModule {}
