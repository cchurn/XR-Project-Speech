/*global*/
import Display from './Display';
import Layout from '../core/Layout';
import LazyLoader from '../core/LazyLoading';

var creative = {
    defaults: {
        container: '.container'
    },
    options: {},
    config: {container: '', responsive: false, width: 320, height: 568},
    init: function(opts) {

        for (var i in opts) {
            this.options[i] = {
                value: opts[i],
                enumerable: true,
                writeable: true,
                configurable: true
            }
        }
        this.config = Object.create(this.defaults, this.options);
        console.log('creative init', this.config);
        let layout = new Layout();
        if (this.config.responsive) {
            layout.init(this.config);
        } else {
            document.querySelector(this.config.container).style.width = this.config.width + 'px';
            document.querySelector(this.config.container).style.height = this.config.height + 'px';
        }

        /**
         * Lazy loading
         * If any JS or CSS files are passed via the config they'll be loaded here
         * before Display.js starts
         */
        let lazyLoader = new LazyLoader();
        lazyLoader.on('done', () => {
            this.startDisplay();
        });
        lazyLoader.load(this.config.lazyLoad);
    },
    startDisplay() {
        let display = new Display();
        display.init(this.config);
    }
};


export default creative;