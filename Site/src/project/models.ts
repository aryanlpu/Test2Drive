
export class HireHistory {
    count: number;
    items: HireHistoryItem[];
    showOffers: boolean;
    showAcceptedJobs: boolean;
    showPreviousJobs: boolean;
    showCancelledJobs: boolean;

}

export class HireHistoryRequest {
    page: number;
    jobType: JobTypes;
}

interface HireHistoryItem {
    profileSysId: string,
    hiredProfileImageUrl: string,
    hireByProfileImageUrl: string,
    fullName: string,
    hiredProfileName: string,
    hiredByProfileName: string,
    projectName: string,
    crewRoles: string,
    createdDate: string,
    createdOn: Date,
    id: number,
    projectType: ProjectTypes,
    status: HireStatusTypes,
    denyBy:string,
   acceptedBy :string,
   hireByProfileSysId:string;
   hiredProfileSysId:string;
   NegoBy:string
}

export class CancelProjectRequest {
    constructor(
        hireId: number,
        message: string,
        cancelledOption: number,
        isMutual: boolean
    ) { }
}

export enum JobTypes {
    All = 1,
    Offers = 2,
    Accepted = 3,
    Previous = 4,
    Cancelled = 5,
    Hired=6
}

export enum ProjectTypes {
    Commercial = 1,
    MusicVideo = 2,
    FeatureFilm = 3,
    TelevisionShow = 4,
    NewMedia = 5,
    WebSeries = 6,
    ShortFilm = 7
}

export enum HireStatusTypes {
    Offer = 1,
    Accepted = 2,
    Denied = 3,
    Completed = 4,
    Cancelled = 5
}

export enum CancelOptionTypes{
    Cancel = 1,
    Mutual = 2
}