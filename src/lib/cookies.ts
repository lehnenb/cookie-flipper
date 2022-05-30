import * as Storage from './storage';

function parseCookieValue(flag: string) {
  return flag === "true";
}

function encodeCookieValue(flag: boolean): string {
  return (flag) ? "true" : "false";
}

async function get(url: string, name: string): Promise<boolean> {
  const cookie = await chrome.cookies.get({ url, name });

  console.log('get', { url, name, cookie })

  return parseCookieValue(cookie?.value || "false");
}

function set(url: string, name: string, rawValue: boolean): Promise<chrome.cookies.Cookie> {
  const value = encodeCookieValue(rawValue);
  
  console.log('set', { url, name })

  return chrome.cookies.set({ url, name, value })
}

export async function syncFeatureFlags(url: string, featureFlags: Storage.FeatureFlagsDict) {
  const featureFlagEntries = Object.entries(featureFlags);

  for (const [featureFlag, isEnabled] of featureFlagEntries) {
    const cookieEnabledValue = await get(url, featureFlag);

    if (cookieEnabledValue === isEnabled) {
      console.log(`Skipping cookies - nothing changed:`, featureFlag);
      continue;
    }

    console.log(`Cookies for feature ${featureFlag} set to ${isEnabled}`)
    set(url, featureFlag, isEnabled);
    // location.reload();
  }
}
