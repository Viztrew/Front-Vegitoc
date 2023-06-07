import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrearRecetaComponent } from './crear-receta.component';
import { CrearRecetaRoutingModule } from './crear-receta-routing.module';
import { SharedComponentsModule } from 'src/app/modules/shared-components.module';

import { PrimengModule } from '../../modules/primeng.module';

@NgModule({
	declarations: [CrearRecetaComponent],
	imports: [
		CommonModule,
		CrearRecetaRoutingModule,
		SharedComponentsModule,
		PrimengModule,
	],
})
export class CrearRecetaModule {}
