# Class naming convention, Reverse domain

Well, there are still questions that we consider understood and took no further discussion. Today, a friend asked me why most people use the reverse domain name for class package naming convention; `com.oinam.util.MyClass`.

Well, it is because of the fact that this naming convention is very unique. This becomes more prominent if we are to distribute our codes, work within a team of developers.

Following the defined convention, the prefix of our packages should always be written in all lowercase plain ASCII letters (well, we still don't have a domain names with $, # or * yet), and they should be of the top-level domain names viz: com, edu, gov, mil, net, org (you are also allowed to use one of the English two-letter codes identifying countries as specified in ISO Standard 3166, 1981).

The other part of the package name is usually the project name or a company's division, department, machine, login names or commonly used packages like `util`, `arcade`.

Thus, a typical class, say `MyClass` with the class definition `com.oinam.util.MyClass` would have been in the folder `util` which is inside `oinam` which resides on the top folder `com`. Structurily, `com > oinam > util > MyClass.as`
