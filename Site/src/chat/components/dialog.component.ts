import { Component, ElementRef, OnDestroy, OnInit, ViewChild, NgZone } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ISubscription } from 'rxjs/Subscription';
import { ChatDialogService } from './dialog.service';
import { ChatDialog, ChatWindow, Data } from './models';
import { BaseDialogComponent } from 'shared/dialogs/BaseDialogComponent';
import { DialogHeader } from 'shared/dialogs/header/DialogHeader';
import { SignalRConnection, BroadcastEventListener, ConnectionStatus, ISignalRConnection } from '@dharapvj/ngx-signalr';
import { environment } from 'environments/environment';
import { ChatService } from './chat.service';
import { AuthService } from 'auth/auth.service';


import { Ng2DeviceService } from 'ng2-device-detector';

import { PushNotificationsService } from 'ng-push';
import { ChatConfig } from '../config';
import { IntercomProxyService } from 'shared/services/intercom-proxy.service';

@Component({
  selector: 'ij-chat-dialog',
  templateUrl: 'chat.component.html',
  styleUrls: ['style.less'],
  providers: [ChatService]
})
export class ChatDialogComponent extends BaseDialogComponent<ChatDialog> implements OnDestroy, OnInit {
  private isAlreadyCalled: boolean = false;
  public chatDialogVisible: boolean = false;
  private dialogSub: ISubscription;
  private headerSub: ISubscription;
  private contactSub: ISubscription;
  private _connection: SignalRConnection;
  private chatWindow: ChatWindow;
  public hideConnectionDiv: boolean = false;
  public isNetworkConnected: boolean = true;
  public isFromLocal: boolean = false;
  public iMobileDevice: boolean = false;
  public fileUploadError: string = '';
  public showMessenger: Boolean = false;

  mobileBrowser: boolean = this.detectMob();

