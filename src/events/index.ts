import { getFeatureFlags } from "../lib/storage";
import { syncFeatureFlags} from "../lib/cookies";

async function syncChanges(tabId: number): Promise<void> {
    const featureFlags = await getFeatureFlags();
    let tab = await chrome.tabs.get(tabId);

    console.log({ featureFlags });

    syncFeatureFlags(tab.url, featureFlags);
}

chrome.storage.onChanged.addListener(async (_, area) => {
  if (area !== "local") {
    return;
  }

  let queryOptions = { active: true, lastFocusedWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);

  tab.id && await syncChanges(tab.id);
});

chrome.tabs.onUpdated.addListener(syncChanges)
chrome.tabs.onActivated.addListener(({tabId}) => syncChanges(tabId))
