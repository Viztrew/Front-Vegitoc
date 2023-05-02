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
	{
		path: 'login',
		loadChildren: () =>
			import('../pages/login/login.module').then((m) => m.LoginModule),
	},
	{
		path: 'signup',
		loadChildren: () =>
			import('../pages/signup/signup.module').then((m) => m.SignupModule),
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class RoutingModule {}
