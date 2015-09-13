function _class(id, someClass) {
	var elem = $("#" + id + "");
	if ( elem.hasClass(someClass) ) {
		elem.removeClass(someClass);
	} else {
		elem.addClass(someClass);
	}
}
