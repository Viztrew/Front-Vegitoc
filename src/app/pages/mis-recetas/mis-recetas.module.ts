import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimengModule } from '../../modules/primeng.module';
import { MisRecetasComponent } from './mis-recetas.component';
import { MisRecetasRoutingModule } from './mis-recetas-routing.module';
import { SharedComponentsModule } from 'src/app/modules/shared-components.module';

@NgModule({
	declarations: [MisRecetasComponent],
	imports: [
		CommonModule,
		PrimengModule,
		MisRecetasRoutingModule,
		SharedComponentsModule,
	],
})
export class MisRecetasModule {}
