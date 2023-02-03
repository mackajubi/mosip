export interface UserData {
    UserID?: number;
    UserRole?: string;
    FirstName: string;
    LastName: string;
    MiddleName?: string;
    FullName: string;
    Salutation: string;
    WorkEmail: string; 
    userRole?: string;
    image?: string;
    department?: string;
    section?: string;
    HCMPersonId?: number;
    EmployeeId?: number;
}

export interface ApiPayload {
    code: number;
    message: string;
    data: any;
    status: number;
}

export interface Process {
    state: boolean;
    data: any;
}

export interface ConfirmYesNo {
    comment?: string;
    password?: string;
    status: boolean;
}

export interface pdfParams {
    DocumentID: number;
    Filename: string; 
}

export interface Country {
    CountryID: number;
    CountryName: string;
    DialCode: string;
    Nationality: string;
}

export interface District {
    DistrictID: number;
    DistrictName: string;
}

export interface County {
    CountyID: number;
    CountyName: string;
}

export interface SubCounty {
    SubCountyID: number;
    SubCountyName: string;
}

export interface Parish {
    ParishID: number;
    ParishName: string;
}

export interface Village {
    VillageID: number;
    VillageName: string;
}

export interface HealthFacility {
    ID: number;
    Name: string;
}

export interface Occupation {
    OccupationID: number;
    Occupation: string;
}

export interface CauseOfDeath {
    ID: number;
    Cause: string;
    Code: string;
}

export interface Religion {
    ReligionID: number;
    ReligionName: string;
}

export interface Disability {
    DisabilityID: number;
    Disability: string;
}

export interface TypeOfMarriage {
    TypeOfMarriageID: number;
    TypeOfMarriageName: string;
}

export interface CitizenshipType {
    CitizenshipTypeID: number;
    CitizenshipTypeName: string;
}

export interface Speech {
    title: string;
    datePublished: Date;
    url: string;
    slug: string;
}

export interface Organisation {
    OrganisationID: number;
    OrganisationName: string;
    Office?: string;
    Location?: string;
    Person?: string;
}

export interface KeyServiceDocument {
    DocumentID: number;
    DocumentCode: string;
    Document: string;
}

export interface ROPForm3Category {
    ID: number;
    Name: string;
    Attachments: {
        Required: boolean;
        Name: string;
    } []
}

export interface ROPRequiredAttachment {
    Name: string;
    Required: boolean;
    File?: any;
}

export interface DocumentUpload {
    Filename: string; 
    Document: any, 
    Size: any
}

export interface NINDetail { 
    NIN: string; 
    Name: string, 
    IsValid: boolean, 
    DOB: string 
}

export interface PRN {
    PRN: number; 
    Amount: number;
    Currency: string;
    ExpiryDate: string;
    SearchCode?: string;
}