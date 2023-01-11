export interface Location {
  latitude: number;
  longitude: number;
}

export interface User {
  userName: string;
  password: string;
}

export interface UserToken {
  idToken: string;
  serverAuthCode: string;
  scopes: Array<string>; // on iOS this is empty array if no additional scopes are defined
  user: UserInfo;
}
export interface UserInfo {
  id: string;
  email: string;
  familyName: string;
  givenName: string;
  name: string; // full name
  photo: string; // url
}

export interface Mark {
  id?: number;
  name: string;
  type: string;
  ask: string;
  description: string;
  coordinates?: number[];
}
export interface Project {
  projectName: string;
  description: string;
  photo?: string;
  marks: Mark[];
}
