import { DialogHeader } from "shared/dialogs/header/DialogHeader";

export class CancelProjectDialog{
    public email: string;
    public header: DialogHeader;
    public notAgreed: boolean;
    public message: string;
}

export class ProjectDialog {
    public id: number;
    public header: DialogHeader;
    public projectName: string;
    public projectType: string;
    public crewRoles: string[]
    public releaseYear: number;
    public budgetRange: string;
    public url: string;
    public city: string;
    public state: string;
    public showTitle: boolean;
    public productionCompany: string;
    public songTitle: string;
    public artistTitle: string;
    public episodTitle: string;
    public seriesTitle: string;

}

export class NewProjectRequest {
    public projectName: string;
    public projectType: string;
    public crewRoles: string[]
    public releaseYear: number;
    public budgetRange: string;
    public url: string;
    public productionCompany: string;
    public city: string;
    public state: string;
    public showTitle: boolean;
    public songTitle: string;
    public artistTitle: string;
    public episodTitle: string;
    public seriesTitle: string;
}

export class EditProjectRequest {
  public id: number;
  public projectName: string;
  public projectType: string;
  public crewRoles: string[]
  public releaseYear: number;
  public budgetRange: string;
  public url: string;
  public productionCompany: string;
  public city: string;
  public state: string;
  public showTitle: boolean;
  public songTitle: string;
  public artistTitle: string;
  public episodTitle: string;
  public seriesTitle: string;
}
