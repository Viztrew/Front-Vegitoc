import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { RoutingModule } from './routes/routing.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FormsModule } from '@angular/forms';
import { PrimengModule } from './modules/primeng.module';
import { SharedComponentsModule } from './modules/shared-components.module';
import { ReactiveFormsModule } from '@angular/forms';
//compontentes
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

@NgModule({
	declarations: [
		AppComponent,
		SidebarComponent,
		FooterComponent,
		HeaderComponent,
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		CommonModule,
		RoutingModule,
		PrimengModule,
		HttpClientModule,
		NgxSpinnerModule,
		FormsModule,
		SharedComponentsModule,
		ReactiveFormsModule,
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
