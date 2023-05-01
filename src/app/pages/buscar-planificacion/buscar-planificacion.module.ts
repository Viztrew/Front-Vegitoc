import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuscarPlanificacionRoutingModule } from './buscar-planificacion-routing.module';
import { BuscarPlanificacionComponent } from './buscar-planificacion.component';
import { PrimengModule } from '../../modules/primeng.module';
import { FormsModule } from '@angular/forms';
import { BuscarItemsComponent } from 'src/app/pages/buscar-planificacion/buscar-items/buscar-items.component';
import { SharedComponentsModule } from 'src/app/modules/shared-components.module';
@NgModule({
	declarations: [BuscarPlanificacionComponent, BuscarItemsComponent],
	imports: [
		CommonModule,
		BuscarPlanificacionRoutingModule,
		PrimengModule,
		FormsModule,
		SharedComponentsModule,
	],
})
export class BuscarPlanificacionModule {}
