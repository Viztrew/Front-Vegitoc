import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { PrimengModule } from './primeng.module';
import { InfoProductoComponent } from '../components/info-producto/info-producto.component';
import { InfoRecetaComponent } from '../components/info-receta/info-receta.component';
import { ItemComponent } from '../components/item/item.component';
import { DialogAgregarComponent } from '../components/dialog-agregar/dialog-agregar.component';
@NgModule({
	declarations: [
		InfoProductoComponent,
		InfoRecetaComponent,
		ItemComponent,
		DialogAgregarComponent,
	],
	imports: [CommonModule, FormsModule, ReactiveFormsModule, PrimengModule],
	exports: [
		InfoProductoComponent,
		InfoRecetaComponent,
		ItemComponent,
		DialogAgregarComponent,
	],
})
export class SharedComponentsModule {}