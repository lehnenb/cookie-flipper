export const FLAGS_KEY = 'flags';

export type FeatureFlagsDict = { [key: string]: boolean };

export async function setupFeatureFlagsStorage(): Promise<void> {
    const storage = await chrome.storage.local.get([FLAGS_KEY]);

    // initializes storage
    if (!storage[FLAGS_KEY]) {
        await chrome.storage.local.set({ [FLAGS_KEY]: {} });
    }
}

export async function getFeatureFlags(): Promise<FeatureFlagsDict> {
  const featureFlags = await chrome.storage.local.get([FLAGS_KEY]);
  const result: FeatureFlagsDict = {};

  console.log("storage, get", { featureFlags})

  for (const [featureFlag, value] of Object.entries(featureFlags[FLAGS_KEY] || {})) {
    result[featureFlag] = !!value;
  }

  return result;
}

export async function setFeatureFlag(addedFlag: string, value: boolean): Promise<FeatureFlagsDict> {
  const featureFlags = await getFeatureFlags();

  if (!featureFlags[addedFlag]) {
    featureFlags[addedFlag] = value;
    await chrome.storage.local.set({ [FLAGS_KEY] : featureFlags });
  }

  console.log({ addedFlag, value, featureFlags })

  return featureFlags;
}

