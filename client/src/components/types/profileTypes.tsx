export interface UserExperience {
  id?: number;                 // Present when editing existing experiences
  title: string;               // Job title
  company: string;             // Company name
  location: string;            // City or location
  type: string;                // Internship, Full-time, etc.
  startDate: string;           // ISO string (e.g., "2024-01-01")
  endDate: string;             // ISO string or "Present"
  current: boolean;            // Checkbox flag for "I currently work here"
  description: string;         // Textarea value (one bullet per line)
  bullets?: string[];          // Optional derived field for form submission
}
