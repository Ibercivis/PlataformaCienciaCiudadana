export interface Project {
    id:             number;
    hasTag:         number[];
    topic:          number[];
    organizations:  number[];
    creator:        number;
    administrators: any[];
    created_at:     Date;
    updated_at:     Date;
    name:           string;
    description:    string;
}

export interface Organization {
    id:             number;
    type:           Type[];
    creator:        Creator;
    administrators: any[];
    members:        any[];
    principalName:  string;
    url:            string;
    description:    string;
    contactName:    string;
    contactMail:    string;
    logo:           string;
    creditLogo:     string;
}

export interface Type {
    id:   number;
    type: string;
}

export interface Creator {
    id:       number;
    username: string;
}

export interface User {
    pk:         number;
    username:   string;
    email:      string;
    first_name: string;
    last_name:  string;
}

export interface Question {
    id?:            number;
    question_text: string;
    answer_type:   string;
}

export interface UserInfo {
    id:       number;
    username: string;
    profile:  Profile;
}

export interface Profile {
    biography:             string;
    visibility:            boolean;
    country:               string;
    participated_projects: any[];
    created_projects:      CreatedProject[];
    liked_projects:        any[];
}

export interface CreatedProject {
    id:          number;
    name:        string;
    description: string;
}