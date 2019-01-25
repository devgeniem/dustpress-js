export default class DustPress {

    /**
     * Default instance params
     *
     * @type {Object}
     */
    defaults = {
        get: '',
        type: 'post',
        tidy: false,
        render: false,
        partial: null,
        upload: false,
        data: false,
        url: null,
        bypassMainQuery: true,
        contentType: 'application/json',
        success: () => {},
        error: () => {},
        uploadProgress: () => {},
        downloadProgress: () => {},
        start: () => {},
        complete: () => {}
    };

    /**
     * Constains current instance object
     *
     * @type {Object}
     */
    instance = {};

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
            this.defaults.token = '';

            for ( let i = 0; i < 4; i++ ) {
                this.defaults.token += window.crypto.getRandomValues( new Uint32Array( 1 ) );
            }
        } else {
            this.defaults.token = Math.random() + '' + Math.random();
        }
    }

    /**
     * Handle ajax success
     *
     * @param  {string|mixed} data       Data retrieved by ajax call.
     * @param  {string}       textStatus Response status.
     * @param  {jqXHR}        jqXHR      Superset of the browser's native XMLHttpRequest object.
     */
    successHandler( data, textStatus, jqXHR ) {
        let parsed;

        if ( typeof data === 'string' ) {
            parsed = $.parseJSON( data );
        } else {
            parsed = data;
        }

        // Expire CSRF cookie
        document.cookie = 'dpjs_token=; expires=-1; path=/';

        // Add to debugger data if it exists
        if ( window.DustPressDebugger ) {
            this.addToDebugger( parsed );
        }

        if ( parsed && ! parsed.error ) {
            this.instance.success( parsed.success, parsed.data, textStatus, jqXHR );
        } else {
            this.instance.error( parsed, textStatus, jqXHR );
        }
    }

    /**
     * Add called data to dustpress debugger
     *
     * @param {object} parsed Parsed data.
     */
    addToDebugger( parsed ) {
        delete this.instance.params.success;
        delete this.instance.params.error;

        const debug = {
            params: this.instance.params,
            data: parsed.debug ? parsed.debug : parsed
        };
        window.DustPressDebugger.extend( debug, this.instance.path );
    }

    /**
     * Handle file uploads
     */
    xhrUpload() {
        const xhr = new window.XMLHttpRequest();

        xhr.upload.addEventListener( 'progress', ( event ) => this.instance.uploadProgressHandler( event ), false );
        xhr.addEventListener( 'progress', ( event ) => this.instance.uploadDownloadProgressHandler( event ), false );
    }

    /**
     * Handle errors.
     *
     * @param  {jqXHR}  jqXHR       Superset of the browser's native XMLHttpRequest object.
     * @param  {string} textStatus  Response status.
     * @param  {mixed}  errorThrown Ajax call error.
     */
    errorHandler( jqXHR, textStatus, errorThrown ) {

        // Expire CSRF cookie
        document.cookie = 'dpjs_token=; expires=-1; path=/';

        this.instance.error({error: errorThrown}, textStatus, jqXHR );
    }

    /**
     * Handle uploar or download progress.
     *
     * @param {object} event Event data.
     */
    uploadDownloadProgressHandler( event ) {
        if ( event.lengthComputable ) {
            const complete = ( event.loaded / event.total );

            this.instance.downloadProgress( complete );
        }
    }

    /**
     * Make the ajax call.
     *
     * @param  {string}      path   Dustpress call path.
     * @param  {object|null} params Ajax call params.
     * @return {jqXHR}              Superset of the browser's native XMLHttpRequest object.
     */
    ajax( path, params ) {

        // Create a new instance of the default object so that simultaneous calls wouldn't clash.
        this.instance = Object.assign({}, this.defaults, params );
        if ( this.instance.get.length && ! this.instance.get.startsWith( '?' ) ) {
            this.instance.get = '?' + this.instance.get;
        }

        const date = new Date();
        date.setTime( date.getTime() + ( 24 * 60 * 60 * 1000 ) );

        // Set the cookie for the token
        document.cookie = 'dpjs_token=' + this.instance.token + '; expires=' + date.toGMTString() + '; path=/';

        const options = {
            url: ( this.instance.url || dustpressjs_endpoint || ( window.location + this.instance.get ) ),
            method: this.instance.type,
            contentType: this.instance.contentType,
            data: {
                dustpress_data: {
                    path: path,
                    args: this.instance.args,
                    render: this.instance.render,
                    tidy: this.instance.tidy,
                    partial: this.instance.partial,
                    data: this.instance.data,
                    token: this.instance.token,
                    bypassMainQuery: this.instance.bypassMainQuery
                }
            }
        };

        // Stringify data so it can be sent
        options.data = JSON.stringify( options.data );

        if ( this.instance.upload ) {
            options.xhr = () => this.xhrUpload();
        }

        this.instance.start();

        this.instance.successHandler          = ( data, textStatus, jqXHR ) => this.successHandler( data, textStatus, jqXHR );
        this.instance.errorHandler            = ( jqXHR, textStatus, errorThrown ) => this.errorHandler( jqXHR, textStatus, errorThrown );
        this.instance.uploadProgressHandler   = ( event ) => this.uploadDownloadProgressHandler( event );
        this.instance.downloadProgressHandler = ( event ) => this.uploadDownloadProgressHandler( event );

        return $.ajax( options )
        .done( ( data, textStatus, jqXHR ) => this.instance.successHandler( data, textStatus, jqXHR ) )
        .fail( ( jqXHR, textStatus, errorThrown ) => this.instance.errorHandler( jqXHR, textStatus, errorThrown ) )
        .always( ( dataOrXhr, textStatus, xhrOrError ) => this.instance.complete( dataOrXhr, textStatus, xhrOrError ) );
    }
}

// Register legacy functionality
if ( typeof window.DustPress === 'undefined' ) {
    window.DustPress = new DustPress();
    window.dp = ( path, params ) => {
        return window.DustPress.ajax( path, params );
    };
}
