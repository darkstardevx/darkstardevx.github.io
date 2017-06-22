---
title: Add style to your terminal with powerline
date: 2017-01-24 16:45 UTC
tags:
---

#### Add style to your terminal with powerline
***
Install powerline:

	$ sudo apt install powerline

Install extras (recommended):

	$ sudo apt install python-powerline-doc vim-addon-manager fonts-powerline

Add the following snippet to your .bashrc file

	if [ -f `which powerline-daemon` ]; then
	  powerline-daemon -q
	  POWERLINE_BASH_CONTINUATION=1
	  POWERLINE_BASH_SELECT=1
	  . /usr/share/powerline/bindings/bash/powerline.sh
	fi

To activate the changes:

	$ source ~/.bashrc
	
or open a new terminal window.