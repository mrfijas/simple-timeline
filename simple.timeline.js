const simpleTimeline = {
    init: function (options) {
        this.initOptions(options);
        this.cacheDOMElements();
        this.bindEvents();
        this.render();
    },

    initOptions: function (options) {
        _.extend(this, options);
        this.$el = $(this.el);
    },

    cacheDOMElements: function () {
        this.$dateFrom = $('#date-from', this.$el);
        this.$dateTo = $('#date-to', this.$el);
        this.$timeline = $('.timeline', this.$el);
    },

    bindEvents: function () {
        this.$dateFrom.on('change', this.render.bind(this));
        this.$dateTo.on('change', this.render.bind(this));
    },

    render: function () {
        this.updateNumbers();
        this.$timeline.empty();

        const width = 100 / this.totalDays + '%';
        for (var i = 0; i < this.totalDays; i++) {
            const date = moment(this.dateFrom).add(i, 'days');
            const $tick = this.getTick(i, date);
            $tick.width(width);
            this.$timeline.append($tick);
        }
    },

    getTick: function (index, date) {
        const $tick = $('<div class="tick"/>');

        if (this.isFirstDayOfMonth(date)) {
            $tick.addClass('tick--first-of-month');
        }

        if (!this.shouldRenderTickLabel(index, date)) {
            return $tick;
        }

        var label = '<span class="date">' + date.date() + '</span>';

        if (this.isFirstDayOfMonth(date)) {
            label += '<span class="month">' + date.format('MMMM') + '</span>';
        }

        if (this.isLastDay(index)) {
            label = date.date() + '<span class="month">Today</span>';
        }

        return $tick.html('<span>' + label + '</span>');

    },

    shouldRenderTickLabel: function (index, date) {
        if (this.isFirstDay(index) || this.isLastDay(index)) {
            return true;
        }

        if ([1, 7, 14, 21, 28].indexOf(date.date()) !== -1) {
            return !this.isSecondDay(index) && !this.isPenultimateDay(index);
        }

        return false;
    },

    isFirstDay: function (index) {
        return index === 0;
    },

    isSecondDay: function (index) {
        return index === 1;
    },

    isPenultimateDay: function (index) {
        return index === this.totalDays - 2;
    },

    isLastDay: function (index) {
        return index === this.totalDays - 1;
    },

    isFirstDayOfMonth: function (date) {
        return date.date() === 1;
    },

    updateNumbers: function () {
        this.dateFrom = moment(this.$dateFrom.val());
        this.dateTo = moment(this.$dateTo.val());
        this.totalDays = this.dateTo.diff(this.dateFrom, 'days') + 1;
    }
};

simpleTimeline.init({
    el: $('.timeline-wrapper')
});