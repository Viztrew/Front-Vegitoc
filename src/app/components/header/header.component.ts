import { Component, ViewChild } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
	@ViewChild(SidebarComponent) sidebar: any;
	profileMenuVisible: boolean = false;
	async showSidebar() {
		this.sidebar.sidebarVisible = true;
	}

	async showProfileMenu() {
		this.profileMenuVisible = true;
	}
}
