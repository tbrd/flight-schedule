# flight-schedule

[![Build Status](https://secure.travis-ci.org/<username>/flight-schedule.png)](http://travis-ci.org/<username>/flight-schedule)

A [Flight](https://github.com/twitter/flight) component for scheduling periodic events

## Installation

```bash
bower install --save flight-schedule
```

## Example

Initialize & specify tick interval

```javascript
var schedule = require('lib/schedule.js');
schedule.attachTo(document, {
  tickInterval: 10 // seconds
});
```

Listen for tick events

```javascript
this.on('schedule-tick', this.doSomething);
```

Schedule periodic tasks

```javascript
this.trigger('schedule-task', {
  eventName: 'example-event', // event to be triggered
  period: 2, // seconds
  immediate: true // execute event immediately when task is added
}
```

Cancel periodic tasks

```javascript
this.trigger('schedule-cancel', {
  eventName: 'example-event'
});
```

## Development

Development of this component requires [Bower](http://bower.io), and preferably
[Karma](http://karma-runner.github.io) to be globally installed:

```bash
npm install -g bower karma
```

Then install the Node.js and client-side dependencies by running the following
commands in the repo's root directory.

```bash
npm install
bower install
```

To continuously run the tests in Chrome and Firefox during development, just run:

```bash
karma start
```

## Contributing to this project

Anyone and everyone is welcome to contribute. Please take a moment to
review the [guidelines for contributing](CONTRIBUTING.md).

* [Bug reports](CONTRIBUTING.md#bugs)
* [Feature requests](CONTRIBUTING.md#features)
* [Pull requests](CONTRIBUTING.md#pull-requests)
