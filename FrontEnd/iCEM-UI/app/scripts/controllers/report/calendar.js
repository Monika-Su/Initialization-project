'use strict';

app.factory('calendar', function ($scope) {

	var reportMinDate = '2014/01/01';
	var reportStartDateInterval = 13;
	var dateFormat = 'YYYY-MM-DD';

//==================================== date picker ==============================================S

    //TODO: cached me?
    function getReportRange(){
    	var picker = $('#reportrange').data('daterangepicker');
    	var sDate = new Date(picker.startDate.format(dateFormat));
    	var eDate = new Date(picker.endDate.format(dateFormat));
    	sDate.setHours(0);
    	eDate.setHours(23);
    	eDate.setMinutes(59);
    	eDate.setSeconds(59);
    	eDate.setMilliseconds(999);

    	var range = {};
    	range.from = sDate.getTime();
    	range.to = eDate.getTime();
    	return range;
    }

    function initDatePicker(){
    	var cb = function(start, end, label) {
  	      $('#reportrange span').html(start.format(dateFormat) + ' - ' + end.format(dateFormat));
  	    };

  	    var optionSet = {
  	      startDate: moment().subtract('days', reportStartDateInterval),
  	      endDate: moment(),
  	      minDate: reportMinDate,
  	      //maxDate: moment(),
  	      dateLimit: { days: 2*365 },
  	      showDropdowns: true,
  	      showWeekNumbers: true,
  	      timePicker: false,
  	      timePickerIncrement: 1,
  	      timePicker12Hour: true,
  	      ranges: {},
  	      opens: 'left',
  	      buttonClasses: ['btn btn-default'],
  	      applyClass: 'btn-small btn-primary',
  	      cancelClass: 'btn-small',
  	      format: dateFormat,
  	      separator: ' to ',
  	      locale: {
  	          applyLabel: i18n.t("reportrange.submit"),
  	          cancelLabel: i18n.t("reportrange.clear"),
  	          fromLabel: i18n.t("reportrange.dateFrom"),
  	          toLabel: i18n.t("reportrange.dateTo"),
  	          customRangeLabel: i18n.t("reportrange.custom"),
  	          daysOfWeek: [i18n.t("reportrange.daysOfWeek1"), i18n.t("reportrange.daysOfWeek2"), i18n.t("reportrange.daysOfWeek3"),
  	                       i18n.t("reportrange.daysOfWeek4"), i18n.t("reportrange.daysOfWeek5"), i18n.t("reportrange.daysOfWeek6"),
  	                       i18n.t("reportrange.daysOfWeek7")],
  	          monthNames: [i18n.t("reportrange.month1"), i18n.t("reportrange.month2"), i18n.t("reportrange.month3"),
  	                       i18n.t("reportrange.month4"), i18n.t("reportrange.month5"), i18n.t("reportrange.month6"),
  	                       i18n.t("reportrange.month7"), i18n.t("reportrange.month8"), i18n.t("reportrange.month9"),
  	                       i18n.t("reportrange.month10"), i18n.t("reportrange.month11"), i18n.t("reportrange.month12")],
  	          firstDay: 1
  	      }
  	    };

  	    var text = i18n.t("reportrange.today");
  	    optionSet.ranges[text] = [moment(), moment()];
  		text = i18n.t("reportrange.yesterday");
  		optionSet.ranges[text] = [moment().subtract('days', 1), moment().subtract('days', 1)];
  		text = i18n.t("reportrange.last7days");
  		optionSet.ranges[text] = [moment().subtract('days', 6), moment()];
  		text = i18n.t("reportrange.last30days");
  		optionSet.ranges[text] = [moment().subtract('days', 29), moment()];
  		text = i18n.t("reportrange.thisMonth");
  		optionSet.ranges[text] = [moment().startOf('month'), moment().endOf('month')];
  		text = i18n.t("reportrange.lastMonth");
  		optionSet.ranges[text] = [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')];
  		//js will check ranges[text][1] < 'maxDate', so assign it at last
  		optionSet['maxDate'] = moment();

  	    $('#reportrange span').html(moment().subtract('days', reportStartDateInterval).format(dateFormat) + ' - ' + moment().format(dateFormat));

  	    $('#reportrange').daterangepicker(optionSet, cb);

  	    //$('#reportrange').on('apply.daterangepicker', drawChart);
    }


    //==================================== date picker ==============================================END



});
