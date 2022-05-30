import React, { useState } from 'react';
import * as ReactDOM from 'react-dom';
import "./Popup.scss";
import Popup from './Popup';
import * as Storage from "../lib/storage";

const PopupContainer = (props: { featureFlags: Storage.FeatureFlagsDict }) => {
  const [featureFlags, setFeatureFlags]  = useState(props.featureFlags);

  const handleSubmit = (featureFlag: string) => {
    Storage
      .setFeatureFlag(featureFlag, false)
      .then((updatedFeatureFlags) => setFeatureFlags(updatedFeatureFlags));
  };

  const handleFlagChange = (featureFlag: string, value: boolean) => {
    Storage
      .setFeatureFlag(featureFlag, value)
      .then((updatedFeatureFlags) => {
	setFeatureFlags(updatedFeatureFlags)
      });
  };

  return (
    <Popup 
      onSubmit={handleSubmit}
      onFlagChange={handleFlagChange}
      featureFlags={featureFlags}
    />
  );
};

chrome
  .tabs
  .query({ active: true, currentWindow: true }, async () => {
    await Storage.setupFeatureFlagsStorage();
    const featureFlags = await Storage.getFeatureFlags();

    ReactDOM.render(
      <PopupContainer featureFlags={featureFlags} />,
      document.getElementById('popup')
    );
  });

