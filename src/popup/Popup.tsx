import React, { useEffect, useState, ReactElement } from "react";

export type FeatureFlagsDict = { [key: string]: boolean };

interface PopupProps {
  featureFlags: FeatureFlagsDict, 
  onSubmit: (featureFlag: string) => void
  onFlagChange: (featureFlag: string, value: boolean) => void
}

export default function Popup(props: PopupProps) {
  useEffect(() => {
    // Inform Chrome runtime that popup is ready
   chrome.runtime.sendMessage({ popupMounted: true });
  }, []);

  const [featureFlagValue, setFeatureFlagValue] = useState("");
  const [featureFlagsChecked, setFeatureFlagsChecked] = useState<FeatureFlagsDict>(props.featureFlags);

  const getListItems = (): ReactElement[] => {
    const getItem = ([flag,]: [string, boolean]) => {
      const isChecked = featureFlagsChecked[flag];

      return (
	<li key={flag}>
          <label>
            {flag}
            <input
             type="checkbox"
             checked={isChecked}
             onChange={handleFlagChange}
             value={flag}
            />
          </label>
	</li>
      ); 
    };

    return Object
      .entries(props.featureFlags)
      .sort(([a,], [b,]) => a.localeCompare(b))
      .map(getItem);
  };


  const handleFlagChange = (e) => {
    const currentFlag = e.target.value;
    featureFlagsChecked[currentFlag] = e.target.checked;
    setFeatureFlagsChecked(featureFlagsChecked);
    props.onFlagChange(currentFlag, featureFlagsChecked[currentFlag]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    props.onSubmit(featureFlagValue);
    setFeatureFlagValue("");
  };

  const handleFeatureFlagsInputChange = (e) => {
    const value = e.target.value;
    setFeatureFlagValue(value);
  }

  const listItems = getListItems();
  let listContents: ReactElement | ReactElement[] = null;

  if (listItems.length) {
    listContents = listItems;
  } else {
    listContents = (<span>No feature flags added to the list</span>) 
  }

  return (
    <div id="feature-flags">
      <form onSubmit={handleSubmit}>
        <label>
            Feature flag:
            <input 
              required
              value={featureFlagValue}
              onChange={handleFeatureFlagsInputChange}
              id="feature-flags-input" 
              type="text" 
            />
        </label>
        <input type="submit" value="Submit" />
      </form>

      {listContents}
    </div>
  );
}
