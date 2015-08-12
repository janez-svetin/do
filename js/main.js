// helper for local storage to easier saving of objects into local storage
Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
// helper for local storage for easier retrieving of objects from local storage
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}

var milisecondsPerDay = 1000 * 60 * 60 * 24;

// startDate and endDate are javascript Date objects
function dateDiffInDays(startDate, endDate) {
  // Discard the time and time-zone information.
  var utc1 = Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  var utc2 = Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

  return Math.floor((utc2 - utc1) / milisecondsPerDay);
}

// global _do object
var _do = {};

jQuery(document).ready(function($) {
  _do = localStorage.getObj('_do');
  // does not yet exists in local storage, create one with default values
  if (_do === null) {
    _do = {};
    _do.title = 'Enter calendar name';
    _do.counter = 0;
    _do.date = new Date();
    localStorage.setObj('_do', _do);
  } else {
    var currDate = new Date();
    // enable the button if coming back after more than 1 or next day OR the counter is reset at 0
    if (dateDiffInDays(new Date(_do.date), currDate) >= 1 || _do.counter === 0) {
      $('#do-Button--counter')
        .attr('disabled', false)
        .removeClass('is-disabled');
    } else {
      $('#do-Button--counter')
        .attr('disabled', true)
        .addClass('is-disabled')
        .val('DONE FOR TODAY, DO NOT FORGET ABOUT TOMORROW;)');
    }
  }

  // set title to current value in local storage
  $('#do-Header-heading').html(_do.title);

  //set counter to current value in local storage
  $('#do-Number--counter').html(_do.counter);

  $('#do-Button--counter').on('click', function() {
    var currDate = new Date();
    // if the difference between current day and the day last clicked is bigger than 1 then reset the counter
    if (dateDiffInDays(new Date(_do.date), currDate) > 1) {
      _do.counter = 1;
    } else { // day difference is one, allow counting
      _do.counter++;
      _do.date = new Date();
      $('#do-Number--counter').html(_do.counter);
      $(this)
        .attr('disabled', true)
        .addClass('is-disabled')
        .val('DONE FOR TODAY, DO NOT FORGET ABOUT TOMORROW;)');
      localStorage.setObj('_do', _do);
    }
  });

  $('#do-Header-heading').on('focus', function() {
    before = $(this).html();
  }).on('blur keyup paste', function() {
    if (before != $(this).html()) { $(this).trigger('change'); }
  });

  $('#do-Header-heading').on('change', function() {
    _do.title = $('#do-Header-heading').html();
    localStorage.setObj('_do', _do);
  });
});