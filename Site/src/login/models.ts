export class SocialUser {
    public id: string;
    public firstName: string;
    public lastName: string;
    public email: string;
    public city: string;
    public state: string;
    public gender: string;
    public profileImageName: string;
    public loginProvider: string;
    public imageUrl: string;
    public userExists: boolean;
    public location: LocationDetail
    public socialUserId: number;
    capitalize = function (value: string): string {
        if (value)
            return value.charAt(0).toUpperCase() + value.slice(1);
        else
            return "";
    }
}

export class ConfirmAccount {
    public userId: string;
    public code: string
}

class LocationDetail {
    public city: string;
    public state: string;
}