import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BuscarPlanificacionComponent } from './buscar-planificacion.component';
import { InfoProductoComponent } from 'src/app/components/info-producto/info-producto.component';
import { InfoRecetaComponent } from 'src/app/components/info-receta/info-receta.component';

const routes: Routes = [
	{ path: '', component: BuscarPlanificacionComponent },
	{ path: 'producto/:id', component: InfoProductoComponent },
	{ path: 'receta/:id', component: InfoRecetaComponent },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class BuscarPlanificacionRoutingModule {}
