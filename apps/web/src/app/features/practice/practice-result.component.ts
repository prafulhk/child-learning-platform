import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PracticeAttempt } from '../../core/services/local-storage.service';

@Component({
  selector: 'app-practice-result',
  standalone: true,
  templateUrl: './practice-result.component.html',
})
export class PracticeResultComponent {
  @Input({ required: true }) attempt!: PracticeAttempt;
  @Output() restart = new EventEmitter<void>();

  onRestart(): void {
    this.restart.emit();
  }
}
