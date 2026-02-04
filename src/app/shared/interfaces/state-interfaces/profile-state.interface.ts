import { ProfileModel } from '../profile.model';

export interface ProfileState {
  profile: ProfileModel | null;
  loading: boolean;
  error: string | null;
}
