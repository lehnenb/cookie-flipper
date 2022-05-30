import * as Storage from './storage';

function parseCookieValue(flag: string) {
  return flag === "true";
}

function encodeCookieValue(flag: boolean): string {
  return (flag) ? "true" : "false";
}

async function get(url: string, name: string): Promise<boolean> {
  const cookie = await chrome.cookies.get({ url, name });

  return parseCookieValue(cookie?.value || "false");
}

function set(url: string, name: string, rawValue: boolean): Promise<chrome.cookies.Cookie> {
  const value = encodeCookieValue(rawValue);
  
  return chrome.cookies.set({ url, name, value })
}

export async function syncFeatureFlags(url: string, featureFlags: Storage.FeatureFlagsDict): Promise<boolean> {
  const featureFlagEntries = Object.entries(featureFlags);
  let hasChanged = false;

  for (const [featureFlag, isEnabled] of featureFlagEntries) {
    const cookieEnabledValue = await get(url, featureFlag);

    if (cookieEnabledValue === isEnabled) {
      continue;
    }

    hasChanged = true;
    set(url, featureFlag, isEnabled);
  }

  return hasChanged;
}
