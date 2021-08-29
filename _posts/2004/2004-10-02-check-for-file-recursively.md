# Check for file recursively

Not so long ago in the near past of this year 2004, there was a need for a solution to an issue with one of our Application at Oinam Software. The Application is now successfully deployed but as usual, it is still under clearance-wrapped if we can even say anything about it on the site or public. Ok, currently the issue is resolved by using remoting (ColdFusion) and the application is even entering its version 2.

Now, let us forget that application and see the issue. The issue was to allow the client or any person inheriting the project or someone doing changes should be able to drop in any non-progressive jpeg or a swf in a folder and accordingly display if some specific file(s) with matching filename are there in the specific directory. Our developer team came up with a working prototype which never got used, neither in this project nor anywhere else, so, here it is for anybody interested in the same. Use it either modified, mutilated or in whichever way you wish.

In the actual prototype, the `array` was parsed from an xml where the client can just put in the name accordingly.

```as
//create the environment
var mc:MovieClip;
var mcLoader:MovieClipLoader;
var rgFiles:Array = new Array ("file1.jpg", "file2.jpg", "file3.jpg");
var iCount:Number = 0;
// the main function
function main () {
	mc = createEmptyMovieClip ("mc", 1);
	mcLoader = new MovieClipLoader ();
	mcLoader.addListener (this);
	loadNext ();
};
// trap the onload error
function onLoadError () {
	loadNext ();
};
// recurse
function loadNext () {
	if (iCount < rgFiles.length) {
		mcLoader.loadClip (rgFiles [iCount], mc);
		iCount++;		
	} else {
		trace ("Where is the file! No File Found.");
	};
};
// fire
main ();
```

## How to Use

1. Put three JPEGs, file1.jpg, file2.jpg and file3.jpg
2. In the same folder, put the above script on the first frame or put is outside and do an `#include` 
3. Publish

Then you try deleting the files file1.jpg, file2.jpg and file3.jpg, one by one and re-publish in between. You won't need to update the script.
