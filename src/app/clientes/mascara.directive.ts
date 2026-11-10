import { Directive, ElementRef, HostListener, inject, input } from '@angular/core';
import { NgControl } from '@angular/forms';
import { aplicarMascara, TipoMascara } from './formatadores';

@Directive({
  selector: '[mascara]',
})
export class MascaraDirective {
  readonly mascara = input.required<TipoMascara>();

  private readonly controle = inject(NgControl);
  private readonly elemento = inject<ElementRef<HTMLInputElement>>(ElementRef);

  @HostListener('input')
  aoDigitar(): void {
    const campo = this.elemento.nativeElement;
    const valorFormatado = aplicarMascara(this.mascara(), campo.value);
    campo.value = valorFormatado;
    this.controle.control?.setValue(valorFormatado, { emitEvent: false });
  }
}
