define(function (require) {

  'use strict';

  /**
   * Module dependencies
   */

  var defineComponent = require('flight/lib/component');

  /**
   * Module exports
   */

  return defineComponent(schedule);

  /**
   * Module function
   */

  function schedule() {
    this.defaultAttrs({
      tickInterval: 10 // seconds
    });

    this.after('initialize', function () {
      this.tasks = this.attr.tasks || [];

      this.on('schedule-task', this.handleScheduleTask);
      this.on('schedule-cancel', this.handleScheduleCancel);
      this.on('schedule-tick', this.handleScheduleTick);

      setInterval(this.tick.bind(this), this.attr.tickInterval * 1000);
    });

    this.tick = function () {
      var now = Date.now();

      this.trigger('schedule-tick', {
        now: now
      });
    };

    this.handleScheduleCancel = function (e, data) {
       this.tasks = this.tasks.filter(function (task) {
         return task.eventName !== data.eventName;
       });
    };

    this.handleScheduleTick = function (e, data) {
      var now = data.now;

      this.tasks.forEach(function (task) {
        // if this is a periodic task
        if (task.period) {
          // and it has not been fired
          // or it was last fired more than period ms ago
          if (!task.lastExecuted || now > task.lastExecuted + task.period) {
            this.executeTask(task);
          }
        }
      }, this);
    };

    this.handleScheduleTask = function (e, data) {
      var task = {
        eventName: data.eventName,
        data: data.data,
        period: data.period * 1000, // convert to ms
        immediate: data.immediate,
        lastExecuted: null
      };

      this.tasks.push(task);

      if (task.immediate) {
        this.executeTask(task);
      }
    };

    this.executeTask = function (task) {
      this.trigger(task.eventName, task.data);
      task.lastExecuted = Date.now();
    };
  }

});
