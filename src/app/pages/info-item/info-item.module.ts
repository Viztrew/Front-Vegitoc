import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimengModule } from '../../modules/primeng.module';
import { FormsModule } from '@angular/forms';
import { SharedComponentsModule } from 'src/app/modules/shared-components.module';
import { InfoItemRoutingModule } from './info-item-routing.module';
import { InfoItemComponent } from './info-item.component';

@NgModule({
	declarations: [InfoItemComponent],
	imports: [
		CommonModule,
		PrimengModule,
		InfoItemRoutingModule,
		SharedComponentsModule,
		FormsModule,
	],
})
export class InfoItemModule {}
