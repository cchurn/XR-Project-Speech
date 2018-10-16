import {EventEmitter} from 'events';
import loadJS from "load-js";
import lazyLoadCSS from "lazyload-css";

class LazyLoader extends EventEmitter {
    init() {
        this.done();
    }
    done() {
        this.emit('done');
    }
    load(arr) {
        let arr_scripts = arr;
        let loadJSArray = [];
        let loadCSSArray = [];
        if (arr_scripts && arr_scripts.length) {
            for (let value of arr_scripts) {
                switch (value.split('.').pop()) {
                    case 'js':
                        let loadObj = {async: false, url: value};
                        loadJSArray.push(loadObj);
                        break;
                    case 'css':
                        const promise = lazyLoadCSS(value);
                        loadCSSArray.push(promise);
                        break;
                    default:
                        console.log('%c 😢 unsupported file: '+ value, 'background: #ff0000; color: #ffffff');
                }
            }
            loadJS( loadJSArray )
                .then(() => {
                    Promise.all(loadCSSArray).then(() => {
                        console.log('%c lazy loaded ' + arr_scripts.length + ' scripts 👍 ', 'background: #4ad427; color: #ffffff');
                        this.done();
                    })
                }).catch((e) => {
                    console.log('%c 🤔 couldn\'t load ' + e.target.src, 'background: #ff0000; color: #ffffff');
                });
        }
        else {
           this.done();
        }
    }

}
export default LazyLoader;