import Cookie from "js-cookie";

export class Cookies {

  //    Set Cookie...  
  static setCookie(name, str) {
    Cookie.set(name, str, {
      path: "/gapsap",
      expires: Date.now() + 24 * 60 * 60 * 1000,
      secure: true,
    });
  }

  //    Get Cookie...
  static getCookie(str) {
    return Cookie.get(str);
  }

  //    Remove Cookie...
  static removeCookie(name) {
    return Cookie.remove(name, { path: "/gapsap", secure: true });
  }
}
