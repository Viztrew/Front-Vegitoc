import { Component, OnInit } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { VegiService } from 'src/app/services/vegi.service';
@Component({
	selector: 'app-sidebar',
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
	constructor(
		private themeService: ThemeService,
		private messageService: MessageService,
		private route: ActivatedRoute,
		private servicio: VegiService
	) {}

	menuItems: any = [];

	themeChecked: boolean = false;

	sidebarVisible: boolean = false;

	rutaActual!: any;

	ngOnInit() {
		this.rutaActual = this.route.snapshot.url.join('/');

		let theme = sessionStorage.getItem('theme');
		if (theme) {
			if (theme == 'arya-orange') {
				this.themeChecked = true;
			} else {
				this.themeChecked = false;
			}
		} else {
			sessionStorage.setItem('theme', 'saga-orange');
		}

		this.menuItems = [
			{
				items: [
					{
						label: 'Planificación',
						icon: 'pi pi-calendar',
						routerLink: ['/planificacion'],
					},

					{
						label: 'Crear receta',
						icon: 'pi pi-book',
						routerLink: ['/crear-receta'],
					},
					{
						label: 'Perfil',
						icon: 'pi pi-user',
						routerLink: ['/perfil'],
					},
				],
			},
		];
	}

	mostrarRuta() {
		console.log(this.route.snapshot.url);
	}

	async logout() {
		this.servicio.logout();
	}

	changeTheme() {
		if (this.themeChecked) {
			sessionStorage.setItem('theme', 'arya-orange');
			this.themeService.switchTheme('arya-orange');
			this.messageService.clear();
			this.messageService.add({
				severity: 'success',
				summary: 'Modo Oscuro',
				detail: 'Se ha activado el modo oscuro',
				life: 1500,
			});
		} else {
			sessionStorage.setItem('theme', 'saga-orange');
			this.themeService.switchTheme('saga-orange');
			this.messageService.clear();
			this.messageService.add({
				severity: 'info',
				summary: 'Modo Oscuro',
				detail: 'Se ha desactivado el modo oscuro',
				life: 1500,
			});
		}
	}
}
