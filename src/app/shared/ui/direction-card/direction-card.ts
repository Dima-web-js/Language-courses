import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-direction-card',
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './direction-card.html',
  styleUrl: './direction-card.scss',
})
export class DirectionCard {
  readonly icon = input.required<string>();
  readonly heading = input.required<string>();
  readonly description = input.required<string>();
  readonly example = input.required<string>();
}
