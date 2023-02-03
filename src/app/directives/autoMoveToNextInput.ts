import { Directive, HostListener, Input } from '@angular/core';

@Directive({
selector: '[appMoveToNextInput]'
})
export class AutoMoveToNextInputDirective {

  @Input() NextInputId: string;

  constructor() {}

  @HostListener('input', ['$event.target.value']) onKeyDown(eventValue: string) {    

    if (eventValue) {

      document.getElementById(this.NextInputId).focus();

    }

  }

}