  sendMessageSub: ISubscription;
  chatDialogSub: ISubscription;
  userTypingSub: ISubscription;
  userOfflineSub: ISubscription;
  userOnlineSub: ISubscription;
  hideChatSub: ISubscription;

  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date = null;
  date: string = new Date().toLocaleDateString();
  @ViewChild('scrollMe') private chatScrollContainer: ElementRef;
  constructor(
    el: ElementRef,
    private dialogSvc: ChatDialogService,
    private _chatService: ChatService,
    private deviceService: Ng2DeviceService,
    private _pushNotifications: PushNotificationsService,
    private authSvc: AuthService,
    private intercomSvc: IntercomProxyService,
    private zone: NgZone
  ) {

    super(ChatDialog, el, null);
    this.epicFunction();
    this.profileSysId = this.authSvc.profileSysId;

    this.dialogSub = this.dialogSvc.showDialog$.subscribe(data => {

      this._connection = data.connection;
      let whoisType$ = this._connection.listenFor('sayWhoIsTyping');
      whoisType$.subscribe((data: any) => {
        for (var i = 0; i < this.model.multipleChatWindows.length; i++) {
          this.model.multipleChatWindows[i].isTyping = true;
          break;
        }
        setTimeout(() => {
          this.model.isFromUserTyping = false;
          this.model.multipleChatWindows[i].isTyping = false;
        }, 1000);
      });

      this.buildModel();
    });

    this.chatDialogSub = this.dialogSvc.showToChatDialog$.subscribe((res: Data<ChatWindow>) => {
      this.profileSysId = this.authSvc.profileSysId;
      var result = res.data;
      this._connection = ChatConfig.BASE_CONNECTION;

      if (result) {
        this.chatWindow = res.data;
        for (let i = 0; i < this.model.multipleChatWindows.length; i++) {
          if (this.chatWindow.fromUserId == this.model.multipleChatWindows[i].fromUserId) {
            return;
          }
        }

        if (this.model.multipleChatWindows.length >= 0) {
          // if (this.model.multipleChatWindows.length > 2) {
          //   this.model.multipleChatWindows.splice(0, 1);
          //   this.model.multipleChatWindows.push(this.chatWindow);
          // }
          // else {
          //   this.model.multipleChatWindows.push(this.chatWindow);
          // }
          this.model.multipleChatWindows.push(this.chatWindow);

          this.chatWindow.progressLoader = true;

          this._connection.invoke('GetChat', this.chatWindow.toUserId, this.chatWindow.fromUserId)
            .then((data: any) => {
              this.dialogSvc.hideNotificationCount();
              let newMsgs = data.messages.reverse();
              this.chatWindow.messagesCount = data.count;
              this.chatWindow.chatMessages = newMsgs;
              console.log(newMsgs);
              this.chatWindow.progressLoader = false;
            }).catch(r => {
              this.chatWindow.progressLoader = false;
            })

          this.buildChatModel();
        }

        var isSoundEnable = true;
        this.playAudio();
        this.checkIfChatIsOpen();
        var newMessage = "";
        if (result.fromUser != undefined) {
          newMessage = "New Message From " + result.fromUser;
        }
        else {
          newMessage = "New Message From " + result.userName;

        }
        ///////////////////////////////////////////////////////////////
        //var updateNotificationCount = result.updateNotificationCount == undefined;


        // need to work on
        // for (let i = 0; i < this.model.multipleChatWindows.length; i++) {
        //   if (this.model.multipleChatWindows[i].fromLocalStorage != true) {
        //     if (result.toUserId == this.model.multipleChatWindows[i].toUserId) {
        //       if (this.profileSysId == model.toUserId) {
        //         isSoundEnable = this.model.multipleChatWindows[i].isMute;
        //         if (!isSoundEnable) {
        //           this.playAudio();
        //         }
        //       }
        //       if (result.fromUserId == this.model.multipleChatWindows[i].fromUserId && this.model.multipleChatWindows[i].hideChatBox == true) {
        //         if (result.updateNotificationCount == undefined && result.fromUser != undefined) {

        //           this.model.multipleChatWindows[i].unreadMessageCount =
        //             this.model.multipleChatWindows[i].unreadMessageCount + 1;
        //           this._connection.invoke('AddNotifications',
        //             result.toUserId,
        //             result.fromUserId,
        //             model.messageId,
        //             newMessage);

        //         }

        //       }

        //     }
        //     //else {
        //     //  this.model.multipleChatWindows[i].hideChatBox = false;
        //     //  this.model.multipleChatWindows[i].unreadMessageCount = 0;
        //     //}

        //   }
        //   else {
        //     this.model.multipleChatWindows[i].fromLocalStorage = false;
        //   }
        // }
        //this.model.windowFileProgressId = '';

        // need to work on

        //////////////////////////////////////////////////////////////////////////
        // if (this.chatWindow.chatMessages.length > 0) {
        //   let index = this.chatWindow.chatMessages.map((el) => el.messageId).indexOf(model.messageId)
        //   if (index == -1) {
        //     this.chatWindow.chatMessages.push(model);

        //     //Show DN
        //     console.log("Value in show chat dialog step 2 " + this.authSvc.isOnIJSite)

        //     if (this.authSvc.isOnIJSite == 'false') {
        //       this._pushNotifications.create('New messae from ' + model.userName,
        //         {
        //           body: model.message
        //           , icon: '/assets/images/ij.png'
        //         }).subscribe(
        //           res => console.log(res),
        //           err => console.log(err)
        //         )
        //     }
        //   }
        //   for (let i = 0; i < this.model.multipleChatWindows.length; i++) {
        //     if (model.fromUserId == this.model.multipleChatWindows[i].fromUserId) {
        //       this.model.multipleChatWindows[i].progressLoader = false;
        //       break;
        //     }
        //   }
        // }

        // if (this.isFromLocal == false) {

        //   localStorage.setItem("chatWindows", JSON.stringify(this.model.multipleChatWindows));
        // }
        // else {
        //   localStorage.removeItem("chatWindows");
        //   localStorage.setItem("chatWindows", JSON.stringify(this.model.multipleChatWindows));
        // }
        // this.isAlreadyCalled = true;
      }
    });

    this.userTypingSub = this.dialogSvc.showUserTyping$.subscribe(res => {
      for (var i = 0; i < this.model.multipleChatWindows.length; i++) {
        if (this.model.multipleChatWindows[i].fromUserId == res.data.fromId && this.profileSysId == res.data.toId) {
          this.model.multipleChatWindows[i].isTyping = true;
          this.model.multipleChatWindows[i].typingInProgress = true;
          setTimeout(() => {
            this.model.isFromUserTyping = false;
            this.model.multipleChatWindows[i].isTyping = false;
            this.model.multipleChatWindows[i].typingInProgress = false;
          }, 3000);
          break;
        }
      }
    });

    this.userOnlineSub = this.dialogSvc.userOnline$.subscribe(userId => {
      for (var i = 0; i < this.model.multipleChatWindows.length; i++) {
        if (userId == this.model.multipleChatWindows[i].fromUserId) {
          this.model.multipleChatWindows[i].isOnline = true;
        }
      }
    });

    this.userOfflineSub = this.dialogSvc.userOffline$.subscribe(userId => {
      for (var i = 0; i < this.model.multipleChatWindows.length; i++) {
        if (userId == this.model.multipleChatWindows[i].fromUserId) {
          this.model.multipleChatWindows[i].isOnline = false;
        }
      }
    });

    this.hideChatSub = this.dialogSvc.hideToChatDialog$.subscribe(res => {
      this.hideChatDialog();
    });

    this.sendMessageSub = this.dialogSvc.sendMessage$.subscribe(data => {
      let chatWindowOpen = false;
      this.model.multipleChatWindows.forEach(chatWindow => {
        // add message to sender chat window
        if (chatWindow.fromUserId == data.toUserId && this.profileSysId == data.fromUserId) {
          chatWindow.chatMessages.push(data);
          chatWindowOpen = true;
        }
        // add message to receiver chat window
        if (chatWindow.fromUserId == data.fromUserId && this.profileSysId == data.toUserId) {
          chatWindow.typingInProgress = false;
          chatWindow.isTyping = false;
          chatWindow.chatMessages.push(data);
          chatWindowOpen = true;
          this.playAudio();

          if (chatWindow.hideChatBox) {
            chatWindow.unreadMessageCount++;
          }
        }
      });

      //Chat Window is closed for receiver
      if (!chatWindowOpen) {
        if (!this._connection) {
          this._connection = ChatConfig.BASE_CONNECTION;
        }
        this._connection.invoke('BuildReceiverChatWindow', data.toUserId, data.fromUserId, data.messageId);
      }
    });
  }

