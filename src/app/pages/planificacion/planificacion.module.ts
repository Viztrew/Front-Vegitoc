import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanificacionComponent } from './planificacion.component';
import { PrimengModule } from '../../modules/primeng.module';
import { PlanificacionRoutingModule } from './planificacion-routing.module';
import { DiaPlanificacionComponent } from './dia-planificacion/dia-planificacion.component';

import { FormsModule } from '@angular/forms';
import { SharedComponentsModule } from 'src/app/modules/shared-components.module';
@NgModule({
	declarations: [PlanificacionComponent, DiaPlanificacionComponent],
	imports: [
		CommonModule,
		PrimengModule,
		PlanificacionRoutingModule,
		SharedComponentsModule,
		FormsModule,
	],
})
export class PlanificacionModule {}
