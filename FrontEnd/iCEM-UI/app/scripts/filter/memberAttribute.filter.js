'use strict';

app.filter('attrNameFilter', function () {
	return function (number, scope) {
		for (var i = 0, item; item = scope.attributeList[i]; i++) {
			if (item.attributeId == number) {
				return item.name;
			}
		}

	}
});