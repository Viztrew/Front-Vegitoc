import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuscarPlanificacionRoutingModule } from './buscar-planificacion-routing.module';
import { BuscarPlanificacionComponent } from './buscar-planificacion.component';
import { PrimengModule } from '../../modules/primeng.module';
import { FormsModule } from '@angular/forms';
import { BuscarItemsComponent } from './buscar-items/buscar-items.component';
import { ItemComponent } from 'src/app/components/item/item.component';

@NgModule({
	declarations: [
		BuscarPlanificacionComponent,
		BuscarItemsComponent,
		ItemComponent,
	],
	imports: [
		CommonModule,
		BuscarPlanificacionRoutingModule,
		PrimengModule,
		FormsModule,
	],
})
export class BuscarPlanificacionModule {}
