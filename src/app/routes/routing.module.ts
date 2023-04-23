import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{
		path: '',
		redirectTo: 'planificacion',
		pathMatch: 'full',
	},
	{
		path: 'home',
		loadChildren: () =>
			import('../pages/home/home.module').then((m) => m.HomeModule),
	},

	{
		path: 'planificacion',
		loadChildren: () =>
			import('../pages/planificacion/planificacion.module').then(
				(m) => m.PlanificacionModule
			),
	},

	{
		path: 'buscar',
		loadChildren: () =>
			import(
				'../pages/buscar-planificacion/buscar-planificacion.module'
			).then((m) => m.BuscarPlanificacionModule),
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class RoutingModule {}
