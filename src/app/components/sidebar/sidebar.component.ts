import { Component, OnInit } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.service';
import { MessageService } from 'primeng/api';
@Component({
	selector: 'app-sidebar',
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
	constructor(
		private themeService: ThemeService,
		private messageService: MessageService
	) {}

	menuItems: any = [];

	themeChecked: boolean = false;

	sidebarVisible: boolean = false;

	ngOnInit() {
		let theme = sessionStorage.getItem('theme');
		if (theme) {
			if (theme == 'arya-orange') {
				this.themeChecked = true;
			} else {
				this.themeChecked = false;
			}
		}

		this.menuItems = [
			{
				items: [
					{
						label: 'Home',
						icon: 'pi pi-home',
						routerLink: ['/home'],
					},
					{
						label: 'Planificación',
						icon: 'pi pi-calendar',
						routerLink: ['/planificacion'],
					},
					/*
					{
						label: 'Buscar',
						icon: 'pi pi-search',
						routerLink: ['/buscar'],
					},*/
				],
			},
		];
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
