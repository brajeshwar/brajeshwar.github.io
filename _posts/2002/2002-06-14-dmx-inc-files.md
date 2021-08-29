# DMX & inc files

I was surprised when I cannot have a design view of my include files [ .inc ] in Dreamweaver MX, so I went to ask on our Jordan's Dreamweaver list at Blueworld and I got a part of my answer to exclude .inc from the  `Edit > Preference > File Type/ Editors` and Open in Code view text field.

Well, to make things work, you have to edit the "MMDocumentTypes.xml" to include your .inc file in the range of those html,htm,xhtml  and the other extensions.  "MMDocumentTypes.xml" is  located at `Dreamweaver MX folder\Configuration\DocumentTypes`.