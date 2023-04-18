import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanificacionComponent } from './planificacion.component';
import { PrimengModule } from '../../modules/primeng.module';
import { PlanificacionRoutingModule } from './planificacion-routing.module';

@NgModule({
	declarations: [PlanificacionComponent],
	imports: [CommonModule, PrimengModule, PlanificacionRoutingModule],
})
export class PlanificacionModule {}
