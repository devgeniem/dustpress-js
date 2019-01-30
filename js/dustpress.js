import DPRequest from './DPRequest';

export default class DustPress {

    /**
     * Constains the crypt token
     *
     * @type {String}
     */
    token = '';

    /**
     * Construct class, setup crypt token
     */
    constructor() {
        this.setupCrypto();
    }

    /**
     * Setup token
     */
    setupCrypto() {

        // Create token for CSRF protection
        if ( typeof window.crypto !== 'undefined' && typeof window.crypto.getRandomValues === 'function' ) {
            this.token = '';

            for ( let i = 0; i < 4; i++ ) {
                this.token += window.crypto.getRandomValues( new Uint32Array( 1 ) );
            }
        } else {
            this.token = Math.random() + '' + Math.random();
        }
    }

    /**
     * Make the ajax call.
     *
     * @param  {string}      path   Dustpress call path.
     * @param  {object|null} params Ajax call params.
     * @return {jqXHR}              Superset of the browser's native XMLHttpRequest object.
     */
    ajax( path, params = {}) {
        params.token = this.token;
        const request = new DPRequest( path, params );
        return request.send();
    }
}

// Register legacy functionality
if ( typeof window.DustPress === 'undefined' ) {
    window.DustPress = new DustPress();
    window.dp = ( path, params ) => {
        return window.DustPress.ajax( path, params );
    };
}
