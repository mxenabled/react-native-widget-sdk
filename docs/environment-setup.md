# Setting up your environment

This document will walk you though how to set up your environment so that you
can run the example React Native app in your computer.

<span style="color: red; font-weight: bold">TODO</span> document setup for Android.


## Installing dependencies

You will need the following programs installed before we can proceed:


### Xcode

You can download and install Xcode from the App Store in your computer.
Make sure you install the full version of Xcode and not the beta.


### Xcode command line tools

After installing Xcode, execute the command below to install the command line
tools provided by Xcode:

```
xcode-select --install
```


### iPhone simulator

Open Xcode and go to the Preferences (<keyboard>command + comma</keyboard>),
then go to the "Components" tab and select and install a recent version of iOS
(that's version 14.x at the time of writing).


### brew

Go to https://brew.sh/ and execute the command listed in the installation
section. Alternatively, you can copy it from here:

```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```


### Node

Go to https://nodejs.org/en/download/ and download the Node installer for
macOS. Make sure you install Node v16 (for example, v16.14.0). Alternatively,
you can install a Node version manager, such as nvm
(https://github.com/nvm-sh/nvm), and install Node v16 that way or install Node
through brew. All methods work as long as you install Node v16. Below you
will find the command to install Node with brew.

```
brew install node
```


### Ruby

Go to https://www.ruby-lang.org/en/documentation/installation/ and follow the
instructions for installing Ruby with brew. Make sure you install Ruby v2.7
(for example, v2.7.5). Alternatively, you can install a Ruby version manager,
such as rbenv (https://github.com/rbenv/rbenv), and install Ruby v2.7 that way.
Both methods work as long as you install Ruby v2.7. Below you will find the
command to install Ruby with brew.

```
brew install ruby@2.7
```


### CocoaPods

Go to https://guides.cocoapods.org/using/getting-started.html and execute the
command listed in the installation section. Below you will find the command to
install CocoaPods with gem.

```
sudo gem install cocoapods
```


## Checking dependencies

Once all of those dependencies have been installed, run the following commands
and ensure they all succeed and print a version number. The versions you get
should roughly match the versions I include below. Your version numbers don't
have to match exactly, just make sure the first number of each version that you
have matches what I include here. If there's a mismatch, it may still work, but
if it doesn't know that this may be the reason.

```bash
xcodebuild -version
# => Xcode 13.2.1
# => Build version 13C100

node --version
# => v16.11.1

brew --version
# => Homebrew 3.3.6
# => Homebrew/homebrew-core (git revision 5b7a40e0b24; last commit 2021-11-30)
# => Homebrew/homebrew-cask (git revision 87e1b9b492; last commit 2021-11-30)

ruby --version
# => ruby 2.6.1p33 (2019-01-30 revision 66950) [x86_64-darwin20]

pod --version
# => 1.11.2

git --version
# => git version 2.32.0 (Apple Git-132)
```
