import { Component, OnInit } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.service';
import { MenuItem, MessageService } from 'primeng/api';
import { MenuItemContent } from 'primeng/menu';
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
		let theme = localStorage.getItem('theme');
		if (theme) {
			if (theme == 'arya-green') {
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

					{
						label: 'Buscar',
						icon: 'pi pi-search',
						routerLink: ['/buscar'],
					},
				],
			},
		];
	}

	changeTheme() {
		if (this.themeChecked) {
			localStorage.setItem('theme', 'arya-green');
			this.themeService.switchTheme('arya-green');
			this.messageService.clear();
			this.messageService.add({
				severity: 'success',
				summary: 'Modo Vegano',
				detail: 'Se ha activado el modo vegano',
				life: 1500,
			});
		} else {
			localStorage.setItem('theme', 'arya-orange');
			this.themeService.switchTheme('arya-orange');
			this.messageService.clear();
			this.messageService.add({
				severity: 'info',
				summary: 'Modo Vegano',
				detail: 'Se ha desactivado el modo vegano',
				life: 1500,
			});
		}
	}
}
