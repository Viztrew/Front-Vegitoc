import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimengModule } from '../../modules/primeng.module';
import { PerfilRoutingModule } from './perfil-routing.module';
import { PerfilComponent } from './perfil.component';
import { SharedComponentsModule } from 'src/app/modules/shared-components.module';

@NgModule({
	declarations: [PerfilComponent],
	imports: [
		CommonModule,
		PrimengModule,
		PerfilRoutingModule,
		SharedComponentsModule,
	],
})
export class PerfilModule {}
