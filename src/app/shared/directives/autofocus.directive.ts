import { AfterViewInit, Directive, ElementRef, inject } from '@angular/core';

@Directive({
  selector: '[spmAutofocus]',
  standalone: true
})
export class AutofocusDirective implements AfterViewInit {
  private readonly elementRef = inject<ElementRef<HTMLInputElement>>(ElementRef);

  ngAfterViewInit(): void {
    queueMicrotask(() => this.elementRef.nativeElement.focus());
  }
}
