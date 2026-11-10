export interface Cliente {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  cep: string;
  logradouro: string;
  numero: string;
  cidade: string;
  uf: string;
  ativo: boolean;
  criadoEm: string;
}

export type DadosCliente = Omit<Cliente, 'id' | 'criadoEm'>;

export const UNIDADES_FEDERATIVAS: readonly string[] = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA',
  'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
];
