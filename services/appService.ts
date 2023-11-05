import { ServerResponse } from "http";

import Router from "next/router";

import store from "../redux/store";
import { STORAGE_KEYS } from "@/constants";
import { ChatbotUserT, updateChatbotData } from "@/redux/slices";

const dispatch = store.dispatch;

export const redirect = (URL: string, server?: ServerResponse) => {
  if (server) {
    // @see https://github.com/zeit/next.js/wiki/Redirecting-in-%60getInitialProps%60
    // server rendered layouts need to do a server redirect
    server.writeHead(302, {
      Location: URL,
    });
    server.end();
  } else {
    // only client side layouts have access to next/router
    Router.push(URL);
  }
};

class AppServicer {
  store = store;
  dispatch = dispatch;
  getUserDetails() {
    try {
      const userDetails = localStorage.getItem(
        STORAGE_KEYS.PETA_CHAT_USER
      ) 

      if (userDetails) {
        const parsedUserdDetails=JSON.parse(userDetails)as ChatbotUserT 
        dispatch(updateChatbotData({ userDetails:parsedUserdDetails }));
        return parsedUserdDetails;
      }
      return null;
    } catch (e) {
      console.log(e);
      return null;
    }
  }
  storeUserDetails(userDetails:ChatbotUserT) {
   localStorage.setItem(
        STORAGE_KEYS.PETA_CHAT_USER,
        JSON.stringify(userDetails)
      ) 
   }
}

export const appService = new AppServicer();
