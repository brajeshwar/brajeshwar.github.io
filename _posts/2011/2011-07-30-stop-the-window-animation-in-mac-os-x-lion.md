---
layout: post
title: Stop the Window Animation in Mac OS X Lion
---

You can get rid of the Window Opening Animation in Lion. Run this command in your Terminal.

`defaults write NSGlobalDomain NSAutomaticWindowAnimationsEnabled -bool NO`

To get it back, set the "NO" To "YES"

`defaults write NSGlobalDomain NSAutomaticWindowAnimationsEnabled -bool YES`

Try out more [macOS tips and tricks](https://oinam.fyi/devices/macos/).