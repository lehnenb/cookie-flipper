import { getFeatureFlags } from "../lib/storage";
import { syncFeatureFlags} from "../lib/cookies";

async function syncChanges(tabId: number): Promise<void> {
    const featureFlags = await getFeatureFlags();
    const tab = await chrome.tabs.get(tabId);

    syncFeatureFlags(tab.url, featureFlags);
}

chrome.storage.onChanged.addListener(async (_, area) => {
  if (area !== "local") {
    return;
  }

  const queryOptions = { active: true, lastFocusedWindow: true };
  const [tab] = await chrome.tabs.query(queryOptions);

  tab.id && await syncChanges(tab.id);
});

chrome.tabs.onUpdated.addListener(syncChanges)
chrome.tabs.onActivated.addListener(({tabId}) => syncChanges(tabId))
