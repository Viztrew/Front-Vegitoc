import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{
		path: '',
		redirectTo: 'planificacion',
		pathMatch: 'full',
	},

	{
		path: 'perfil',
		loadChildren: () =>
			import('../pages/perfil/perfil.module').then((m) => m.PerfilModule),
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
	{
		path: 'login',
		loadChildren: () =>
			import('../pages/login/login.module').then((m) => m.LoginModule),
	},
	{
		path: 'signup',
		loadChildren: () =>
			import('../pages/signup/signup.module').then((m) => m.SignupModule),
	},
	{
		path: 'crear-receta',
		loadChildren: () =>
			import('../pages/crear-receta/crear-receta.module').then(
				(m) => m.CrearRecetaModule
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
