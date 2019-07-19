import * as tslib_1 from "tslib";
// This file date-picker-component.html is adopted from https://github.com/write2sv/ionic4-date-picker. Changes have been
// made on top of original source code to build functionalities and styles required for the app
import { Component, Input, QueryList, ViewChildren } from '@angular/core';
import { Calendar, Day } from 'dayspan';
import * as moment from 'moment';
import { FetchReadingService } from '../services/fetch-reading.service';
import { DatabaseService } from '../services/database.service';
import { Platform } from '@ionic/angular';
var DatePickerComponent = /** @class */ (function () {
    function DatePickerComponent(fetchReading, database, platform) {
        this.fetchReading = fetchReading;
        this.database = database;
        this.platform = platform;
        this.monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        this.dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
        this.backgroundStyle = { 'background-color': '#ffffff' };
        this.notInCalendarStyle = { 'color': '#8b8b8b', 'border-radius': '50%', 'margin': '0px', 'padding': '4px', 'width': '30px', 'height': '30px',
            'box-sizing': 'border-box', 'font-size': '14px', 'background-color': '#ffffff' };
        this.dayLabelsStyle = { 'font-weight': 500, 'font-size': '12px', 'color': '#4c8dff' };
        this.monthLabelsStyle = { 'font-size': '15px' };
        this.yearLabelsStyle = { 'font-size': '15px' };
        this.itemSelectedStyle = { 'color': '#f4f4f4 !important' };
        this.todaysItemStyle = { 'border': '3px solid #43a2ea', 'color': '#43a2ea' };
        //Calendar View on launch
        this.showView = 'calendar';
        this.years = [];
        //yearSelected and monthSelected =today's date initially
        this.yearSelected = new Date().getFullYear();
        this.monthSelected = new Date().getMonth() + 1;
        this.currentYear = new Date().getFullYear();
        this.currentMonth = new Date().getMonth() + 1;
        this.currentDay = new Date().getDate();
        this.currentDate = new Date().toISOString().split("T")[0];
        this.days_of_month = [];
        this.firstdate = "";
        this.enddate = "";
        this.currentmonth_d = "";
        //variables for daily view
        this.daySelected_s = "";
        this.daySelected_d = "";
        this.treatment_state = "";
        this.reading = "";
        this.reading_text = "";
        this.reading_text1 = "";
        this.comments = "";
        this.medication_taken = "No";
        this.medication_icon = "";
        this.amt = 0;
        this.pillno = 0;
        this.interval = 0;
        this.medication = "";
        this.reading_color = "";
        //Generate Day View:
        //default style
        this.daily_info = { reading: 0,
            medication_taken: 0,
            comment: "No Comment",
            stateID: 1,
            readingstyle: { 'color': this.fetchReading.readingcolor_l[0], 'font-size': this.fetchReading.fontsize_l[0],
                'width': '15px', 'height': '15px' },
            symbol: "" };
    }
    DatePickerComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.platform.ready().then(function () {
            _this.database.callDatabase().then(function (data) {
                _this.initOptions();
                _this.generateYears_pre();
                _this.generateYears().then(function () {
                    _this.createCalendarWeeks();
                    _this.scrollMonth(_this.yearSelected, _this.monthSelected, _this.years).then(function () {
                        _this.showView = "calendar";
                    });
                });
            });
        });
    };
    DatePickerComponent.prototype.ngAfterViewInit = function () {
        this.monthscroll.changes.subscribe(function (t) {
            document.getElementById("monthscroll").style.display = "";
        });
    };
    DatePickerComponent.prototype.initOptions = function () {
        if (this.date && this.fromDate && this.date < this.fromDate) {
            throw new Error('Invalid date input. date must be same or greater than fromDate');
        }
        if (this.date && this.toDate && this.toDate < this.date) {
            throw new Error('Invalid date input. date must be same or lesser than toDate');
        }
        if (this.toDate && this.fromDate && this.fromDate > this.toDate) {
            throw new Error('Invalid date input. from date must be lesser than or equal to toDate');
        }
        this.yearSelected = this.date ? this.date.getFullYear() : this.toDate ? this.toDate.getFullYear() : new Date().getFullYear();
        this.monthSelected = this.date ? this.date.getMonth() + 1 : this.toDate ? this.toDate.getMonth() + 1 : new Date().getMonth() + 1;
        this.dayHighlighted = this.date ? Day.fromDate(this.date) : this.toDate ? Day.fromDate(this.toDate) : Day.today();
        if (this.date) {
            this.daySelected = this.dayHighlighted;
        }
        //fetch data from database during launch
        this.fetchReading.treatmentState();
        this.fetchReading.readingMapping();
    };
    DatePickerComponent.prototype.createCalendarWeeks = function () {
        var _this = this;
        this.weeks = this.generateCalendarWeeks(Day.fromMoment(moment(this.monthSelected + '-01-' + this.yearSelected, 'MM-DD-YYYY')));
        //fetch the nearest 3 months' data
        if (this.monthSelected < 10) {
            if (this.monthSelected === 1) {
                this.firstdate = (this.yearSelected - 1) + '-12-01';
            }
            else {
                this.firstdate = this.yearSelected + '-0' + (this.monthSelected - 1).toString() + '-01';
            }
            this.currentmonth_d = this.yearSelected + "-0" + (this.monthSelected).toString();
            if (this.monthSelected == 9) {
                this.enddate = String(moment(this.yearSelected + '-' + (this.monthSelected + 1).toString(), 'YYYY-MM').endOf('month').format('YYYY-MM-DD'));
            }
            else {
                this.enddate = String(moment(this.yearSelected + '-0' + (this.monthSelected + 1).toString(), 'YYYY-MM').endOf('month').format('YYYY-MM-DD'));
            }
        }
        else {
            if (this.monthSelected === 12) {
                this.enddate = String(moment(this.yearSelected + 1 + '-01', 'YYYY-MM').endOf('month').format('YYYY-MM-DD'));
            }
            else {
                this.enddate = String(moment(this.yearSelected + '-' + (this.monthSelected + 1).toString(), 'YYYY-MM').endOf('month').format('YYYY-MM-DD'));
            }
            if (this.monthSelected == 10) {
                this.firstdate = this.yearSelected + '-0' + (this.monthSelected - 1).toString() + '-01';
            }
            else {
                this.firstdate = this.yearSelected + '-' + (this.monthSelected - 1).toString() + '-01';
            }
            this.currentmonth_d = this.yearSelected + "-" + (this.monthSelected).toString();
        }
        //call the service to read monthly data if yyyy-mm is not found in the set
        if (!(this.fetchReading.months_fetched.has(this.currentmonth_d))) {
            this.fetchReading.monthlyReading(this.firstdate, this.enddate, this.currentmonth_d).then(function () {
                console.log("data between ", _this.firstdate, _this.enddate, "read in datepicker");
            });
        }
        setTimeout(function () { document.getElementById("calendar_keys").style.display = "none"; }, 200);
    };
    DatePickerComponent.prototype.generateCalendarWeeks = function (forDay) {
        var weeks = [];
        var month = Calendar.months(1, forDay);
        var numOfWeeks = month.days.length / 7;
        var dayIndex = 0;
        for (var week = 0; week < numOfWeeks; week++) {
            var days = [];
            for (var day = 0; day < 7; day++) {
                days.push(month.days[dayIndex]);
                dayIndex++;
            }
            weeks.push(days);
        }
        return weeks;
    };
    DatePickerComponent.prototype.hasPrevious = function () {
        if (!this.fromDate) {
            return true;
        }
        var previousMonth;
        var previousYear;
        if (this.monthSelected === 1) {
            previousMonth = 11;
            previousYear = this.yearSelected - 1;
        }
        else {
            previousMonth = this.monthSelected;
            previousYear = this.yearSelected;
        }
        // The last day of previous month should be greatar than or equal to fromDate
        return new Date(previousYear, previousMonth, 0) >= this.fromDate;
    };
    DatePickerComponent.prototype.hasNext = function () {
        if (!this.toDate) {
            return true;
        }
        var nextMonth;
        var nextYear;
        if (this.monthSelected === 12) {
            nextMonth = 0;
            nextYear = this.yearSelected + 1;
        }
        else {
            nextMonth = this.monthSelected;
            nextYear = this.yearSelected;
        }
        // The first day of next month should be less than or equal to toDate
        return new Date(nextYear, nextMonth, 1) <= this.toDate;
    };
    DatePickerComponent.prototype.previous = function () {
        if (this.monthSelected === 1) {
            this.monthSelected = 12;
            this.yearSelected--;
        }
        else {
            this.monthSelected--;
        }
        this.createCalendarWeeks();
    };
    DatePickerComponent.prototype.next = function () {
        if (this.monthSelected === 12) {
            this.monthSelected = 1;
            this.yearSelected++;
        }
        else {
            this.monthSelected++;
        }
        this.createCalendarWeeks();
    };
    //Called when a day is selected from the calendar. Day is inherited format from Moment
    DatePickerComponent.prototype.selectDay = function (day) {
        if (!this.isValidDay(day)) {
            return;
        }
        this.daySelected = day;
        this.daySelected_s = day.format("YYYY-MM-DD");
        this.daySelected_d = day.format('D MMM YYYY');
        //check if the date selected is in current month. If not, return none.
        if (parseInt(day.format('M'), 10) !== this.monthSelected) {
            return;
        }
        //assign readings, medication etc. data on selected day to following variables.
        if (this.fetchReading.monthly_reading[this.daySelected_s]) {
            this.daily_info = this.fetchReading.monthly_reading[this.daySelected_s];
            this.treatment_state = this.fetchReading.state_details[this.daily_info.stateID].state;
            this.amt = this.fetchReading.state_details[this.daily_info.stateID].amt;
            this.pillno = this.fetchReading.state_details[this.daily_info.stateID].pillno;
            this.interval = this.fetchReading.state_details[this.daily_info.stateID].interval;
            this.medication = +this.amt + " mg,\n\n                        " + this.pillno + " per " + this.interval + " day(s)";
            this.medication_taken = (this.daily_info.medication_taken) ? "Yes" : "No";
        }
        else {
            //set these values if data for the day cannot be found
            this.daily_info = { reading: 0,
                medication_taken: 0,
                comment: "None",
                stateID: 1,
                readingstyle: { 'color': this.fetchReading.readingcolor_l[0], 'font-size': this.fetchReading.fontsize_l[0],
                    'width': '15px', 'height': '15px' },
                symbol: "" };
            this.treatment_state = "";
            this.reading = "";
            this.comments = "No Comment";
            this.amt = 0;
            this.pillno = 0;
            this.interval = 0;
            this.medication = "";
            this.medication_taken = "";
            this.medication_icon = "";
            document.getElementById("state_name").style.display = "none";
        }
        // if (this.medication_taken=="Yes"){
        //   // setTimeout(() => {document.getElementById("yesicon").style.display = "inline";}, 50);
        //   // setTimeout(() => {document.getElementById("noicon").style.display = "none";}, 50);
        //   // setTimeout(() => {document.getElementById("emoji-icon").innerText = "🤩";}, 50);
        // } else if (this.medication_taken=="No"){
        //   setTimeout(() => {document.getElementById("yesicon").style.display = "none";}, 50);
        //   setTimeout(() => {document.getElementById("noicon").style.display = "inline";}, 50);
        //   setTimeout(() => {document.getElementById("emoji-icon").innerText = "😷";}, 50);
        // } else{
        //   setTimeout(() => {document.getElementById("yesicon").style.display = "none";}, 50);
        //   setTimeout(() => {document.getElementById("noicon").style.display = "none";}, 50);
        //   setTimeout(() => {document.getElementById("emoji-icon").innerText = "🤔";}, 50);
        // }
        this.reading = this.daily_info.symbol.trim();
        this.reading_text1 = this.fetchReading.reading_mapping[this.daily_info.reading];
        this.reading_text = this.fetchReading.reading_text[this.daily_info.reading];
        this.comments = (this.daily_info.comment === "") ? "No Comment" : this.daily_info.comment;
        this.reading_color = this.fetchReading.readingcolor_l[this.daily_info.reading];
        this.square_color = { 'border': '7px solid ' + this.reading_color, 'color': this.reading_color };
        //change display to daily view
        this.showView = 'dayview';
        console.log("toms debug print");
        console.log("reading");
        console.log(this.reading);
        console.log(this);
        // test data
        // this.reading = "-";
        // this.medImage = "checked";
        // this.medication = "30mg, twice every 2 days";
        // this.treatmentStr = "Maintenance";
        // this.comments = "None";
        // this.treatment_state = "maintence";
        // get things for printing
        if (this.reading == "-") {
            this.readingSquareIcon = "neg-sq";
        }
        else if (this.reading == "T") {
            this.readingSquareIcon = "trace-sq";
        }
        else if (this.reading == "+") {
            this.readingSquareIcon = "oneplus-sq";
        }
        else if (this.reading == "++") {
            this.readingSquareIcon = "twoplus-sq";
        }
        else if (this.reading == "+++") {
            this.readingSquareIcon = "threeplus-sq";
        }
        else if (this.reading == "++++") {
            this.readingSquareIcon = "fourplus-sq";
        }
        else {
            this.readingSquareIcon = "no-reading";
        }
        // get treatment_state_string
        if (this.treatment_state == "main") {
            this.treatment_state = "maintenance";
        }
        // get medication image and string
        if (this.daily_info["medication_taken"] == 1) {
            this.medImage = "tick";
        }
        else {
            this.medImage = "cross";
        }
    };
    DatePickerComponent.prototype.showMonthView = function () {
        setTimeout(function () { document.getElementById("monthscroll").style.display = "none"; }, 200);
        this.showView = 'month';
    };
    DatePickerComponent.prototype.hasYearSelection = function () {
        if (!this.toDate || !this.fromDate) {
            return true;
        }
        return this.toDate.getFullYear() !== this.fromDate.getFullYear();
    };
    //Generate the Year View
    DatePickerComponent.prototype.showYearView = function () {
        var _this = this;
        this.generateYears_pre();
        this.generateYears().then(function () {
            setTimeout(function () { document.getElementById("monthscroll").style.display = "none"; }, 200);
            _this.showView = 'year';
        });
    };
    DatePickerComponent.prototype.generateYears_pre = function () {
        var startYear = this.yearSelected - 5;
        if (startYear % 10 !== 0) {
            startYear = startYear - (startYear % 10);
        }
        var endYear = startYear + 19;
        this.startYear = startYear;
        this.endYear = endYear;
    };
    DatePickerComponent.prototype.generateYears = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.years = [];
            if (_this.fromDate && _this.startYear < _this.fromDate.getFullYear()) {
                _this.startYear = _this.fromDate.getFullYear();
            }
            if (_this.toDate && _this.endYear > _this.toDate.getFullYear()) {
                _this.endYear = _this.toDate.getFullYear();
            }
            for (var i = _this.startYear; i <= _this.endYear; i++) {
                _this.years.push(i);
            }
            resolve(_this.years);
        });
    };
    DatePickerComponent.prototype.showPreviousYears = function () {
        this.endYear = this.startYear - 1;
        this.startYear = this.endYear - 19;
        this.generateYears();
    };
    DatePickerComponent.prototype.showNextYears = function () {
        this.startYear = this.endYear + 1;
        this.endYear = this.startYear + 19;
        this.generateYears();
    };
    DatePickerComponent.prototype.hasPreviousYears = function () {
        if (!this.fromDate) {
            return true;
        }
        return this.startYear > this.fromDate.getFullYear();
    };
    DatePickerComponent.prototype.hasNextYears = function () {
        if (!this.toDate) {
            return true;
        }
        return this.endYear < this.toDate.getFullYear();
    };
    //after a month is selected in the 'Month View'
    DatePickerComponent.prototype.selectMonth = function (month) {
        var _this = this;
        if (!this.isValidMonth(month - 1)) {
            return;
        }
        this.monthSelected = month;
        this.createCalendarWeeks();
        this.scrollMonth(this.yearSelected, this.monthSelected, this.years).then(function () {
            _this.showView = 'calendar';
            _this.monthscroll.changes.subscribe(function (t) {
                if (_this.monthscroll.last) {
                    document.getElementById("monthscroll").style.display = "";
                }
                ;
            });
        });
        // setTimeout(() => {
        //   this.showView = 'calendar';
        // }, 400);
    };
    //after a year is selected in the 'Year View'
    DatePickerComponent.prototype.selectYear = function (year) {
        var _this = this;
        this.yearSelected = year;
        this.createCalendarWeeks();
        this.scrollMonth(this.yearSelected, this.monthSelected, this.years).then(function () {
            _this.showView = 'calendar';
            setTimeout(function () { document.getElementById("monthscroll").style.display = ""; }, 200);
        });
        // setTimeout(() => {
        //   this.showView = 'calendar';
        // }, 400);
    };
    //after a month is selected in the horizontal scrollbar in "Calendar View"
    DatePickerComponent.prototype.selectMonthnYear = function (month, year) {
        var _this = this;
        if (!this.isValidMonth(month - 1)) {
            return;
        }
        this.monthSelected = month;
        this.yearSelected = year;
        this.createCalendarWeeks();
        setTimeout(function () {
            _this.showView = 'calendar';
        }, 200);
    };
    DatePickerComponent.prototype.resetView = function () {
        var _this = this;
        this.scrollMonth(this.yearSelected, this.monthSelected, this.years).then(function () {
            _this.showView = 'calendar';
            setTimeout(function () { document.getElementById("monthscroll").style.display = ""; }, 200);
        });
    };
    DatePickerComponent.prototype.isToday = function (day) {
        return this.yearSelected === this.currentYear && this.monthSelected === this.currentMonth && this.currentDay === day;
    };
    DatePickerComponent.prototype.isValidDay = function (day) {
        if (!this.toDate && !this.fromDate) {
            return true;
        }
        if (this.toDate && this.fromDate) {
            return day.toDate() >= this.fromDate && day.toDate() <= this.toDate;
        }
        if (this.toDate) {
            return day.toDate() <= this.toDate;
        }
        if (this.fromDate) {
            return day.toDate() >= this.fromDate;
        }
    };
    DatePickerComponent.prototype.isValidMonth = function (index) {
        if (this.toDate && this.toDate.getFullYear() !== this.yearSelected && this.fromDate && this.fromDate.getFullYear() !== this.yearSelected) {
            return true;
        }
        if (!this.toDate && !this.fromDate) {
            return true;
        }
        if (this.fromDate && !this.toDate) {
            return new Date(this.yearSelected, index, 1) >= this.fromDate;
        }
        if (this.toDate && !this.fromDate) {
            return new Date(this.yearSelected, index, 1) <= this.toDate;
        }
        return new Date(this.yearSelected, index, 1) >= this.fromDate &&
            new Date(this.yearSelected, index, 1) <= this.toDate;
    };
    DatePickerComponent.prototype.showKeys = function () {
        var x = document.getElementById("calendar_keys");
        if (x.style.display === "none") {
            x.style.display = "block";
        }
        else {
            x.style.display = "none";
        }
    };
    //Horizonal scrollbar for selecting days in the daily view
    DatePickerComponent.prototype.CreateDayScrollBar = function (day) {
        var _this = this;
        //create the day scrollbar
        this.days_of_month = [];
        var month = day.format('YYYY-MM');
        var count = moment(month).daysInMonth();
        for (var i = 1; i < count + 1; i++) {
            this.days_of_month.push(moment(month).date(i));
        }
        //scroll it to the selected day
        setTimeout(function () {
            var i = 0;
            var j = 0;
            var l = document.getElementById("dayscroll").scrollWidth;
            var p = +l / (_this.days_of_month.length);
            for (i = 0; i < _this.days_of_month.length; i++) {
                if (_this.days_of_month[i].format("YYYY-MM-DD") == day.format("YYYY-MM-DD")) {
                    document.getElementById('dayscroll').scrollLeft = (i * p - p);
                }
                ;
            }
        }, 200);
    };
    //scroll the month scrollbar to the selected month and year (in calendarview)
    DatePickerComponent.prototype.scrollMonth = function (Year, Month, years) {
        var _this = this;
        return new Promise(function (resolve) {
            var i = 0;
            var j = 0;
            setTimeout(function () {
                var l = document.getElementById("monthscroll").scrollWidth;
                var p = +l / (years.length * 12);
                // console.log("years ",years);
                // console.log("years length",years.length);
                // console.log("l:",l);
                for (i = 0; i < years.length; i++) {
                    if (years[i] == Year) {
                        for (j = 0; j < _this.monthLabels.length; j++) {
                            if (_this.monthLabels[j] == _this.monthLabels[Month - 1]) {
                                document.getElementById('monthscroll').scrollLeft = ((i * 12 + j) * p - p);
                            }
                            ;
                        }
                    }
                }
                // console.log("scrollMonth called,",p);
            }, 300);
            resolve();
        });
    };
    //Style
    DatePickerComponent.prototype.getreading = function (day, content) {
        var readingstyle;
        var readsymbol = "";
        //change the display style per reading result
        readingstyle = { 'color': this.fetchReading.readingcolor_l[0], 'font-size': this.fetchReading.fontsize_l[0],
            'width': '15px', 'height': '15px'
        };
        readsymbol = this.fetchReading.symbol_l[0];
        //fetch the style per day from monthly_reading object; 
        var fetch_date = day.format("YYYY-MM-DD");
        if (fetch_date in this.fetchReading.monthly_reading) {
            readingstyle = this.fetchReading.monthly_reading[fetch_date].readingstyle;
            readsymbol = this.fetchReading.monthly_reading[fetch_date].symbol;
        }
        //function returns either style or the in-line symbol
        if (content == 's') {
            return readingstyle;
        }
        else {
            return readsymbol;
        }
    };
    DatePickerComponent.prototype.getDayStyle = function (day, content) {
        var style = {};
        var fetch_date = day.format("YYYY-MM-DD");
        // by default treatment state="main" (i.e. no relapse or remission)
        var state = "maintenance";
        if (fetch_date in this.fetchReading.monthly_reading) {
            state = this.fetchReading.state_details[this.fetchReading.monthly_reading[fetch_date].stateID].state;
        }
        style = { 'border-radius': '50%', 'margin': '0px', 'padding': '4px', 'width': '30px', 'height': '30px',
            'box-sizing': 'border-box', 'font-size': '12px',
            'background-color': this.fetchReading.treatmentcolor_l[state] };
        if (this.isToday(day.dayOfMonth)) {
            style = tslib_1.__assign({}, style, this.todaysItemStyle);
        }
        if (this.daySelected && day.dayIdentifier === this.daySelected.dayIdentifier) {
            style = tslib_1.__assign({}, style, this.itemSelectedStyle);
        }
        return style;
    };
    DatePickerComponent.prototype.getMonthStyle = function (index) {
        var style = {};
        style = tslib_1.__assign({}, style, this.monthLabelsStyle);
        if (index === this.currentMonth - 1) {
            style = tslib_1.__assign({}, style, this.todaysItemStyle);
        }
        if (index === this.monthSelected - 1) {
            style = tslib_1.__assign({}, style, this.itemSelectedStyle);
        }
        return style;
    };
    DatePickerComponent.prototype.getYearStyle = function (year) {
        var style = {};
        style = tslib_1.__assign({}, style, this.yearLabelsStyle);
        if (year === this.currentYear) {
            style = tslib_1.__assign({}, style, this.todaysItemStyle);
        }
        if (year === this.yearSelected) {
            style = tslib_1.__assign({}, style, this.itemSelectedStyle);
        }
        return style;
    };
    tslib_1.__decorate([
        ViewChildren('monthscroll'),
        tslib_1.__metadata("design:type", QueryList)
    ], DatePickerComponent.prototype, "monthscroll", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], DatePickerComponent.prototype, "monthLabels", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], DatePickerComponent.prototype, "dayLabels", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Date)
    ], DatePickerComponent.prototype, "date", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Date)
    ], DatePickerComponent.prototype, "fromDate", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Date)
    ], DatePickerComponent.prototype, "toDate", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], DatePickerComponent.prototype, "backgroundStyle", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], DatePickerComponent.prototype, "notInCalendarStyle", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], DatePickerComponent.prototype, "dayLabelsStyle", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], DatePickerComponent.prototype, "monthLabelsStyle", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], DatePickerComponent.prototype, "yearLabelsStyle", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], DatePickerComponent.prototype, "itemSelectedStyle", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], DatePickerComponent.prototype, "todaysItemStyle", void 0);
    DatePickerComponent = tslib_1.__decorate([
        Component({
            selector: 'ionic-calendar-date-picker',
            templateUrl: 'date-picker-component.html',
            styleUrls: ['date-picker-component.scss']
        }),
        tslib_1.__metadata("design:paramtypes", [FetchReadingService, DatabaseService, Platform])
    ], DatePickerComponent);
    return DatePickerComponent;
}());
export { DatePickerComponent };
//# sourceMappingURL=date-picker-component.js.map