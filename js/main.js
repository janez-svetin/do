// helper for local storage to easier saving of objects into local storage
Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
// helper for local storage for easier retrieving of objects from local storage
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}

var _MS_PER_DAY = 1000 * 60 * 60 * 24;

// a and b are javascript Date objects
function dateDiffInDays(a, b) {
  // Discard the time and time-zone information.
  var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

// global _do object
var _do = {};

jQuery(document).ready(function($) {
  _do = localStorage.getObj('_do');
  if (_do === null) { // does not yet exists in local storage, create one with default values
    _do = {};
    _do.title = 'Enter calendar name';
    _do.counter = 0;
    _do.date = new Date();
    localStorage.setObj('_do', _do);
  } else {
    var currDate = new Date();
    if (dateDiffInDays(new Date(_do.date), currDate) >= 1 || _do.counter === 0) { // enable the button if coming back after more than 1 or next day OR the counter is reset at 0
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
  $('#do-Header').html(_do.title);

  //set counter to current value in local storage
  $('#do-Number--counter').html(_do.counter);

  $('#do-Button--counter').on('click', function() {
    var currDate = new Date();
    if (dateDiffInDays(new Date(_do.date), currDate) > 1) { // if the difference between current day and the day last clicked is bigger than 1 then reset the counter
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

  $('#do-Header').on('focus', function() {
    before = $(this).html();
  }).on('blur keyup paste', function() {
    if (before != $(this).html()) { $(this).trigger('change'); }
  });

  $('#do-Header').on('change', function() {
    _do.title = $('#do-Header').html();
    localStorage.setObj('_do', _do);
  });
});