# Setting up your environment

Follow the steps outlined in [this document][react_native_env_setup] to set up
your local environment so that you can run the example React Native application
in a simulator for both iOS and Android.

## Checking dependencies

To check that every dependency was installed and is working correctly, run the
following commands and ensure they all succeed and print a version number. The
versions you get should roughly match the versions I include below. If there's
a mismatch in a version, everything may still work, but if it doesn't know that
this may be the reason.

```bash
xcode-select --version
# => xcode-select version 2392.

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

java -version
# => java version "15.0.2" 2021-01-19
# => Java(TM) SE Runtime Environment (build 15.0.2+7-27)
# => Java HotSpot(TM) 64-Bit Server VM (build 15.0.2+7-27, mixed mode, sharing)
```

[react_native_env_setup]: https://reactnative.dev/docs/environment-setup "Setting up the development environment"
