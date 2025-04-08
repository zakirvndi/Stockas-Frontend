export const setCookie = (name: string, value: string, days: number) => {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const secureFlag = process.env.NODE_ENV === 'production' ? ';Secure' : '';
    document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/;SameSite=Lax${secureFlag}`;
  };
  
  export const getCookie = (name: string): string | undefined => {
    if (typeof window === 'undefined') return undefined;
    return document.cookie
      .split('; ')
      .find(row => row.startsWith(`${name}=`))
      ?.split('=')[1];
  };
  
  export const deleteCookie = (name: string) => {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  };