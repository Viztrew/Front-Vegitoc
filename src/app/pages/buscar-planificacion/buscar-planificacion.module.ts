import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuscarPlanificacionRoutingModule } from './buscar-planificacion-routes.resolver';
import { BuscarPlanificacionComponent } from './buscar-planificacion.component';
import { PrimengModule } from '../../modules/primeng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
	declarations: [BuscarPlanificacionComponent],
	imports: [
		CommonModule,
		BuscarPlanificacionRoutingModule,
		PrimengModule,
		FormsModule,
	],
})
export class BuscarPlanificacionModule {}
