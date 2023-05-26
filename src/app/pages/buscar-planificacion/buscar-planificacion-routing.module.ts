import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BuscarPlanificacionComponent } from './buscar-planificacion.component';

const routes: Routes = [{ path: '', component: BuscarPlanificacionComponent }];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class BuscarPlanificacionRoutingModule {}
