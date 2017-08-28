'use strict';

app.filter('categoryNameFilter', function () {
	return function (id, scope) {
		for (var i = 0; i< scope.categoryList.length; i++) {
			if (scope.categoryList[i].categoryId == id) {
				return scope.categoryList[i].name;
			}
		}
	}
});