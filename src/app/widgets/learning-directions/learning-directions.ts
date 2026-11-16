import { LEARNING_DIRECTIONS } from '../../shared/model/learning-directions';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DirectionCard } from '../../shared/ui/direction-card/direction-card';
@Component({
  selector: 'app-learning-directions',
  imports: [DirectionCard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './learning-directions.html',
  styleUrl: './learning-directions.scss',
})
export class LearningDirections {
  readonly directions = LEARNING_DIRECTIONS;
}
