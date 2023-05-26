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
		path: 'buscar/:dia/:momento',
		loadChildren: () =>
			import(
				'../pages/buscar-planificacion/buscar-planificacion.module'
			).then((m) => m.BuscarPlanificacionModule),
	},
	{
		path: 'info',
		loadChildren: () =>
			import('../pages/info-item/info-item.module').then(
				(m) => m.InfoItemModule
			),
	},
	{ path: '**', redirectTo: '/404' },
	{
		path: '404',
		loadChildren: () =>
			import('../pages/not-found/not-found.module').then(
				(m) => m.NotFoundModule
			),
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class RoutingModule {}
