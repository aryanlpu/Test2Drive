import { DialogHeader } from "shared/dialogs/header/DialogHeader";

export class MutualCancellationDialog{
    email: string;
    header: DialogHeader;
    cancelOption?: number;
    message: string;
    isMutual: boolean;
    hireId: number;
}