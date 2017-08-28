'use strict';

app.filter('mediaNameFilter', function () {
	return function (id, scope) {
		for (var i = 0; i< scope.mediaList.length; i++) {
			if (scope.mediaList[i].mediaId == id) {
				return scope.mediaList[i].name;
			}
		}

	}
});