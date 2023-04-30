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

	themeChecked: boolean = false;

	sidebarVisible: boolean = false;

	ngOnInit() {
		let theme = localStorage.getItem('theme');
		if (theme) {
			if (theme == 'saga-green') {
				this.themeChecked = true;
			} else {
				this.themeChecked = false;
			}
		}
	}

	changeTheme() {
		if (this.themeChecked) {
			localStorage.setItem('theme', 'saga-green');
			this.themeService.switchTheme('saga-green');
			this.messageService.clear();
			this.messageService.add({
				severity: 'success',
				summary: 'Modo Vegano',
				detail: 'Se ha activado el modo vegano',
				life: 1500,
			});
		} else {
			localStorage.setItem('theme', 'saga-orange');
			this.themeService.switchTheme('saga-orange');
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
