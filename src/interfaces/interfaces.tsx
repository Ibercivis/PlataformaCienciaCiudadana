export interface Project {
    id:             number;
    creator:        number;
    administrators: number[];
    name:           string;
    description:    string;
    topic:          number[];
    hasTag:         number[];
    organizations_write:  number[];
    field_form:     FieldForm;
    cover?:         string[];
    is_private?:  boolean;
    raw_password?:  string;
}

export interface ShowProject {
    id:             number;
    hasTag:         number[];
    topic:          number[];
    organizations:  number[];
    creator:        number;
    administrators: number[];
    created_at?:    Date;
    updated_at?:    Date;
    name:           string;
    description:    string;
    field_form:     FieldForm;
    is_private?:    boolean;
    is_liked_by_user?: boolean;
    total_likes?:   number;
    contributions?: number;
    cover?:         string[];
}

export interface FieldForm {
    questions: Question[];
}

export interface Organization {
    id:             number;
    type:           Type[];
    creator:        Creator;
    administrators: number[];
    members:        number[];
    principalName:  string;
    url:            string;
    description:    string;
    contactName:    string;
    contactMail:    string;
    logo:           string;
    cover:          string;
}
export interface NewOrganization {
    type:           number[];
    creator:        number;
    administrators: number[];
    members:        number[];
    principalName:  string;
    url:            string;
    description:    string;
    contactName:    string;
    contactMail:    string;
    logo:           any;
    cover:          any;
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
    question_text:  string;
    answer_type:    string;
    mandatory?:     boolean;
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