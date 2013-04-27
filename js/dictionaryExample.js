
var DictionaryExample = function(form) {

  this.baseUrl = 'http://api.pearson.com/v2/dictionaries';
  this.apikey = 'your_api_key'

  var self = this;
  self.entriesTemplate = Handlebars.compile($("#entries-template").html());
  self.entryPartial = Handlebars.compile($("#entry-partial").html());
  Handlebars.registerPartial("entry",self.entryPartial);
  Handlebars.registerPartial("assets",$("#assets-partial").html());
  Handlebars.registerPartial("examples",$("#examples").html());
  Handlebars.registerPartial("collocations",$("#collocations").html());
  Handlebars.registerPartial("frequency",$("#frequency").html());
  Handlebars.registerHelper('my_apikey', function() { console.log("myapikey=>"+self.apikey); return new Handlebars.SafeString(self.apikey);});

  Handlebars.registerHelper('trimLang', function(passedString) {
    var theString = passedString.slice(-2);
    return new Handlebars.SafeString(theString)
  });

  Handlebars.registerHelper('freq', function(passedString) {
    var theString = 4 - parseInt(passedString);
    return new Handlebars.SafeString(theString)
  });

  // this.goRandom = function() {
  //   console.log('Looking up random word');
  //   this.startLoadingAnimation();
  //   var self = this;

  //   $.getJSON(this.baseUrl + '/entries/random?jsonp=?',
  //             {apikey: this.apikey},
  //             function(data) {
  //               self.handleResponse(data);
  //             });
  // };

  this.lookUpWord = function() {
    var word = $('#dictionaryWord').val();
    console.log('Looking up: ' + word);
    this.startLoadingAnimation();
    
    $.getJSON(this.baseUrl + '/entries?jsonp=?',
              {apikey: this.apikey, headword: word}, 
              function(data) {
                self.handleResponse(data);
              });
  };

  this.handleResponse = function(data) {
    console.log('Received response', data);

    this.stopLoadingAnimation();
    if( data.results == null ) {
      $('#dictionaryAnswers').html('<p class="centre"><em>No result found. Please try another word / try again.</em></p>');
    } else {

      var html = self.entriesTemplate(data);
      console.log('Setting Answers to', html.substring(0, 50), '... (first 50 chars)'); 
      $('#dictionaryAnswers').html(html);
      $('li').click(function(evt){
        console.log('Click event target', evt.currentTarget);
        self.expandEntry(evt);
      });
    }
  };

  this.startLoadingAnimation = function(data) {
    $('.dictionaryexample .loading').removeClass('hidden');
  };

  this.stopLoadingAnimation = function(data) {
    $('.dictionaryexample .loading').addClass('hidden');
  };

  this.expandEntry= function(evtObj) {
    var url_id = evtObj.currentTarget.id;
    console.log('Looking up: ' + url_id);

    $.getJSON(this.baseUrl + '/entries/' + encodeURIComponent(url_id) + '?jsonp=?',
            {apikey: this.apikey},
              function(data) {
                console.log('Received', data);
                var html = self.entryPartial(data.result);
                console.log('Writing html', html.substring(0, 50));
                $(evtObj.currentTarget).replaceWith(html);
                $('li#'+url_id).find('span.clickMsg').hide();
                $('.icon-volume-up').click(function(evt) {
                   var audio = $(evt.currentTarget).find('audio')[0];
                   audio.play();
                   console.log ("sent play event, anything happening ?");
                });
              });
  }

  // $('#dictionaryGoRandom', form).click(function(event) {
  //   self.goRandom();
  //   return false;
  // });

  $(form).submit(function(event) {
    event.preventDefault();
    self.lookUpWord(); 
    return false;
  });

}

$(function() {
  var dictionaryForm = $('#dictionaryExample');
  var dictionaryExample = new DictionaryExample(dictionaryForm);
});

