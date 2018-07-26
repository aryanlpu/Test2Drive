import { SignalRConfiguration } from '@dharapvj/ngx-signalr'
import { environment } from 'environments/environment';

export class ChatConfig {
    public static BASE_USER_ENDPOINT = 'api/chat/save';
    public static BASE_USER_ENDPOINT_GetChat = 'api/chat/getchat';
    public static BASE_CONNECTION;
    public static My_ConnectionId = "";
    public static My_USER_ID = "";
    public static ConnectionExists = false;
}

export function createConfig(): SignalRConfiguration {
    const config = new SignalRConfiguration();
    const user = getSessionId();
    config.hubName = 'ChatHub';
    config.qs = { user };
    config.url =  "http://localhost:50198"; // environment.site.api;
    config.logging = !environment.production;
    
    return config;
  }

function getSessionId() {
    let sessionId = window.sessionStorage.sessionId;
    if (!sessionId) {
        sessionId = window.sessionStorage.sessionId = Date.now();
    }
    return sessionId;
}