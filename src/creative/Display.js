/*global TweenMax Linear gapi webkitSpeechRecognition webkitSpeechRecognitionEvent webkitSpeechGrammarList Quad*/
import {EventEmitter} from 'events';
import $ from 'jquery';
// import gapi from 'gapi-client'; // this doesn't work have to include via cdn in index
// created in google developer console
const apiKey = "AIzaSyAiNwV7zzrEois_Lgje8fSiAjN6uuLCbyw";
const endpoints = {
    translate: "",
    detect: "detect",
    languages: "languages"
};
var speech1, speech2, speech3, speech4;
var idx = 0;
var synth = window.speechSynthesis;
var voices = {
    en: {voiceURI: "Daniel", name: "Daniel", lang: "en-GB", localService: true, default: true}
}
var utterThis = new SpeechSynthesisUtterance('hello there');
utterThis.voice = voices.en;
synth.speak(utterThis);
class Display extends EventEmitter {
    init(config) {
        // start here
        TweenMax.to('body', 1, {alpha: 1});
        gapi.load('client', this.loaded());

    }
    loaded() {
        var cta = document.querySelector('.bt');
        var _this = this;
        ["click", "touchend"].forEach(function(eventName) {
            cta.addEventListener(eventName, (e)=> {
                e.preventDefault();
                _this.testSpeech();
                TweenMax.to('.speech-bubble', 0.3, {alpha: 0});
                TweenMax.to('.output', 0.3, {alpha: 0});
            });
        });
    }
    doTranslations(result) {
        TweenMax.set('.output', {scaleX: 1.2, scaleY: 1.2});
        TweenMax.to('.output', 0.3, {alpha:1, scaleX: 1, scaleY: 1, ease: Quad.easeOut, transformOrigin:'50% 50%'});

        var languages = [
            {code: 'fr', flag: '🇫🇷'},
            {code: 'de', flag: '🇩🇪'},
            {code: 'it', flag: '🇮🇹'},
            {code: 'pt', flag: '🇵🇹'},
            {code: 'th', flag: '🇹🇭'},
            ];
        for (var i=0; i<languages.length; i++) {
            this.start(languages[i], result)
        }
    }

    /**
     * Docs
     * https://developers.google.com/api-client-library/javascript/samples/samples
     */
    start(language, speech) {
        gapi.client.init({
            'apiKey': apiKey,
            'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/translate/v2/rest'],
        }).then(function () {
            return gapi.client.language.translations.list({
                q: speech,
                source: 'en',
                target: language.code,
            });
        }).then(function (response) {
            console.log(response.result.data.translations[0].translatedText);
            ++idx;
            var targ = '.speech'+(idx);
            $(targ).find('.speech').html(language.flag + ' ' + response.result.data.translations[0].translatedText);

            TweenMax.to(targ, 0.4, {alpha: 1, delay:idx*0.1});
            TweenMax.set(targ, {y: 10, delay:idx*0.1});
            TweenMax.to(targ, 0.5, {y: 0, ease: Quad.easeOut, delay:idx*0.1});

            if (idx>=5) {idx = 0};
        }, function (reason) {
            console.log('Error: ' + reason.result.error.message);
        });
    };

    /**
     * This is taken from here
     * https://github.com/mdn/web-speech-api
     */
    testSpeech() {

        var _this = this;
        var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
        var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
        var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

        var phrases = [
            'Je ne parle pas français'
        ];

        var phrasePara = document.querySelector('.phrase');
        var resultPara = document.querySelector('.result');
        var diagnosticPara = document.querySelector('.output');

        var phrase = phrases[0];
        // To ensure case consistency while checking with the returned output text
        phrase = phrase.toLowerCase();
        //phrasePara.textContent = phrase;
        //resultPara.textContent = 'Right or wrong?';
        //resultPara.style.background = 'rgba(0,0,0,0.2)';
        //diagnosticPara.textContent = '...diagnostic messages';

        var grammar = '#JSGF V1.0; grammar phrase; public <phrase> = ' + phrase +';';
        var recognition = new SpeechRecognition();
        var speechRecognitionList = new SpeechGrammarList();
        speechRecognitionList.addFromString(grammar, 1);
        recognition.grammars = speechRecognitionList;
        recognition.lang = 'en-EN';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.start();

        recognition.onresult = function(event) {
            // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
            // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
            // It has a getter so it can be accessed like an array
            // The first [0] returns the SpeechRecognitionResult at position 0.
            // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
            // These also have getters so they can be accessed like arrays.
            // The second [0] returns the SpeechRecognitionAlternative at position 0.
            // We then return the transcript property of the SpeechRecognitionAlternative object
            var speechResult = event.results[0][0].transcript;
            diagnosticPara.textContent = speechResult + '.';

            /*if(speechResult === phrase) {
                resultPara.textContent = 'I heard the correct phrase!';
                resultPara.style.background = 'lime';
            } else {
                resultPara.textContent = 'That didn\'t sound right.';
                resultPara.style.background = 'red';
            }*/

            console.log('Confidence: ' + event.results[0][0].confidence);

            // makeApiRequest(speechResult);
            _this.doTranslations(speechResult);
        }
        // unused method
        function makeApiRequest(text) {

            // Return response from API
            $.ajax({
                url: 'https://www.googleapis.com/language/translate/v2/?key=AIzaSyAiNwV7zzrEois_Lgje8fSiAjN6uuLCbyw&q='+text+'&target=fr&source=en',
                type: "GET",
                // data: JSON.stringify({sourceLang: "en", targetLang: "fr", textToTranslate: "hello"}),
                dataType: "json",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                success: function(e) {
                    console.log('', e.data.translations[0].translatedText);
                }
            });
        }

        recognition.onspeechend = function() {
            recognition.stop();
        }

        recognition.onerror = function(event) {
            diagnosticPara.textContent = 'Error occurred in recognition: ' + event.error;
        }

        recognition.onaudiostart = function(event) {
            //Fired when the user agent has started to capture audio.
            console.log('SpeechRecognition.onaudiostart');
            $('.bt').text('listening');
        }

        recognition.onaudioend = function(event) {
            //Fired when the user agent has finished capturing audio.
            console.log('SpeechRecognition.onaudioend');
            $('.bt').text('Tap to talk');
        }

        recognition.onend = function(event) {
            //Fired when the speech recognition service has disconnected.
            console.log('SpeechRecognition.onend');
            $('.bt').text('Tap to talk');
        }

        recognition.onnomatch = function(event) {
            //Fired when the speech recognition service returns a final result with no significant recognition. This may involve some degree of recognition, which doesn't meet or exceed the confidence threshold.
            console.log('SpeechRecognition.onnomatch');
        }

        recognition.onsoundstart = function(event) {
            //Fired when any sound — recognisable speech or not — has been detected.
            console.log('SpeechRecognition.onsoundstart');
            $('.bt').text('i can hear something at least');
        }

        recognition.onsoundend = function(event) {
            //Fired when any sound — recognisable speech or not — has stopped being detected.
            console.log('SpeechRecognition.onsoundend');

        }

        recognition.onspeechstart = function (event) {
            //Fired when sound that is recognised by the speech recognition service as speech has been detected.
            console.log('SpeechRecognition.onspeechstart');
            $('.bt').text('speech detected');
        }
        recognition.onstart = function(event) {
            //Fired when the speech recognition service has begun listening to incoming audio with intent to recognize grammars associated with the current SpeechRecognition.
            console.log('SpeechRecognition.onstart');
            $('.bt').text('listening');
        }
    }
}

export default Display;