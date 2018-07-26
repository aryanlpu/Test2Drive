export const environment = {
  siteDescription: "Industry Jump is an online marketplace that converts the existing referral driven industry.",
  siteTitle: "Welcome to Industry Jump",

  siteApiUrl: null,
  siteUrl: null,
  siteImage: null,
  imageStorageUrl: null,
  pdfStorageUrl: null,
  intercomKey: null,
  production: null,
  maintenance: false,
  storage: {
    auth: {
      accessToken: "access_token",
      profileSysId: "profileSysId",
      thumbnailImageName: "thumbnailImageName",
      loginWithIJ: "loginWithIJ",
      refreshtoken: "refresh_token",
      userName: "username",
      isOnIJSite: "isOnIJSite",
      currentProfileSysId: "currentProfileSysId",
      fullName: "fullname",
      userPositionInList: "userPositionInList"/* newly added to get the user position in the list start */
    },

    chat: {
      toChatUserId: "toChatUserId",
      fromChatUserId: "fromChatUserId",
      toChatWindow: "toChatWindow",
      fromChatWindow: "fromChatWindow"
    },

    signalR: {
      connection: "connection",
      connectionId: "connectionId"
    }
  },

  site: {
    get url() {
      return environment.siteUrl;
    },

    get api() {
      return environment.siteApiUrl;
    },

    get login() {
      return `${environment.siteUrl}/login`;
    },

    profile(id: string) {
      return `${environment.siteUrl}/profile/${id}`;
    },

    overview(profileSysId: string) {
      if (profileSysId) {
        return `/profile/${profileSysId}/overview`;
      }
      return null;
    },
    //newly added property to combine firstnamelastname + userPosition in list starts
    profileUrl(fullName: string, userPositionInList: string) {
      if (fullName) {
        fullName = (fullName.split(' ').join('') + userPositionInList).replace(/^\s+|\s+$/gm,'');
        return `/profile/${fullName}`;
      }
      return null;
    },
    //newly added property to combine firstnamelastname ends
    pdfViewerUrl(url: string) {
      return `https://docs.google.com/viewer?url=${url}&embedded=true`;
    },

    imageUrl(file: string) {
      return `${environment.imageStorageUrl}/${file}`
    },

    pdfUrl(file: string) {
      return `${environment.pdfStorageUrl}/${file}`
    },

    video: {
      youTubeVideo(id: string) {
        return `https://www.youtube.com/watch?v=${id}`;
      },

      youTubeThumbnail(id: string) {
        return `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
      },

      vimeoVideo(id: string) {
        return `https://player.vimeo.com/video/${id}`;
      }
    },
  },

  endpoints: {
    auth: {
      get url() {
        return `${environment.siteApiUrl}/oauth/token`;
      },

      forgotPassword(email: string) {
        return `${environment.siteApiUrl}/v1/account/forgot-password?email=${email}`;
      },

      resendMail(email: string) {
        return `${environment.siteApiUrl}/v1/account/resend-mail?email=${email}`;
      },

      externalLogin(provider: string) {
        const redirect_uri = encodeURIComponent(environment.siteApiUrl + '/');
        return `${environment.siteApiUrl}/v1/account/externallogin?provider=${provider}&response_type=token&client_id=self&redirect_uri=${redirect_uri}authComplete.html&state=WcsuiD-NY5tD7UcuceREmRgP1cHdw3zhb42iPx0b6sI1`;
      },

      get siteApiUrl() {
        return environment.siteApiUrl;
      },

      get userInfo() {
        return `${environment.siteApiUrl}/v1/account/userinfo`;
      },

      get resetPassword() {
        return `${environment.siteApiUrl}/v1/account/reset-password`;
      },

      get confirmEmail() {
        return `${environment.siteApiUrl}/v1/account/confirm-email`;
      }
    },

    address: {
      get authId() {
        return `26719530941501989`;
      },

      get zipCode() {
        return `https://us-zipcode.api.smartystreets.com/lookup`;
      }
    },

    upload: {
      get profileImage() {
        return `${environment.siteApiUrl}/v1/upload/profile-image`
      },

      get gear() {
        return `${environment.siteApiUrl}/v1/upload/gear`
      },
      get w9() {
        return `${environment.siteApiUrl}/v1/upload/w9`
      },
      get resume() {
        return `${environment.siteApiUrl}/v1/upload/resume`
      }
    },

    lookup: {
      get crewRoles() {
        return `${environment.siteApiUrl}/v1/lookup/crew-roles`;
      },

      get searchableCrewRoles() {
        return `${environment.siteApiUrl}/v1/lookup/searchable-crew-roles`;
      },

      get unionTypes() {
        return `${environment.siteApiUrl}/v1/lookup/union-types`;
      },

      get cities() {
        return `${environment.siteApiUrl}/v1/lookup/cities`
      },

      get searchableCities() {
        return `${environment.siteApiUrl}/v1/lookup/searchable-cities`
      },

      get searchableBudgets() {
        return `${environment.siteApiUrl}/v1/lookup/searchable-budgets`
      },

      filterBudgets(role: string) {
        return `${environment.siteApiUrl}/v1/lookup/filtered-budgets?role=${role}`
      },

      filterWorkingCities(role: string) {
        return `${environment.siteApiUrl}/v1/lookup/filtered-workingCities?role=${role}`
      },

      workingCitiesByBudget(budget: string, role: string) {
        return `${environment.siteApiUrl}/v1/lookup/bybudget-workingcities?budget=${budget}&role=${role}`
      },
      organizationByCities(budget: string, role: string, City: string) {

        return `${environment.siteApiUrl}/v1/lookup/byCity-Organization?budget=${budget}&role=${role}&city=${City}`

      },

      organizationList() {

        return `${environment.siteApiUrl}/v1/lookup/organizationList`
      },

    },

    signup: {
      get freelancer() {
        return `${environment.siteApiUrl}/v1/account/freelancer/signup`;
      },
      get company() {
        return `${environment.siteApiUrl}/v1/account/company/signup`;
      },

      get abortUser() {
        return `${environment.siteApiUrl}/v1/account/freelancer/abort-user`;
      },
    },

    beta: {
      validateCode(code: string) {
        return `${environment.siteApiUrl}/v1/beta/validate/${code}`;
      },

      get mobileRequest() {
        return `${environment.siteApiUrl}/v1/beta/mobile`;
      },

      get siteRequest() {
        return `${environment.siteApiUrl}/v1/beta/website`;
      }//,

      // get company() {
      //   return `${environment.siteApiUrl}/v1/beta/productioncompany`;
      // }
    },

    search: {
      get cards() {
        return `${environment.siteApiUrl}/v1/search`;
      },

      get featured() {
        return `${environment.siteApiUrl}/v1/search/featured`;
      },

      quick(name: string) {
        return `${environment.siteApiUrl}/v1/search/quick?name=${name}`;
      },

      getLocations(role: string) {
        return `${environment.siteApiUrl}/v1/search/get-locations?role=${role}`;
      }
    },

    profile: {
      freelancer: {
        get changePassword() {
          return `${environment.siteApiUrl}/v1/account/change-password`;
        },

        profile(profileSysId: string) {
          return `${environment.siteApiUrl}/v1/profile/freelancer/${profileSysId}`;
        },

        card(profileSysId: string) {
          return `${environment.siteApiUrl}/v1/profile/freelancer/${profileSysId}/card`;
        },

        socialUserCard(socialUserId: number) {
          return `${environment.siteApiUrl}/v1/profile/freelancer/${socialUserId}/social-card`;
        },

        get updateBugetNotification() {
          return `${environment.siteApiUrl}/v1/profile/freelancer/update-budget-notification`;
        },

        get settings() {
          return `${environment.siteApiUrl}/v1/profile/freelancer/settings`;
        },

        get companySettings() {
          return `${environment.siteApiUrl}/v1/profile/company/settings`;
        },

        get personalSetting() {
          return `${environment.siteApiUrl}/v1/profile/freelancer/settings/personal`;
        },

        get portfolioSettings() {
          return `${environment.siteApiUrl}/v1/profile/freelancer/settings/portfolio`;
        },

        get companyPortfolioSettings() {
          return `${environment.siteApiUrl}/v1/profile/company/settings/portfolio`;
        },

        get companyPersonalSetting() {
          return `${environment.siteApiUrl}/v1/profile/company/settings/personal`;
        },

        updateStatus(statusId: number) {
          return `${environment.siteApiUrl}/v1/profile/freelancer/update-status/${statusId}`;
        },

        contest(reviewId: number, reviewType?: number) {
          return `${environment.siteApiUrl}/v1/review/freelancer/contest/${reviewId}?reviewType=${reviewType}`;
        },

        reviewable(profileSysId: string) {
          return `${environment.siteApiUrl}/v1/review/freelancer/${profileSysId}/reviewable`;
        },

        anonymousReviewable(profileSysId: string) {
          return `${environment.siteApiUrl}/v1/review/freelancer/${profileSysId}/anonymous-reviewable`;
        },

        review(profileSysId: string) {
          return `${environment.siteApiUrl}/v1/review/freelancer/${profileSysId}`;
        },

        reviews(profileSysId: string) {
          return `${environment.siteApiUrl}/v1/review/freelancer/${profileSysId}`;
        },

        get reviewRequests() {
          return `${environment.siteApiUrl}/v1/request-review/freelancer/requests`;
        },

        deleteReviewRequest(id: number) {
          return `${environment.siteApiUrl}/v1/request-review/freelancer/delete?id=${id}`;
        },

        resendReviewRequest(id: number) {
          return `${environment.siteApiUrl}/v1/request-review/freelancer/resend?id=${id}`;
        },

        validateResendReviewRequest(id: number) {
          return `${environment.siteApiUrl}/v1/request-review/freelancer/validate/${id}`;
        },

        facebookReview(profileSysId: string) {
          return `${environment.siteApiUrl}/v1/review/freelancer/${profileSysId}/facebook-review`;
        },

        contact(profileSysId: string) {
          return `${environment.siteApiUrl}/v1/contact/freelancer/${profileSysId}`;
        },

        hire(profileSysId: string) {
          return `${environment.siteApiUrl}/v1/hire/freelancer/${profileSysId}`;
        },

        hireResponse(profileSysId: string) {
          return `${environment.siteApiUrl}/v1/hire/freelancer/HireDetails?profileSysId=${profileSysId}`;
        },
        hireContactDetails(profileSysId: Number) {
          return `${environment.siteApiUrl}/v1/hire/freelancer/hire-contact-list?profileSysId=${profileSysId}`;
        },
       acceptHireDetails(hiredId: number, status: string) {
          return `${environment.siteApiUrl}/v1/hire/freelancer/accept-hire-rate?hiredId=${hiredId}&status=${status}`
        },
        hireProfileResponse(hireId: number, response: number) {
          return `${environment.siteApiUrl}/v1/hire/freelancer/HireJobResponse?HireID=${hireId}&response=${response}`;
        },
         
        getNegoiationHistory(id: number) {
          return `${environment.siteApiUrl}/v1/hire/freelancer/negotiation-history?hireid=${id}`;
        },
        hireContactDetailsOriginal(profileSysId: Number) {
          return `${environment.siteApiUrl}/v1/hire/freelancer/hire-contact-list-original?profileSysId=${profileSysId}`;
        },
       
        saveNegotiate()
        {
          return `${environment.siteApiUrl}/v1/hire/freelancer/hire-negotiate-rate`
        },
        deniedNegotiation(hireId)
        {
          return `${environment.siteApiUrl}/v1/hire/freelancer/denied-negotation?hireId=${hireId}`
        },
        additionalKit()
        {
          return `${environment.siteApiUrl}/v1/hire/freelancer/hire-additional-kit`
        }, 
        getKits(id:number)
        {
          return `${environment.siteApiUrl}/v1/hire/freelancer/hire-get-additional-kit?hireId=${id}`
        },
        delKit(kitId,hireId)
        {
          return `${environment.siteApiUrl}/v1/hire/freelancer/hire-delete-kit-fee?kitId=${kitId}&hireId=${hireId}`
        },
        notification(id:number)
        {
          return `${environment.siteApiUrl}/v1/hire/freelancer/negotiate-notification?hireId=${id}`
        },
     
        project() {
          return `${environment.siteApiUrl}/v1/project/freelancer`;
        },

        updateProject(id: number) {
          return `${environment.siteApiUrl}/v1/project/freelancer/updateProject/${id}`;
        },

        projects(profileSysId: string) {
          return `${environment.siteApiUrl}/v1/project/freelancer/${profileSysId}`;
        },

        deleteProject(id: number) {
          return `${environment.siteApiUrl}/v1/project/freelancer/delete/${id}`;
        },

        favoriteProject(id: number) {
          return `${environment.siteApiUrl}/v1/project/freelancer/favorite/${id}`;
        },

        unfavoriteProject(id: number) {
          return `${environment.siteApiUrl}/v1/project/freelancer/unfavorite/${id}`;
        },

        refer(profileSysId: string) {
          return `${environment.siteApiUrl}/v1/refer/freelancer/${profileSysId}`;
        },

        requestReview() {
          return `${environment.siteApiUrl}/v1/request-review/freelancer`;
        },

        history(profileSysId: string) {
          return `${environment.siteApiUrl}/v1/profile/freelancer/history/${profileSysId}`;
        },
        organizationDetail(passCode: string) {
          return `${environment.siteApiUrl}/v1/profile/freelancer/organization/${passCode}`;
        },
        deleteOrganization(passCode: string) {
          return `${environment.siteApiUrl}/v1/profile/freelancer/deleteOrganization/${passCode}`;
        },
        onlyOrganizationDetail(passCode: string) {
          return `${environment.siteApiUrl}/v1/profile/freelancer/onlyOrganization/${passCode}`;
        },

        get  addAccountDetail()
        {
          return `${environment.siteApiUrl}/v1/profile/freelancer/settings/bankAccounts`;
        },
        get  addCreditcardDetail()
        {
          return `${environment.siteApiUrl}/v1/profile/freelancer/settings/creditCard`;
      },
      getAllBankAccounts() {
        return `${environment.siteApiUrl}/v1/profile/freelancer/getBankAccountDetails`;
      }, 
      getAllCreditCards() {
        return `${environment.siteApiUrl}/v1/profile/freelancer/getCreditCards`;
      },
      deleteAccount(bankAccountId:Number) {
        return `${environment.siteApiUrl}/v1/profile/freelancer/deleteBankAccount/${bankAccountId}`;
      },
      deleteCreditCard(creditCardId: Number) {
        return `${environment.siteApiUrl}/v1/profile/freelancer/deleteCreditCard/${creditCardId}`;
      },
      defaultBankAccount(accountId: Number) {
        return `${environment.siteApiUrl}/v1/profile/freelancer/defaultBankAccount/${accountId}`;
      },
      defaultCreditCard(cardId: Number) {
        return `${environment.siteApiUrl}/v1/profile/freelancer/defaultCreditCard/${cardId}`;
      },

        editProject(id: number) {
          return `${environment.siteApiUrl}/v1/project/freelancer/editProject/${id}`;
        },

        projectBySongTitles(name: string, type: string) {
          return `${environment.siteApiUrl}/v1/project/freelancer/bySongTitle?name=${name}&type=${type}`;
        },

        projectByEpisodeTitles(name: string, type: string) {
          return `${environment.siteApiUrl}/v1/project/freelancer/byEpisodeTitle?name=${name}&type=${type}`;
        },

        projectByTitles(name: string, type: string) {
          return `${environment.siteApiUrl}/v1/project/freelancer/quick?name=${name}&type=${type}`;
        },

        getProject(id: number) {
          return `${environment.siteApiUrl}/v1/project/freelancer/detail/${id}`;
        },
        filterByRole(type:string,title:string,role:string[])
        {
          return `${environment.siteApiUrl}/v1/hire/freelancer/filter-by-roles?type=${type}&title=${title}&role=${role}`;
        },
        filterProjectByTitles(name: string, type: string) {
          return `${environment.siteApiUrl}/v1/hire/freelancer/filter-project-by-titles?name=${name}&type=${type}`;
        },

        filterSongByTitles(name: string, type: string) {
          return `${environment.siteApiUrl}/v1/hire/freelancer/filter-song-by-titles?name=${name}&type=${type}`;
        },

        filterEpisodeByTitles(name: string, type: string) {
          return `${environment.siteApiUrl}/v1/hire/freelancer/filter-by-episode-title?name=${name}&type=${type}`;
        },

        getProjectFromReviewRequestId(id: string) {
          return `${environment.siteApiUrl}/v1/project/freelancer/detail/${id}`;
        },

        get validateReviewRequest() {
          return `${environment.siteApiUrl}/v1/review/freelancer/validate-review-request`;
        },

        contactFacebook() {
          return `${environment.siteApiUrl}/v1/contact/freelancer/contact-facebook`;
        },
      }
    },

    contactteam: {
      get contact() {
        return `${environment.siteApiUrl}/v1/contact/team`;
      },
    },

    chat: {
      uploadPDFFiles(toUserId: string) {
        return `${environment.siteApiUrl}/v1/chat/UploadFiles?toUserId=${toUserId}`;
      },

      uploadDocFiles(toUserId: string) {
        return `${environment.siteApiUrl}/v1/chat/UploadWordFiles?toUserId=${toUserId}`;
      },

      uploadImageFiles(toUserId: string) {
        return `${environment.siteApiUrl}/v1/chat/UploadImage?toUserId=${toUserId}`;
      },

      getNotificationCounts(userId: string) {
        return `${environment.siteApiUrl}/v1/chat/NotificationsCount?userId=${userId}`;
      },

      readMoreNotifications(userId: string, pageSize: string) {
        return `${environment.siteApiUrl}/v1/chat/MyNotifications?userId=${userId}&page=${pageSize}`;
      },

      hideNotificationsCount(userId: string) {
        return `${environment.siteApiUrl}/v1/chat/HideNotificationsCount?userId=${userId}`;
      },

      updateNotifications(msgId: string) {
        return `${environment.siteApiUrl}/v1/chat/UpdateNotifications?notificationId=${msgId}`;
      },

      showChatWindow(msgId: string) {
        return `${environment.siteApiUrl}/v1/chat/ShowChatWindow?messageId=${msgId}`;
      }
    },

    notification: {
      get getUserNotificationCounts() {
        return `${environment.siteApiUrl}/v1/notification/user-notification-count`;
      },

      getUserNotifications(page: number) {
        return `${environment.siteApiUrl}/v1/notification/user-notifications/${page}`;
      },

      get readAllNotification() {
        return `${environment.siteApiUrl}/v1/notification/read-notifications`;
      },

      get getMessageNotificationCounts() {
        return `${environment.siteApiUrl}/v1/notification/message-notification-count`;
      },

      getMessageNotifications(page: number) {
        return `${environment.siteApiUrl}/v1/notification/message-notifications/${page}`;
      },

      get readAllMessageNotification() {
        return `${environment.siteApiUrl}/v1/notification/read-message-notifications`;
      },
    },

    project: {
      get getHireHistory() {
        return `${environment.siteApiUrl}/v1/hire/freelancer/hire-history`;
      },
      get projectTabsVisibility() {
        return `${environment.siteApiUrl}/v1/hire/freelancer/job-tabs`;
      },
      card(hireId: number) {
        return `${environment.siteApiUrl}/v1/hire/freelancer/${hireId}/contractee-card`;
      },
      get mutualCancel() {
        return `${environment.siteApiUrl}/v1/project/freelancer/mutual-cancel`;
      },
      cancelOptions(type) {
        return `${environment.siteApiUrl}/v1/project/freelancer/cancel-options/${type}`;
      }
    },

    cancellation : {
      nonmutualcancel() {
        return `${environment.siteApiUrl}/v1/project/freelancer/cancel-request`;
      },
      mutualcancel(){
        return `${environment.siteApiUrl}/v1/project/freelancer/mutual-cancel`;
      },
       get CancelOption()
      {
        return `${environment.siteApiUrl}/v1/project/freelancer/cancel-options`;
      }
    },

  }
};
