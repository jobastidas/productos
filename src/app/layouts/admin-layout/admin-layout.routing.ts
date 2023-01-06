import { Routes } from '@angular/router';

import { CategoriasComponent} from '../../pages/categorias/categorias.component';
import {UsuariosComponent} from '../../pages/usuarios/usuarios.component';
import {ProductosComponent} from '../../pages/productos/productos.component';
export const AdminLayoutRoutes: Routes = [
    { path: 'categorias',      component: CategoriasComponent },
    { path: 'usuarios',   component: UsuariosComponent },
    { path: 'productos',         component: ProductosComponent },
   
];