  setScrollPosition(scrollPosition): void {
    this.chatScrollContainer.nativeElement.scrollTop = 500;
  }

  hideChatDialog() {
    this.dialogVisible = false;
    this.chatDialogVisible = false;
  }

  showChatDialog() {
    setTimeout(() => {
      if (this.focusable && this.focusable.nativeElement) {
        this.focusable.nativeElement.focus();
      }
    }, 0);

    if (this.ngForm) {
      this.ngForm.resetForm();
    }

    this.dialogVisible = true;

    this.chatDialogVisible = true;

  }

  epicFunction() {
    var deviceinfo = this.deviceService.getDeviceInfo();
    if (deviceinfo.userAgent.includes("Mobile")) {
      this.iMobileDevice = true
    }
  }

  checkValue() {
    if (this.isAlreadyCalled == true) {
      this.isAlreadyCalled = false;
    }
  }

  ngOnDestroy() {
    if (this.dialogSub) {
      this.dialogSub.unsubscribe();
    }

    if (this.headerSub) {
      this.headerSub.unsubscribe();
    }

    if (this.contactSub) {
      this.contactSub.unsubscribe();
    }

    if (this.chatDialogSub) {
      this.chatDialogSub.unsubscribe();
    }

    if (this.userTypingSub) {
      this.userTypingSub.unsubscribe();
    }

    if (this.userOfflineSub) {
      this.userOfflineSub.unsubscribe();
    }

    if (this.userOnlineSub) {
      this.userOnlineSub.unsubscribe();
    }

    if (this.hideChatSub) {
      this.hideChatSub.unsubscribe();
    }

    if (this.sendMessageSub) {
      this.sendMessageSub.unsubscribe();
    }
  }

