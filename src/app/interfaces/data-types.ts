export interface Producto {
	id_producto: number;
	nombre: string;
	marca: string;
	cantidad_embase: string;
	kcal_prcn: string;
	favorito: boolean;
}

export interface Receta {
	id_preparacion: number;
	nombre: string;
	kcal_prcn: string;
	link_imagen: string;
	favorito: boolean;
}

export interface Favoritos {
	productos: [Producto];
	recetas: [Receta];
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
	info_receta: {
		id_preparacion: number;
		nombre: string;
		kcal_prcn: string;
		prot_prcn: string;
		gr_totales_prcn: string;
		hidratos_prcn: string;
	};
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
	pasos: [
		{
			id_preparacion: number;
			n_paso: number;
			descripcion: string;
		}
	];
}

//interfaz para crear recetas
export interface CrearReceta {
	nombre: string;
	lista_productos: [Ingrediente];
	pasos: [Paso];
}

export interface Ingrediente {
	id_producto: string;
	nombre_producto: string;
	cantidad: number;
	id_unidad_medida: number;
	nombre_unidad: string;
	kcal: number;
	editar: boolean;
}

export interface Paso {
	n_paso: number;
	descripcion: string;
}

export interface UnidadMedida {
	id_unidad_medida: number;
	nombre: string;
	unidad_base: string;
	multiplicador: string;
}

// interfaz para prodcutos de la planificacion
export interface PlanProducto {
	id_plan_producto: number;
	id_usuario: number;
	fecha: string;
	id_producto: string;
	unidad_medida: number;
	cantidad: string;
	checked: boolean;
	momento_dia: string;
	nombre_unidad: string;
	nombre: string;
	kcal: string;
}

// interfaz para recetas de la planificacion
export interface PlanReceta {
	id_plan_preparacion: number;
	id_usuario: number;
	fecha: string;
	id_preparacion: string;
	nombre: string;
	cantidad: string;
	checked: boolean;
	momento_dia: string;
	kcal: string;
}

// interfaz para obtener planificacion
export interface Planificacion {
	productos: [PlanProducto];

	preparaciones: [PlanReceta];
}

//interfaz para agregar productos al plan
export interface ProductoAgregarPlan {
	fecha: string;
	dia: string;
	momento_dia: string;
	id_producto: string;
	nombre: string;
	unidad_medida: number;
	nombre_unidad: string;
	cantidad: number;
	kcal: string;
	checked: boolean;
}

//interfaz para agregar recetas al plan
export interface RecetaAgregarPlan {
	fecha: string;
	dia: string;
	momento_dia: string;
	id_preparacion: string;
	nombre: string;
	cantidad: number;
	kcal: string;
	checked: boolean;
}

export interface Recomendacion {
	productos: Array<ProductoAgregarPlan>;
	recetas: Array<RecetaAgregarPlan>;
}

export interface ProductoRecomendado {
	cantidad: number;
	id_producto: string;
	kcal: number;
	nombre: string;
	nombre_unidad: string;
}

export interface RecetaRecomendada {
	cantidad: number;
	id_preparacion: number;
	kcal: number;
	nombre: string;
	nombre_unidad: string;
}
//interfaz para marcar el checked de una receta
export interface CheckedReceta {
	id_plan_preparacion: number;
	checked: boolean;
}

//interfaz para marcar el checked de un producto
export interface CheckedProducto {
	id_plan_producto: number;
	checked: boolean;
}
