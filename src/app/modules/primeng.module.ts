import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//MODULES PRIMENG
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { InputTextModule } from 'primeng/inputtext';
import { TabViewModule } from 'primeng/tabview';
import { ScrollerModule } from 'primeng/scroller';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@NgModule({
	declarations: [],
	imports: [
		CommonModule,
		ButtonModule,
		SidebarModule,
		InputTextModule,
		TabViewModule,
		ScrollerModule,
		ProgressSpinnerModule,
	],
	exports: [
		ButtonModule,
		SidebarModule,
		InputTextModule,
		TabViewModule,
		ScrollerModule,
		ProgressSpinnerModule,
	],
})
export class PrimengModule {}
