import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrimengModule } from '../../modules/primeng.module';
import { FormsModule } from '@angular/forms';
import { SharedComponentsModule } from 'src/app/modules/shared-components.module';

import { PlanificacionRoutingModule } from './planificacion-routing.module';
import { PlanificacionComponent } from './planificacion.component';
import { DiaPlanificacionComponent } from './dia-planificacion/dia-planificacion.component';
import { DialogRecomendacionComponent } from './dialog-recomendacion/dialog-recomendacion.component';

@NgModule({
	declarations: [
		PlanificacionComponent,
		DiaPlanificacionComponent,
		DialogRecomendacionComponent,
	],
	imports: [
		CommonModule,
		PrimengModule,
		PlanificacionRoutingModule,
		SharedComponentsModule,
		FormsModule,
	],
})
export class PlanificacionModule {}
