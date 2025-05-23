export interface UserExperience {
  id?: number; // optional for new entries, required for edits
  title: string;
  company: string;
  location: string;
  type: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}
