# Launcher API (Unity) support
Mailspring plugin. It adds support for Launcher API (Unity) notifications to the dock
![screenshot](https://github.com/snqlby/launcher-api-support/raw/master/media/screenshot.png)

# GNOME Dash to Dock extension compatibility
It is possible to use this plugin for [Dash to Dock](https://extensions.gnome.org/extension/307/dash-to-dock/) extension. Make sure your Dash to Dock build and linux distributive have support for unity notifications. 
You may need to install a version from the [GitHub repository](https://github.com/micheleg/dash-to-dock).
You also need to add support for the Launcher API, if that was not provided by your DE.

| Distributive  | DE            |Package   |
|:-------------:|:-------------:|:--------:|
| Arch Linux    | GNOME         | [libunity](https://aur.archlinux.org/packages/libunity/) |

## Installation from source
```Bash
git clone https://github.com/snqlby/launcher-api-support.git
cd launcher-api-support
npm install
```
Open your Mailspring app and select **launcher-api-support** directory: `Developer -> Install a Plugin`
