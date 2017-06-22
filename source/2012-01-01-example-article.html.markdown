---
title: Example Article
date: 2012-01-01
tags: example
---

### 13 Basic Cat Command Examples in Linux
***
The cat (short for “**concatenate**“) command is one of the most frequently used command in Linux/Unix like operating systems. **cat** command allows us to create single or multiple files, view contain of file, concatenate files and redirect output in terminal or files. In this article, we are going to find out handy use of **cat** commands with their examples in Linux.

#### General Syntax
***
	cat [OPTION] [FILE]...
	
### 1. Display Contains of File
***
In the below example, it will show contains of **/etc/passwd** file.

	# cat /etc/passwd
	root:x:0:0:root:/root:/bin/bash
	bin:x:1:1:bin:/bin:/sbin/nologin
	narad:x:500:500::/home/narad:/bin/bash
	
### 2. View Contains of Multiple Files in terminal
***
In below example, it will display contains of **test** and **test1** file in terminal.

	# cat test test1
	Hello everybody
	Hi world,
	
### 3. Create a File with Cat Command
***
We will create a file called **test2** file with below command.

	# cat >test2
	
Awaits input from user, type desired text and press **CTRL+D** (hold down **Ctrl Key** and type ‘**d**‘) to exit. The text will be written in **test2** file. You can see contains of file with following **cat** command.

	# cat test2
	hello everyone, how do you do?
	
### 4. Use Cat Command with More & Less Options
***
If file having large number of contains that won’t fit in output terminal and screen scrolls up very fast, we can use parameters more and less with **cat** command as show above.

	# cat song.txt | more
	# cat song.txt | less
	
### 5. Display Line Numbers in File
***
With -n option you could see the line numbers of a file song.txt in the output terminal.
	
	# cat -n song.txt
	1  "Heal The World"
	2  There's A Place In
	3  Your Heart
	4  And I Know That It Is Love
	5  And This Place Could
	6  Be Much
	7  Brighter Than Tomorrow
	8  And If You Really Try
	9  You'll Find There's No Need
	10  To Cry
	11  In This Place You'll Feel
	12  There's No Hurt Or Sorrow
	
### 6. Display $ at the End of File
***
In the below, you can see with -**e** option that `$` is shows at the end of line and also in space showing `$` if there is any gap between paragraphs. This options is useful to squeeze multiple lines in a single line.

	# cat -e test
	hello everyone, how do you do?$
	$
	Hey, am fine.$
	How's your training going on?$
	$
	
### 7. Display Tab separated Lines in File
***
In the below output, we could see **TAB** space is filled up with ‘**^I**‘ character.

	# cat -T test
	hello ^Ieveryone, how do you do?
	Hey, ^Iam fine.
	^I^IHow's your training ^Igoing on?
	Let's do ^Isome practice in Linux.
	
### 8. Display Multiple Files at Once
***
In the below example we have three files **test**, **test1** and **test2** and able to view the contains of those file as shown above. We need to separate each file with ; (semi colon).

	# cat test; cat test1; cat test2
	This is test file
	This is test1 file.
	This is test2 file.
	
### 9. Use Standard Output with Redirection Operator

We can redirect standard output of a file into a new file else existing file with ‘**>**‘ (greater than) symbol. Careful, existing contains of **test1** will be overwritten by contains of **test** file.

	# cat test > test1
	
### 10. Appending Standard Output with Redirection Operator
***
Appends in existing file with ‘**>>**‘ (double greater than) symbol. Here, contains of **test** file will be appended at the end of **test1** file.

	# cat test >> test1
	
### 11. Redirecting Standard Input with Redirection Operator
***
When you use the redirect with standard input ‘**<**‘ (less than symbol), it use file name **test2** as a input for a command and output will be shown in a terminal.
	
	# cat < test2
	This is test2 file.
	
### 12. Redirecting Multiple Files Contain in a Single File
***
This will create a file called **test3** and all output will be redirected in a newly created file.

	# cat test test1 test2 > test3
	
### 13. Sorting Contains of Multiple Files in a Single File
***
This will create a file **test4** and output of **cat** command is piped to sort and result will be redirected in a newly created file.

	# cat test test1 test2 test3 | sort > test4
	
This article shows the basic commands that may help you to explore **cat** command. You may refer man page of cat command if you want to know more options. In out next article we will cover more advanced **cat** commands. Please share it if you find this article useful through our comment box below.
