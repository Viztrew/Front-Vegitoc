import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimengModule } from '../../modules/primeng.module';
import { FormsModule } from '@angular/forms';
import { SharedComponentsModule } from 'src/app/modules/shared-components.module';
import { NotFoundComponent } from './not-found.component';
import { NotFoundRoutingModule } from './not-found-routing.module';

@NgModule({
	declarations: [NotFoundComponent],
	imports: [
		CommonModule,
		PrimengModule,
		NotFoundRoutingModule,
		SharedComponentsModule,
		FormsModule,
	],
})
export class NotFoundModule {}
