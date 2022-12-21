export interface Location {
  latitude: number;
  longitude: number;
}

export interface User {
  userName: string;
  password: string;
}

export interface Mark {
  id?: number;
  name: string;
  type: string;
  ask: string;
  description: string;
  coordinates?: number [];
}
export interface Project {
  projectName: string;
  description: string;
  photo?: string;
  marks: Mark[];
}
