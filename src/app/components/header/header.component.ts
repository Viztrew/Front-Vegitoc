import { Component, ViewChild } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { VegiService } from 'src/app/services/vegi.service';
import { Router } from '@angular/router';
@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
	constructor(private servicio: VegiService, private router: Router) {}

	@ViewChild(SidebarComponent) sidebar: any;

	profileMenuVisible: boolean = false;

	usuario = {
		email: 'email@falso',
		password: 'clave_falsa',
	};

	isLoggedIn: boolean = false;

	rutalogo: string = '/login';

	async ngOnInit() {
		await this.servicio.loggedIn();
		this.isLoggedIn = this.servicio.isLoggedIn;

		this.servicio.login$.subscribe((data) => {
			if (data) {
				this.isLoggedIn = true;
			} else {
				this.isLoggedIn = false;
			}
		});
	}

	async showSidebar() {
		this.sidebar.sidebarVisible = true;
	}

	async showProfileMenu() {
		this.profileMenuVisible = true;
	}

	rutaLogo() {
		if (this.isLoggedIn) {
			this.router.navigateByUrl('/planificacion');
		} else {
			this.router.navigateByUrl('/login');
		}
	}
}
