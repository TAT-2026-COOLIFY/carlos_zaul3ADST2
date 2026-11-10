import { Component, OnInit, inject, input, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DadosCliente, UNIDADES_FEDERATIVAS } from '../cliente.model';
import { ClienteService } from '../cliente.service';
import { cpfUnicoValidator, cpfValidator } from '../cpf.validator';
import { MascaraDirective } from '../mascara.directive';

@Component({
  selector: 'app-cliente-formulario',
  imports: [ReactiveFormsModule, RouterLink, MascaraDirective],
  templateUrl: './cliente-formulario.html',
})
export class ClienteFormulario implements OnInit {
  readonly id = input<string>();

  private readonly construtor = inject(NonNullableFormBuilder);
  private readonly clienteService = inject(ClienteService);
  private readonly roteador = inject(Router);

  protected readonly unidadesFederativas = UNIDADES_FEDERATIVAS;
  protected readonly erroCarregamento = signal<string | null>(null);

  protected readonly formulario = this.construtor.group({
    nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(120)]],
    cpf: [
      '',
      [
        Validators.required,
        cpfValidator(),
        cpfUnicoValidator((cpf) => this.clienteService.cpfJaCadastrado(cpf, this.id())),
      ],
    ],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(120)]],
    telefone: ['', [Validators.required, Validators.pattern(/^\(\d{2}\) \d{4,5}-\d{4}$/)]],
    cep: ['', [Validators.pattern(/^\d{5}-\d{3}$/)]],
    logradouro: ['', [Validators.maxLength(150)]],
    numero: ['', [Validators.maxLength(10)]],
    cidade: ['', [Validators.maxLength(80)]],
    uf: [''],
    ativo: [true],
  });

  protected get editando(): boolean {
    return !!this.id();
  }

  ngOnInit(): void {
    const id = this.id();
    if (!id) {
      return;
    }
    this.clienteService.obterPorId(id).subscribe({
      next: (cliente) => this.formulario.patchValue(cliente),
      error: (erro: Error) => this.erroCarregamento.set(erro.message),
    });
  }

  protected campoInvalido(nomeCampo: keyof DadosCliente): boolean {
    const controle = this.formulario.controls[nomeCampo];
    return controle.invalid && (controle.touched || controle.dirty);
  }

  protected salvar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    const dados = this.formulario.getRawValue();
    const id = this.id();
    const operacao = id
      ? this.clienteService.atualizar(id, dados)
      : this.clienteService.criar(dados);
    operacao.subscribe(() => this.roteador.navigate(['/clientes']));
  }
}
