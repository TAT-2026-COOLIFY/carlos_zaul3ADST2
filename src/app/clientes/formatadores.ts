export type TipoMascara = 'cpf' | 'telefone' | 'cep';

export function somenteDigitos(valor: string): string {
  return (valor ?? '').replace(/\D/g, '');
}

export function formatarCpf(valor: string): string {
  const digitos = somenteDigitos(valor).slice(0, 11);
  return digitos
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
}

export function formatarTelefone(valor: string): string {
  const digitos = somenteDigitos(valor).slice(0, 11);
  if (digitos.length <= 2) {
    return digitos.replace(/^(\d+)/, '($1');
  }
  if (digitos.length <= 6) {
    return digitos.replace(/^(\d{2})(\d+)/, '($1) $2');
  }
  if (digitos.length <= 10) {
    return digitos.replace(/^(\d{2})(\d{4})(\d+)/, '($1) $2-$3');
  }
  return digitos.replace(/^(\d{2})(\d{5})(\d+)/, '($1) $2-$3');
}

export function formatarCep(valor: string): string {
  return somenteDigitos(valor).slice(0, 8).replace(/^(\d{5})(\d)/, '$1-$2');
}

export function aplicarMascara(tipo: TipoMascara, valor: string): string {
  switch (tipo) {
    case 'cpf':
      return formatarCpf(valor);
    case 'telefone':
      return formatarTelefone(valor);
    case 'cep':
      return formatarCep(valor);
  }
}
