import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderDirective } from '@app/directives/loader/loader.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [LoaderDirective],
  exports: [LoaderDirective]
})
export class LoaderModule {}
