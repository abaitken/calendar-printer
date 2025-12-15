import { Calendar } from './calendar.js';

function ViewModel()
{
    var self = this;
    
    const currentYear = new Date().getFullYear();
    self.calendar = new Calendar(currentYear);
    
    self.Init = function ()
    {
        ko.applyBindings(self);
    };
}

var root = new ViewModel();
root.Init();