  ngOnInit() {

    // setInterval(() => {
    //   this.checkOnline();
    // }, 1000);
    // this.model.multipleChatWindows.splice(0, 1);

  }

  ngAfterViewInit() {

  }

  protected onSendchat(chat) {
    var myProfileId = localStorage.getItem(environment.storage.auth.profileSysId);
    this._connection.invoke('sendMessage', chat.fromUserId, chat.message, myProfileId)
      .then(r => {
        chat.message = '';
      });
  }

  protected closeChatWindow(chatDialogUserId: string) {
    for (let i = 0; i < this.model.multipleChatWindows.length; i++) {
      if (chatDialogUserId == this.model.multipleChatWindows[i].fromUserId) {
        this.model.multipleChatWindows.splice(i, 1);
        break;
      }
    }
    this.checkIfChatIsOpen();
  }

  protected fileChangeEvent(fileInput: any, toUserId: any) {

    var myProfileId = localStorage.getItem(environment.storage.auth.profileSysId);
    let fileList: FileList = fileInput.target.files;
    if (this.model.isNetworkConnected && fileList.length > 0) {

      let file: File = fileList[0];
      let formData: FormData = new FormData();
      formData.append('uploadFile', file, file.name);

      let windowId;
      for (let i = 0; i < this.model.multipleChatWindows.length; i++) {
        if (toUserId == this.model.multipleChatWindows[i].fromUserId) {
          this.model.multipleChatWindows[i].progressLoader = true;
          windowId = i;
          break;
        }
      }

      if (file.type == 'application/pdf') {
        if (file.size >= 10500000) {
          this.model.multipleChatWindows[windowId].invalidFile = true;
          this.model.multipleChatWindows[windowId].progressLoader = false;
          this.fileUploadError = 'File size should be less than 10mb';
          setTimeout(() => {
            this.model.multipleChatWindows[windowId].invalidFile = false;
          }, 3000);

        }
        else {
          const url = environment.endpoints.chat.uploadPDFFiles(toUserId);
          this.model.windowFileProgressId = toUserId;
          this._chatService.uploadFiles(url, formData).subscribe(
            data => {

              if (data.success) {

                this._connection.invoke('Uploadfiles', data.result.fileName, file.name, toUserId, myProfileId);
              }
              else {
                this.model.multipleChatWindows[windowId].invalidFile = true;
                this.model.multipleChatWindows[windowId].progressLoader = false;
                this.fileUploadError = data.result.errors[0];
                setTimeout(() => {
                  this.model.multipleChatWindows[windowId].invalidFile = false;
                }, 3000);
              }

            });
        }

      }

      else if (file.type == 'image/jpg' || file.type == 'image/png' || file.type == 'image/jpeg') {
        this.model.uploadFileProgress = true;
        this.model.windowFileProgressId = toUserId;
        const url = environment.endpoints.chat.uploadImageFiles(toUserId);
        this._chatService.uploadFiles(url, formData).subscribe(
          data => {
            if (data.success) {
              this._connection.invoke('Uploadfiles', data.result.profileImageName, file.name, toUserId, myProfileId);
            }
            else {
              this.model.multipleChatWindows[windowId].invalidFile = true;
              this.model.multipleChatWindows[windowId].progressLoader = false;
              //this.fileUploadError = 'please retry...something went wrong';
              this.fileUploadError = data.result.errors[0];
              setTimeout(() => {
                this.model.multipleChatWindows[windowId].invalidFile = false;
              }, 3000);
            }


          });
      }
      else if (file.type == "application/msword" || file.type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        if (file.size >= 10500000) {


          this.model.multipleChatWindows[windowId].invalidFile = true;
          this.model.multipleChatWindows[windowId].progressLoader = false;
          this.fileUploadError = 'File size should be less than 10mb';
          setTimeout(() => {
            this.model.multipleChatWindows[windowId].invalidFile = false;
          }, 3000);

        }
        else {
          this.model.uploadFileProgress = true;
          this.model.windowFileProgressId = toUserId;
          const url = environment.endpoints.chat.uploadDocFiles(toUserId);

          this._chatService.uploadFiles(url, formData).subscribe(
            data => {


              if (data.success) {

                this._connection.invoke('Uploadfiles', data.result.fileName, file.name, toUserId, myProfileId);
              }
              else {
                this.model.multipleChatWindows[windowId].invalidFile = true;
                this.model.multipleChatWindows[windowId].progressLoader = false;
                this.fileUploadError = data.result.errors[0];
                setTimeout(() => {
                  this.model.multipleChatWindows[windowId].invalidFile = false;
                }, 3000);

              }

            });
        }
      }
      else {


        this.model.multipleChatWindows[windowId].invalidFile = true;
        this.fileUploadError = 'Invalid File! please choose pdf/doc/images-jpg/png';
        this.model.multipleChatWindows[windowId].progressLoader = false;
        setTimeout(() => {
          this.model.multipleChatWindows[windowId].invalidFile = false;
        }, 3000);

      }

    }
  }

