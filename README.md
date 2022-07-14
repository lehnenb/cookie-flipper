# Cookie Flipper

Experimental Chrome extension used for setting cookies `(to "true" or "false")` and keeping them in sync across different domains.

![Alt Text](https://media1.giphy.com/media/bAlYQOugzX9sY/giphy.gif?cid=ecf05e479x5d1ea9pt8xj47p8ehiwwvbjkf4hhz2dm5a09uv&rid=giphy.gif&ct=g)

# FYI 

This is a barely-functional version used for solving a very specific use case.

For now, it only sets cookies to `"true" or "false"` since I only use it to control feature flags.

Could turn this into a proper extension in the future. However, at the moment, this is here mainly to serve as a template for new extensions.

## Instructions

- First, build the project using: `yarn run dev`
- Then, go to: `chrome://extensions/` and enable the developer mode at the upper right-hand corner
- Finally, load the package by clicking on `Load unpacked` located in the upper left corner (you have to point to the folder where manifest.json file is, /dist in this case)
