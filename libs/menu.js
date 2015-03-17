function _class(id, clas) {
	var elem = $("#" + id + "");
	if ( elem.hasClass(clas) ) {
		elem.removeClass(clas);
	} else {
		elem.addClass(clas);
	}
}
