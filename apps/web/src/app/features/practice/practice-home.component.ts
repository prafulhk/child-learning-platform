import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-practice-home',
  standalone: true,
  templateUrl: './practice-home.component.html',
})
export class PracticeHomeComponent {
  @Output() startPractice = new EventEmitter<void>();

  onStartPractice(): void {
    this.startPractice.emit();
  }
}
