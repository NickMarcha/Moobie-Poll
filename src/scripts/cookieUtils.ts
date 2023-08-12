// cookieUtils.ts

export function setCookie(name: string, value: string, days: number) {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + days);

  const cookieValue =
    encodeURIComponent(value) +
    (days ? `; expires=${expirationDate.toUTCString()}` : "");

  document.cookie = `${name}=${cookieValue}; path=/`;
}

export function getCookie(name: string): string | null {
  const cookies = document.cookie.split("; ");

  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split("=");
    if (cookieName === name) {
      return decodeURIComponent(cookieValue);
    }
  }

  return null;
}

export function deleteCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}
