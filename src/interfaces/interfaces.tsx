export interface Project {
    id:             number;
    hasTag:         number[];
    topic:          number[];
    organizations:  Organization[];
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