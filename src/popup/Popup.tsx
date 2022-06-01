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
        <li key={flag} className="form-check form-switch">
          <input
            type="checkbox"
            checked={isChecked}
            role="switch"
            onChange={handleFlagChange}
            className="form-check-input"
            value={flag}
          />
          <label>{flag}</label>
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
      <div className="title">
        <h1>On Flipper Cookies</h1>
      </div>

      <hr />

      <div className="mb-3">
        <form onSubmit={handleSubmit}>
          <div>
            <label><b>Feature Flag</b></label>
            <input 
              style={{marginTop: "10px" }}
              required
              value={featureFlagValue}
              onChange={handleFeatureFlagsInputChange}
              placeholder="add new feature flag"
              id="feature-flags-input" 
              className="form-control"
              type="text" 
            />
          </div>

          <div style={{marginTop: "10px" }}>
            <button type="submit" className="btn btn-primary">Submit</button>
          </div>

        </form>
      </div>

      <hr />

      <div className="mb-3">
        <h3>Added flags</h3>
        <ul style={{margin: 0, padding: 0}}>{listContents}</ul>
      </div>
    </div>
  );
}
