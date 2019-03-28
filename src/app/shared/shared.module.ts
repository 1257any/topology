import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { Le5leComponentsModule } from 'le5le-components';

import { HtmlPipe } from './pipes/html.pipe';

@NgModule({
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule, Le5leComponentsModule],
  declarations: [HtmlPipe],
  exports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule, Le5leComponentsModule, HtmlPipe],
  providers: []
})
export class SharedModule {}
