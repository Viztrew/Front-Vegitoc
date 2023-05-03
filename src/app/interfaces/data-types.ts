export interface Producto {
	id_producto: bigint;
	nombre: string;
	marca: string;
	cantidad_embase: string;
	kcal_prcn: string;
	favorito: boolean;
}

export interface Receta {
	id_preparacion: bigint;
	nombre: string;
	kcal_prcn: string;
	link_imagen: string;
	favorito: boolean;
}

export interface InfoProducto {
	nombre: string;
	porcion: string;
	cantidad_embase: string;
	id_nutricional: number;
	azucares_100: string;
	azucares_prcn: string;
	colesterol_100: string;
	colesterol_prcn: string;
	gr_mono_100: string;
	gr_mono_prcn: string;
	gr_poli_100: string;
	gr_poli_prcn: string;
	gr_satu_100: string;
	gr_satu_prcn: string;
	gr_totales_100: string;
	gr_totales_prcn: string;
	gr_trans_100: string;
	gr_trans_prcn: string;
	hidratos_100: string;
	hidratos_prcn: string;
	kcal_100: string;
	kcal_prcn: string;
	prot_100: string;
	prot_prcn: string;
	sodio_100: string;
	sodio_prcn: string;
}

export interface InfoReceta {
	lista_productos: [
		{
			id_preparacion: number;
			cantidad: string;
			nombre_unidad: string;
			nombre_producto: string;
			id_producto: string;
			kcal: string;
			prot: string;
			gr_totales: string;
			hidratos: string;
		}
	];
	info_receta: [
		{
			id_preparacion: number;
			nombre: string;
			kcal_prcn: string;
			prot_prcn: string;
			gr_totales_prcn: string;
			hidratos_prcn: string;
		}
	];
	pasos: [
		{
			id_preparacion: number;
			n_paso: number;
			descripcion: string;
		}
	];
}