  onScrollUp(chatWindow: ChatWindow, chatContainer) {
    let fromUserId = chatWindow.fromUserId;
    let toUserId = chatWindow.toUserId;
    let messagesCount = chatWindow.chatMessages.length;
    this._connection.invoke('GetMoreChat', toUserId, fromUserId, messagesCount)
      .then((data: any) => {
        let newMessages = data;
        chatWindow.scrollOffset = chatContainer.scrollHeight - chatContainer.scrollTop;
        console.log(newMessages);
        newMessages.forEach(message => {
          let scrollPosition = this.chatScrollContainer.nativeElement.scrollHeight;
          chatWindow.chatMessages.unshift(message);
        });
        setTimeout(() => {
          chatContainer.scrollTop = chatContainer.scrollHeight - chatWindow.scrollOffset;
        });
        chatWindow.progressLoader = false;
      }).catch(r => {
        chatWindow.progressLoader = false;
      });
  }

  getProfileImageUrl(imgName: string) {
    if (imgName) {
      return environment.site.imageUrl(imgName);
    }
    else {
      return '../assets/images/avatars/avatar-lg.png';
    }
  }

  protected showMoreChat(toUserId: string, fromUserId: string) {




  }

  protected showhideSettingBox(chatDialogUserId: string) {

    for (let i = 0; i < this.model.multipleChatWindows.length; i++) {
      if (chatDialogUserId == this.model.multipleChatWindows[i].fromUserId) {
        if (this.model.multipleChatWindows[i].hideSettingBox == false) {
          this.model.multipleChatWindows[i].hideSettingBox = true;
          // this._connection.invoke('MiniMizeChat', chatDialogUserId, this.myUserId);
        }
        else {
          this.model.multipleChatWindows[i].hideSettingBox = false;
        }
        break;
      }
    }

  }

  protected ChangeSenderNotification(toUserId: string, isMute: boolean, isAllow: boolean, isBlock: boolean) {

    if (isMute == undefined)
      isMute = false;

    if (isAllow == undefined)
      isAllow = false;

    if (isBlock == undefined)
      isBlock = false;

    this._connection.invoke('AllowRecieverEmailNotifications', toUserId, this.profileSysId, isMute, isAllow, isBlock)
      .then((data: any) => {
        this.model.SuccessNotification = true;
        this.model.userNotificationSuccess = true;
        setTimeout(() => {
          this.model.SuccessNotification = false;
          this.model.userNotificationSuccess = false;
        }, 2000);

      })
  }

