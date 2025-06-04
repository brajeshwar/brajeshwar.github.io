# Essential ActionScript 2.0

This book is another must have for any Flash-Actionscript Application Developer. Visit the [official book site](http://moock.org/eas2/). Neverthless, if you are looking for something like "Actionscript 2.0: The Definitive Guide", then this is not the book. It talks less or very little about Actionscript 2.0 syntax per se.

## Actionscript 2.0 Overview

Actionscript 2.0 was introduced along with Flash MX 2004. Though it adds little new runtime functionality to the language, it improved developement of Flash Applications by formalizinig Object Oriented Programming syntax and Methodology. Most of the new OOP syntax in Actionscript 2.0 is based on the [ECMAScript 4 standard](http://www.mozilla.org/js/language/es4/).

The components have also matured to the new v2 components, re-written from scratch in Actionscript 2.0 and built atop version 2 of the Macromedia Component Architecture. It is advised not to mix Actionscript 1.0 (the script that existed with Flash 5 and Flash MX) OOP technique with Actionscript 2.0 code.

## Object-Oriented Actionscript

Object-Oriented Programming is a programming approach intended to solve some of the development and maintenance problems commonly associated with large procedural programs. OOP is designed to make complex applications more manageable by breaking down into self-contained, interacting modules. The chapters gives you a summarized view of the core concepts of OOP in Flash. If you are already comfortable with OOP, then most of the other part of the chapter can be just finished off on a cursory glance.

## Datatypes and Type Checking

Chapter 3 of the book talks about Datatypes and Type Checking in Actionscript. With AS 2.0, new datatypes can be added by creating classes besides the inbuilt AS 2.0 datatypes. It is a good programming practice in AS 2.0 to declare the datatype of every variable, property, function parameter, method parameter, function return value and the method return value. Variables, properties, parameters and return values without a declared datatype are not type checked. Type checking is a good way and gaurantee that a program will run the way we intend it to. It may be noted that global variable cannot be typed. So, something like `_global.myVariable:String = "something";` will return a syntax error.

## Classes

The chapter discuss about the syntax and theory behind classes in Actionscript 2.0. Classes are the foundational structure of all object-oriented programs, making them arguably the most important aspec of OOP. The book deals with this chapter in a rather detailed fashion and is thus very good for new and intermediate OOP developers alike. It takes you very well on how to Define classes, constructor functions, properties, methods and finishes off with a full scale example of a class creation.

About `this`, let us put something about `this` from the Book (a recently discussed thread on Flashcoder's list).

The `this` keyword is most often used when passing the current object to another object's method.

```as
function someMethod():Void {
//Pass this as a parameter to a completely separate object
someOtherObject.someOtherMethod (this);
}
```

When an instance property or a class property has the same name as a method parameter, the parameter takes precedence. That is, uses of the duplicate name in the method will refer to the parameter, not the property. However, we can still access the property by preceding the name with the `this` keyword.

EAS 2.0 says that, the use of `this` is perfectly legal even when it is not required. It also advocates that using `this` when not required is redundant. It is best avoided for easier reading of the codes. In an AS 2.0 class definition, use of the `this` keyword is legal only within instance methods and construction functions.

## Authoring an Actionscript 2.0 Class

I would rather called this an extention to the previous chapter. This particular chapter deals very minutely on authoring a class, an "ImageViewer" class. This should definitely help clear the concept of defining a class in AS 2.0 very well.

## Inheritance

This section deals with the relationship between classes, where a class inherits the property and method definitions of another class. Here, it may be remembered that the class methods and properties of some built-in classes (like Math, XML) are not inherited by their subclasses. In this case, the work-around would be to deal with composition and not Inheritance. It is discussed in more details in the later chapters. Actionscript 2.0 does not support abstract classes or abstract method yet. Instead of defining an abstract method in Actioncript, define a method with no code in its body. The final method is also not implemented in Actionscript 2.0 yet.

## Authoring an ActionScript 2.0 subclass

This chapters takes us into details of subclassing an AS 2.0 class with the example of subclassing the "ImageViewer" class from the Class Chapter earlier.

## Interfaces

An interface is an ActionScript 2.0 language construct used to define a new datatype. Interfaces are mainly useful for large applications, or where plans are chalked out for the class structure and interaction very carefully, or when building reusable frameworks or class libraries. Interfaces is more useful in conjunction with strong typing, it is believed that it is hard to see the significance until one get stuck in, if one aren't used to coding that way. The most common analogy for an Interface, is that it is like a contract. If you implement an Interface, you a making a promise that you are going to define all the methods that the interface declares. If you break the contract then the compiler will not allow you to compile.

## Packages

A package is a unique place to put a group of classes, much as a directory on your hard drive is a unique place to put a group of files. Packages are created mostly so that classes do not clash with one another. Best packaging habit is to use the convention of placing all your classes and packages in a package named after your oganization's domain name like com.orgName.projectName.module.className. Domain names are gauranteed to be unique by a system of authorized top-level-domain registrars, thus, start your package names with your organization's domain name avoid name conflicts with code developed by other organizations or developers. It may be noted that there is no such thing as Package file, it is rather a concept based on placing a given class's .as file in their appropriate folder. When dealing with Packages, remember that the class declaration must use the fully qualified class name, in our case it will be something like class com.orgName.projectName.module.className.

## Exceptions

The last chapter of Part I of the book deals with exception handling, error handling.

Reference links:

- <a href="http://moock.org/eas2/" title="essential actionscript 2.0">Official Site</a>
- <a href="http://moock.org/eas2/examples/" title="examples">EAS 2.0 Examples</a>
- <a href="http://ootips.org/" title="object orientation tips">Object Orientation Tips</a>
- <a href="http://www.uml.org/" title="UML home page">UML</a>
- <a href="http://www.gmodeler.com/" title="gModeler">gModeler</a>
- <a href="http://archive.eiffel.com/doc/manuals/technology/oosc/inheritance-design/page.html" title="using inheritance well">Using Inheritance Well</a>
