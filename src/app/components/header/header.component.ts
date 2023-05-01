import { Component, ViewChild } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { VegiService } from 'src/app/services/vegi.service';
@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
	constructor(private servicio: VegiService) {}

	@ViewChild(SidebarComponent) sidebar: any;

	profileMenuVisible: boolean = false;

	usuario = {
		email: 'email@falso',
		password: 'clave_falsa',
	};

	async showSidebar() {
		this.sidebar.sidebarVisible = true;
	}

	async showProfileMenu() {
		this.profileMenuVisible = true;
	}

	login() {
		console.log('login ->');

		this.servicio.login(this.usuario).subscribe((data) => {
			if (data) {
				localStorage.setItem('session', data.token);
			}

			console.log(data);
		});
	}
}
