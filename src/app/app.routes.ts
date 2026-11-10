import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'clientes' },
  {
    path: 'clientes',
    loadComponent: () =>
      import('./clientes/cliente-lista/cliente-lista').then((modulo) => modulo.ClienteLista),
  },
  {
    path: 'clientes/novo',
    loadComponent: () =>
      import('./clientes/cliente-formulario/cliente-formulario').then(
        (modulo) => modulo.ClienteFormulario,
      ),
  },
  {
    path: 'clientes/:id/editar',
    loadComponent: () =>
      import('./clientes/cliente-formulario/cliente-formulario').then(
        (modulo) => modulo.ClienteFormulario,
      ),
  },
  { path: '**', redirectTo: 'clientes' },
];
