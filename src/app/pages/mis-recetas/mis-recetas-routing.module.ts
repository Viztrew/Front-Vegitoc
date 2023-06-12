import { NgModule } from '@angular/core';
import { MisRecetasComponent } from './mis-recetas.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{ path: '', component: MisRecetasComponent }];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class MisRecetasRoutingModule {}
