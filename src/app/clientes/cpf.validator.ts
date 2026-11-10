import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { somenteDigitos } from './formatadores';

function calcularDigitoVerificador(digitos: string, pesoInicial: number): number {
  const soma = digitos
    .split('')
    .reduce((acumulado, digito, indice) => acumulado + Number(digito) * (pesoInicial - indice), 0);
  const resto = (soma * 10) % 11;
  return resto === 10 ? 0 : resto;
}

export function cpfEhValido(valor: string): boolean {
  const cpf = somenteDigitos(valor);
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    return false;
  }
  const primeiroDigito = calcularDigitoVerificador(cpf.slice(0, 9), 10);
  const segundoDigito = calcularDigitoVerificador(cpf.slice(0, 10), 11);
  return primeiroDigito === Number(cpf[9]) && segundoDigito === Number(cpf[10]);
}

export function cpfValidator(): ValidatorFn {
  return (controle: AbstractControl): ValidationErrors | null => {
    if (!controle.value) {
      return null;
    }
    return cpfEhValido(controle.value) ? null : { cpfInvalido: true };
  };
}

export function cpfUnicoValidator(
  cpfJaCadastrado: (cpf: string) => boolean,
): ValidatorFn {
  return (controle: AbstractControl): ValidationErrors | null => {
    if (!controle.value || !cpfEhValido(controle.value)) {
      return null;
    }
    return cpfJaCadastrado(controle.value) ? { cpfDuplicado: true } : null;
  };
}
