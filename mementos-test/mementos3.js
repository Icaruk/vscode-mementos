
const extensionName = "Memento"; // normal comment


if (extensionName.length > 10) { //@mem:todo refactor create getExtensionNameLength
	console.log("long name"); //@mem:deleteme console.log
} else {
	console.log("short name"); //@mem:deleteme console.log
};

// @mem:bm mid

// Normal comment
if (true) {
	console.log("true"); //@mem:delete console.log
};

// @mem:bm bottom