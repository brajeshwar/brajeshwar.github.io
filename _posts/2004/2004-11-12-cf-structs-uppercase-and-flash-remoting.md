# CF Structs, uppercase and Flash Remoting

Today, I saw a post from Jesse on <a href="http://www.jessewarden.com/archives/2004/11/case_sensitivit.html" title="Case Sensitivity in Unexpected Place: XML Object">Case Sensitivity in Unexpected Place: XML Object</a>. This reminded me of a small issue that we faced while on some projects where we have used ColdFusion for Flash Remoting. This might  be helpful for some people out there;

ColdFusion seem to have an issue when dealing with flash remoting, wherein, the names of properties in any structs returned by the remote methods, get converted to uppercase.

Eg:

```cf
// code in a cf function
<cfset obj="StructNew()" />
<cfset obj.value="foo" />
<cfreturn obj />
```

On the flash side this would yield an object,

`@{VALUE:"foo"};@`

instead of

`@{value:"foo"};@`

With nested structs this could become, 

oResult.DATA.SOMESTATUS,
oResult.DATA.EMAILCHECK, etc.

The workaround to this problem is to use the array access operator in any ColdFusion structs you intend to return to flash. So, the above ColdFusion code needs to be written as,

```cf
<cfset obj="StructNew()" />
<cfset obj ["value"]="foo" />
<cfreturn obj />
```