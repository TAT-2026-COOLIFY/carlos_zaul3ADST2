import { Injectable, computed, signal } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Cliente, DadosCliente } from './cliente.model';
import { somenteDigitos } from './formatadores';

const CHAVE_ARMAZENAMENTO = 'cadastro-clientes:clientes';

@Injectable({ providedIn: 'root' })
export class ClienteService {
  private readonly clientesInternos = signal<Cliente[]>(this.carregarDoArmazenamento());

  readonly clientes = computed(() =>
    [...this.clientesInternos()].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR')),
  );

  obterPorId(id: string): Observable<Cliente> {
    const cliente = this.clientesInternos().find((item) => item.id === id);
    return cliente ? of(cliente) : throwError(() => new Error('Cliente não encontrado.'));
  }

  cpfJaCadastrado(cpf: string, idIgnorado?: string): boolean {
    const cpfNormalizado = somenteDigitos(cpf);
    return this.clientesInternos().some(
      (cliente) => cliente.id !== idIgnorado && somenteDigitos(cliente.cpf) === cpfNormalizado,
    );
  }

  criar(dados: DadosCliente): Observable<Cliente> {
    const novoCliente: Cliente = {
      ...dados,
      id: crypto.randomUUID(),
      criadoEm: new Date().toISOString(),
    };
    this.atualizarLista([...this.clientesInternos(), novoCliente]);
    return of(novoCliente);
  }

  atualizar(id: string, dados: DadosCliente): Observable<Cliente> {
    const existente = this.clientesInternos().find((cliente) => cliente.id === id);
    if (!existente) {
      return throwError(() => new Error('Cliente não encontrado.'));
    }
    const atualizado: Cliente = { ...existente, ...dados };
    this.atualizarLista(
      this.clientesInternos().map((cliente) => (cliente.id === id ? atualizado : cliente)),
    );
    return of(atualizado);
  }

  excluir(id: string): Observable<void> {
    this.atualizarLista(this.clientesInternos().filter((cliente) => cliente.id !== id));
    return of(void 0);
  }

  private atualizarLista(clientes: Cliente[]): void {
    this.clientesInternos.set(clientes);
    try {
      localStorage.setItem(CHAVE_ARMAZENAMENTO, JSON.stringify(clientes));
    } catch {
      return;
    }
  }

  private carregarDoArmazenamento(): Cliente[] {
    try {
      const conteudo = localStorage.getItem(CHAVE_ARMAZENAMENTO);
      return conteudo ? (JSON.parse(conteudo) as Cliente[]) : [];
    } catch {
      return [];
    }
  }
}
