import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Cliente } from '../cliente.model';
import { ClienteService } from '../cliente.service';
import { somenteDigitos } from '../formatadores';

@Component({
  selector: 'app-cliente-lista',
  imports: [RouterLink, DatePipe],
  templateUrl: './cliente-lista.html',
})
export class ClienteLista {
  private readonly clienteService = inject(ClienteService);

  protected readonly termoBusca = signal('');

  protected readonly clientesFiltrados = computed(() => {
    const termo = this.termoBusca().trim().toLowerCase();
    if (!termo) {
      return this.clienteService.clientes();
    }
    const termoNumerico = somenteDigitos(termo);
    return this.clienteService.clientes().filter(
      (cliente) =>
        cliente.nome.toLowerCase().includes(termo) ||
        cliente.email.toLowerCase().includes(termo) ||
        (termoNumerico.length > 0 && somenteDigitos(cliente.cpf).includes(termoNumerico)),
    );
  });

  protected readonly totalCadastrado = computed(() => this.clienteService.clientes().length);

  protected atualizarBusca(evento: Event): void {
    this.termoBusca.set((evento.target as HTMLInputElement).value);
  }

  protected excluir(cliente: Cliente): void {
    if (confirm(`Excluir o cliente "${cliente.nome}"? Esta ação não pode ser desfeita.`)) {
      this.clienteService.excluir(cliente.id).subscribe();
    }
  }
}
