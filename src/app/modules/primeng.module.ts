import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//MODULES PRIMENG
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { InputTextModule } from 'primeng/inputtext';
import { TabViewModule } from 'primeng/tabview';
import { ScrollerModule } from 'primeng/scroller';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ToastModule } from 'primeng/toast';
import { MenuModule } from 'primeng/menu';
import { AccordionModule } from 'primeng/accordion';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';
import { FieldsetModule } from 'primeng/fieldset';
// SPINNER
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
		DividerModule,
		TableModule,
		InputSwitchModule,
		ToastModule,
		MenuModule,
		AccordionModule,
		TooltipModule,
		DialogModule,
		RadioButtonModule,
		CheckboxModule,
		FieldsetModule,
	],
	exports: [
		ButtonModule,
		SidebarModule,
		InputTextModule,
		TabViewModule,
		ScrollerModule,
		ProgressSpinnerModule,
		DividerModule,
		TableModule,
		InputSwitchModule,
		ToastModule,
		MenuModule,
		AccordionModule,
		TooltipModule,
		DialogModule,
		RadioButtonModule,
		CheckboxModule,
		FieldsetModule,
	],
})
export class PrimengModule {}
