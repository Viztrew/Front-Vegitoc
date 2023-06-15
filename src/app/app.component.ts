import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { ThemeService } from './services/theme.service';
@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	providers: [MessageService],
})
export class AppComponent implements OnInit {
	constructor(
		private primengConfig: PrimeNGConfig,
		private themeService: ThemeService
	) {}

	ngOnInit() {
		this.primengConfig.ripple = true;
		if (localStorage.getItem('theme')) {
			this.themeService.switchTheme(
				localStorage.getItem('theme') || 'saga-orange'
			);
		} else {
			this.themeService.switchTheme('saga-orange');
		}
	}
}
