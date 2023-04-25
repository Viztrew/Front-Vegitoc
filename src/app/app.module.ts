import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { RoutingModule } from './routes/routing.module';
import { AppComponent } from './app.component';
import { PrimengModule } from './modules/primeng.module';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
	declarations: [
		AppComponent,
		HeaderComponent,
		FooterComponent,
		SidebarComponent,
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		CommonModule,
		RoutingModule,
		PrimengModule,
		HttpClientModule,
		NgxSpinnerModule,
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
