export interface Spouse {
    Surname: string;
    GivenName: string;
    OtherName?: string;
    MaidenName?: string;
    PreviousName?: string;
    NIN?: string;
    NINCardNumber?: string;
    ApplicationID?: string;
    CitizenshipType: number;
    CitizenshipTypeName?: string;
    CitizenshipCertificateNumber: string;
    OtherCitizenship?: string;
    PlaceOfMarriage: string;
    DateOfMarriage: Date;
    TypeOfMarriage: number;
    TypeOfMarriageName?: string;
}

export interface Child {
    ApplicationID?: string;
    Surname: string;
    GivenName: string;
    OtherName?: string;
    MaidenName?: string;
    PreviousName?: string;
    Sex: string;
    DateOfBirth: Date;
    PlaceOfBirth: string;
}

export interface NotificationOfChange {
    Field?: string;
    Previous: string;
    New: string;
}

export interface BirthNotificationRecord {
    NotificationNumber: string;
    ChildSurname: string;
    ChildGivenName: string;
    ChildOtherName: string;
    ChildDateOfBirth: Date;
    ChildSex: string;
    ChildDistrict: string;
    ChildSubcounty: string;
    ChildParish: string;
    ChildVillage: string;
    MotherSurname: string;
    MotherGivenName: string;
    MotherOtherName: string;
    MotherNationality: string;
    MotherNINAIN: string;
    FatherSurname: string;
    FatherGivenName: string;
    FatherOtherName: string;
    FatherNationality: string;
    FatherNINAIN: string;
    RecordedOn: Date;
}

export interface DataCategory {
    Id?: number;
    Name: string;
}