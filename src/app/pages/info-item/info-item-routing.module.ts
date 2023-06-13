import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InfoProductoComponent } from 'src/app/pages/info-item/info-producto/info-producto.component';
import { InfoRecetaComponent } from 'src/app/pages/info-item/info-receta/info-receta.component';

const routes: Routes = [
	{ path: 'producto/:id', component: InfoProductoComponent },
	{ path: 'receta/:id', component: InfoRecetaComponent },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class InfoItemRoutingModule {}
