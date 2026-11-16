import { LandingHeader } from '../../widgets/landing-header/landing-header';
import { LandingFooter } from '../../widgets/landing-footer/landing-footer';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TeacherHero } from '../../widgets/teacher-hero/teacher-hero';
import { TeacherAbout } from '../../widgets/teacher-about/teacher-about';
import { LearningDirections } from '../../widgets/learning-directions/learning-directions';
import { LearningFaq } from '../../widgets/learning-faq/learning-faq';
import { TeacherContacts } from '../../widgets/teacher-contacts/teacher-contacts';
import { TeacherReviews } from '../../widgets/teacher-reviews/teacher-reviews';


@Component({
  selector: 'app-landing-page',
  imports: [LandingHeader, LandingFooter, 
    MatButtonModule, 
    MatIconModule, 
    TeacherHero, 
    TeacherAbout,
    // LearningApproach, 
    LearningDirections, 
    LearningFaq, 
    TeacherContacts,
    TeacherReviews
    
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.scss',
})
export class LandingPage {
}
