import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-parent-tools',
  standalone: true,
  templateUrl: './parent-tools.component.html',
})
export class ParentToolsComponent {
  @Output() openQuestionBank = new EventEmitter<void>();
  @Output() backToHome = new EventEmitter<void>();

  onOpenQuestionBank(): void {
    this.openQuestionBank.emit();
  }

  onBackToHome(): void {
    this.backToHome.emit();
  }
}
