import { environment } from "environments/environment";

export class ChatDialog {
  public chatMessages: any = [];
  public myUserId: any;
  public showChatDailog: boolean = false;
  public chatDialogUserName: any = '';
  public chatDialogUserId: any;
  public message: any;
  public hideChatBox: boolean = false;
  public chatIsActive: boolean = false;
  public multipleChatWindows: ChatWindow[] = [];
  public isNetworkConnected: boolean = true;
  public hideConnectionDiv: boolean = false;
  public showOnlineUser: boolean = false;
  public miniMIzeChatUser: boolean = false;
  public isFromUserTyping: boolean = false;
  public totalMessages: number;
  public toTypingId: any;
  public infiniteScorllStatus: boolean = false;
  public files: any;
  public pageNumber: number = 1;
  public busy: boolean = false;
  public ImageStorageUrl = "https://ijdevstorage.blob.core.windows.net/images/";
  public PdfStorageUrl = "https://ijdevstorage.blob.core.windows.net/pdfs/";
  public WordFileStorage = "https://ijdevstorage.blob.core.windows.net/attachments/"
  public SuccessNotification: boolean = false;
  public MessageNotify: any;
  public uploadFileProgress: boolean = false;
  public fileSizeIfLarge: boolean = false;
  public userNotificationSuccess: boolean = false;
  public windowFileProgressId: any = '';
  public chatWindowsStorage: any = [];
  public loadingChatMessges: boolean = false;
  public unreadMessageCount: number = 0;
  public imageNotSupported: boolean = false;
}



/////
export class ChatWindow {
  userName: string;
  fromUserId: string;
  isBlock: boolean;
  isAllow: boolean;
  isMute: boolean;
  toUserId: string;
  profilePath: string;
  chatMessages: ChatMessages[] = [];
  hideChatBox: boolean = false;
  showChatDailog: boolean;
  location: string;
  roles: string;
  industryScore: number;
  isUserOnline: string;
  unreadMessageCount: number = 0;
  hideSettingBox: boolean;
  isNetworkConnected: boolean;
  progressLoader: boolean = false;
  isTyping: boolean = false;
  isMobileView: boolean;
  profileThumbnailImageName: string;
  setting: ChatSetting;
  profilePic: string;
  isOnline: boolean;
  messagesCount: number;
  scrollOffset: number;
  constructor() {

  }

  invalidFile: boolean;
  fromLocalStorage: boolean;
  fromUser: string;
  profileName: string;
  message: string;
  messageId: number;
  msgSendTime: Date;
  messageType: string;
  msgFromMyId: string;
  typingInProgress: boolean;
}

export class ChatMessages {
  fromUserId: string;
  toUserId: string;
  message: string;
  fileName: string;
  msgSendTime: Date;
  isRead: boolean;
  messageType: string;
  isBlock: boolean;
  msgFromMyId: string;
  profileSysId: string;
  messageId: number;
  createDate: string;
  createdOn: Date;
}

export class ChatSetting {
  isAllow: boolean;
  isBlock: boolean;
  isMute: boolean;
}


export class Data<Data> {
  public readonly data: Data;
  constructor(data: Data) {
    this.data = data;
    // this.connection = connection;
  }
}