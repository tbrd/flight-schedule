'use strict';

describeComponent('lib/schedule', function () {

  // Initialize the component and attach it to the DOM
  beforeEach(function () {
    setupComponent();
  });

  it('should be defined', function () {
    expect(this.component).toBeDefined();
  });

  describe('schedule-tick', function () {
    beforeEach(function () {
      this.spy = spyOnEvent(document, 'schedule-tick');
    });

    it('should be triggered every n ms', function () {
      setupComponent({
        tickInterval: 0.02 // seconds - 20 ms
      });

      waits(50);

      runs(function () {
        expect(this.spy.callCount).toBe(2);
      });
    })
  });

  describe('schedule-task', function () {
    beforeEach(function () {
      this.spy = spyOnEvent(document, 'test-event');
    });

    it('should add task to task list', function () {
      this.$node.trigger('schedule-task', {
        eventName: 'test-event',
        data: {
          test: true
        },
        period: 2 // seconds
      });

      expect(this.component.tasks).toEqual([
        {
          eventName: 'test-event',
          data: {
            test: true
          },
          period: 2000,
          lastExecuted: null
        }
      ]);

    });

    it('should fire task on next tick if period has elapsed', function () {

      var now = Date.now();

      this.component.tasks = [
        {
          eventName: 'test-event',
          data: {
            test: true
          },
          period: 10,
          lastExecuted: now - 100
        }
      ];

      expect(this.spy.callCount).toBe(0);

      this.$node.trigger('schedule-tick', {
        now: now
      });

      expect(this.spy.callCount).toBe(1);
      expect(this.spy.mostRecentCall.data).toEqual({
        test: true
      });
    });


    it('should not fire task on next tick if period has not elapsed', function () {

      var now = Date.now();

      this.component.tasks = [
        {
          eventName: 'test-event',
          period: 100,
          lastExecuted: now - 10
        }
      ];

      this.$node.trigger('schedule-tick', {
        now: now
      });

      expect(this.spy.callCount).toBe(0);
    });

    it('should fire immediately', function () {
      this.$node.trigger('schedule-task', {
        eventName: 'test-event',
        period: 2,
        immediate: true
      });

      expect(this.spy.callCount).toBe(1)
    });
  });

  describe('schedule-cancel', function () {
    beforeEach(function () {
      this.spy = spyOnEvent(document, 'test-event');
    });

    it('should not fire event after cancel', function () {

      var now = Date.now();

      this.component.tasks = [
        {
          eventName: 'test-event',
          period: 10,
          lastExecuted: now - 100,
          immediate: false
        }
      ];

      this.$node.trigger('schedule-cancel', {
        eventName: 'test-event'
      });

      this.$node.trigger('schedule-tick', {
        now: now
      });

      expect(this.spy).not.toHaveBeenTriggeredOn(document);
    });
  });

});
