'use strict';

app.factory('ValidateService', function () {

    var ValidateService = {};
    ValidateService.dateAttr = null;
    ValidateService.request = null;
    ValidateService.referrer = null;
    // ValidateService.isEmptyAll = function(){
    //     return this.dateAttr || this.request || this.referrer;
    // };
    ValidateService.isEmptyDateAttr = function (model) {
        var flag = false;
        if (!Boolean(model.dateAttr.startDate) && Boolean(model.dateAttr.endDate)) {
            alert("[" + i18n.t("icem.scheduler.start.date") + "] "
                + i18n.t("icem.mandatory"));
            flag = true;
        } else if (Boolean(model.dateAttr.startDate) && !Boolean(model.dateAttr.endDate)) {
            alert("[" + i18n.t("icem.scheduler.end.date") + "] "
                + i18n.t("icem.mandatory"));
            flag = true;
        } else if (model.dateAttr.startDate && model.dateAttr.endDate && model.dateAttr.startDate > model.dateAttr.endDate) {
            alert(i18n.t("icem.items.date.compare"));
            flag = true;
        } else if ((model.dateAttr.fromHour === null && model.dateAttr.toHour !== null) || (model.dateAttr.fromHour !== null && model.dateAttr.toHour === null)) {
            alert(i18n.t("icem.items.hour.compare"));
            flag = true;
        } else if (model.dateAttr.fromHour === model.dateAttr.toHour && (model.dateAttr.toHour !== null && model.dateAttr.fromHour !== null)) {
            alert(i18n.t("icem.items.hour.compare.same"));
            flag = true;
        } else if (model.dateAttr.fromHour && model.dateAttr.toHour && model.dateAttr.fromHour > model.dateAttr.toHour) {
            alert(i18n.t("icem.items.hour.compare.Greater"));
            flag = true;
        }
        this.dateAttr = flag;
        return flag;
    };

    ValidateService.isEmptyRequest = function (model) {
        var flag = false;
        if (this.isEmptyPair(model.request.page, model.request.pageOperator)) {
            alert("[" + i18n.t("icem.recommend.rule.request.site") + "] "
                + i18n.t("icem.mandatory"));
            flag = true;
        } else if (this.isEmptyPair(model.request.url, model.request.urlOperator)) {
            alert("[" + i18n.t("icem.recommend.rule.request.page") + "] "
                + i18n.t("icem.mandatory"));
            flag = true;
        }
        this.request = flag;
        return flag;
    };

    ValidateService.isEmptyScore = function (model) {
        var flag = false;
        if (this.isEmptyPair(model.scoreAttr.score, model.scoreAttr.scoreOperator)) {
            alert("[" + i18n.t("icem.recommend.rule.score.value") + "] "
                + i18n.t("icem.mandatory"));
            flag = true;
        } else if (this.isEmptyPair(model.scoreAttr.percent, model.scoreAttr.percentOperator)) {
            alert("[" + i18n.t("icem.recommend.rule.score.percentage") + "] "
                + i18n.t("icem.mandatory"));
            flag = true;
        } else if (this.isEmptyPair(model.scoreAttr.ranking, model.scoreAttr.rankingOperator)) {
            alert("[" + i18n.t("icem.recommend.rule.score.rank") + "] "
                + i18n.t("icem.mandatory"));
            flag = true;
        }
        this.request = flag;
        return flag;
    };

    ValidateService.isEmptyReferrer = function (model) {
        var flag = false;
        if (this.isEmptyPair(model.referrer.referPage, model.referrer.referPageOperator)) {
            alert("[" + i18n.t("icem.recommend.rule.request.page") + "] "
                + i18n.t("icem.mandatory"));
            flag = true;
        } else if (this.isEmptyPair(model.referrer.referSite, model.referrer.referSiteOperator)) {
            alert("[" + i18n.t("icem.recommend.rule.request.site") + "] "
                + i18n.t("icem.mandatory"));
            flag = true;
        }
        this.referrer = flag;
        return flag;
    };

    ValidateService.isEmptyPair = function (a, b) {
        var flag = false;
        if (a === "") { a = null }
        if (b === "") { a = null }
        if ((a !== null && b === null) || (a === null && b !== null)) {
            flag = true;
        }
        return flag;
    };

    // all input field
    ValidateService.isEmptyInputAll = function (icemStr, model) {
        var flag = false;
        for (var prop in model) {
            if (!model[prop]) {
                alert(" [" + i18n.t(icemStr + prop) + "] "
                    + i18n.t("icem.mandatory"));
                flag = true;
                break;
            }
        }
        return flag;
    };

    // certain input fields
    ValidateService.isEmptyInput = function (strArray, modelArray) {
        var flag = false;
        for (var i = 0; i < modelArray.length; i++) {
            if (!modelArray[i] || !Boolean(modelArray[i])) {
                alert(" [" + i18n.t(strArray[i]) + "] "
                    + i18n.t("icem.mandatory"));
                flag = true;
                break;
            }
        }
        return flag;
    };

    ValidateService.isValid = {
        checkArray:  function (inputArray, alertArray) {
            var flag = false;
            for (var i = 0; i < inputArray.length; i++) {
                if (!inputArray[i] || !this.checkCharacter(inputArray[i])) {
                    alert(" [" + i18n.t(alertArray[i]) + "] "
                        + i18n.t("icem.dontAllowSpecial"));
                    flag = true;
                    break;
                }
            }
            return flag;
        },
        checkCharacter : function(str){
            return !/[~`!#$%\^@&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(str);
        }
    }

    return ValidateService;

});