  protected minimizeChatBox(chatWindow: ChatWindow) {
    chatWindow.hideChatBox = !chatWindow.hideChatBox;
    if (!chatWindow.hideChatBox) {
      chatWindow.unreadMessageCount = 0;
    }
    this.checkIfChatIsOpen();
  }

  private checkIfChatIsOpen() {
    this.model.multipleChatWindows.every(this.IsChatOpenFunCallback);
  }

  private IsChatOpenFunCallback = (chatWindow: ChatWindow) => {
    if (!chatWindow.hideChatBox) {
      this.model.chatIsActive = true;
      if (this.mobileBrowser)
        this.intercomSvc.hideLaucher();
      return false;
    }
    else {
      this.model.chatIsActive = false;
      this.intercomSvc.showLaucher();
      return true;
    }
  }

  protected showTyping(chatWindow: ChatWindow) {
    if (chatWindow.message && !chatWindow.typingInProgress) {
      chatWindow.typingInProgress = true;
      this._connection.invoke('IsTyping', chatWindow.fromUserId, this.profileSysId);
      setTimeout(() => {
        chatWindow.typingInProgress = false;
      }, 3000);
    }
  }

  protected checkOnline() {

    if (navigator.onLine) {
      if (!this.isNetworkConnected) {
        this.isNetworkConnected = true;
        for (var i = 0; i < this.model.multipleChatWindows.length; i++) {
          //var id = this.multipleChatWindows[i].chatUserId;
          this.model.multipleChatWindows[i].isUserOnline = "online";
          this.model.multipleChatWindows[i].isNetworkConnected = true;
          //this.model.multipleChatWindows[i].progressLoader = true;
        }
        setTimeout(() => {
          this.model.hideConnectionDiv = false;
        }, 1000);
      }
      else {
        this.model.hideConnectionDiv = false;
      }
    }
    else {

      this.model.hideConnectionDiv = true;
      for (var i = 0; i < this.model.multipleChatWindows.length; i++) {
        this.model.multipleChatWindows[i].isUserOnline = "offline";
        this.model.multipleChatWindows[i].isNetworkConnected = false;;

      }

      this.isNetworkConnected = false;

    }
    if (window.screen.availWidth <= 770) {
      let elem1: HTMLElement = document.getElementById("chatBody");

      if (this.showMessenger == false && elem1 != null) {
        let elem: HTMLElement = document.getElementById("intercom-container");
        elem.style.display = "none";
      }

    }
    else {
      let elem: HTMLElement = document.getElementById("intercom-container");
      if (elem) {
        elem.style.display = "Block";
      }
    }
  }



  private playAudio() {
    let audio = new Audio();
    audio.src = "../../assets/sounds/chat/suck_pop_message.mp3";
    audio.load();
    audio.play();
  }

  protected showhideMobileChat(chatWindow: any) {
    let index = this.model.multipleChatWindows.map((el) => el.fromUserId).indexOf(chatWindow.fromUserId)

    for (let i = 0; i < this.model.multipleChatWindows.length; i++) {
      this.model.multipleChatWindows[i].isMobileView = false;
    }

    for (let i = 0; i < this.model.multipleChatWindows.length; i++) {
      if (chatWindow.fromUserId != this.model.multipleChatWindows[i].fromUserId) {
        this.model.multipleChatWindows[i].isMobileView = true;
      }
    }
  }

  private buildModel() {
    this.showChatDialog();
  }

  private buildChatModel() {

    this.showChatDialog();
  }

  private detectMob() {
    if (navigator.userAgent.match(/Android/i)
      || navigator.userAgent.match(/webOS/i)
      || navigator.userAgent.match(/iPhone/i)
      || navigator.userAgent.match(/iPad/i)
      || navigator.userAgent.match(/iPod/i)
      || navigator.userAgent.match(/BlackBerry/i)
      || navigator.userAgent.match(/Windows Phone/i)
    ) {
      return true;
    }
    else {
      return false;
    }
  }
}
