function _class(id, hideClass) {
	var elem = $("#" + id + "");
	if ( elem.hasClass(hideClass) ) {
		elem.removeClass(hideClass);
	} else {
		elem.addClass(hideClass);
	}
}
