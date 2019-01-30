export default class DPRequest {

    /**
     * Request path
     *
     * @type {String}
     */
    path = '';

    /**
     * Default instance params
     *
     * @type {Object}
     */
    params = {
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
        token: '',
        success: () => {},
        error: () => {},
        uploadProgress: () => {},
        downloadProgress: () => {},
        start: () => {},
        complete: () => {}
    };

    /**
     * Construct the dustpress request
     *
     * @param {Object} params Params to use in request
     */
    constructor( path, params = {}) {
        this.path = path;

        // Override default params with given ones
        this.params = Object.assign( this.params, params );
    }

    send() {
        if ( this.params.get.length && ! this.params.get.startsWith( '?' ) ) {
            this.params.get = '?' + this.params.get;
        }

        const date = new Date();
        date.setTime( date.getTime() + ( 24 * 60 * 60 * 1000 ) );

        // Set the cookie for the token
        document.cookie = 'dpjs_token=' + this.params.token + '; expires=' + date.toGMTString() + '; path=/';

        const options = {
            url: ( this.params.url || dustpressjs_endpoint || ( window.location + this.params.get ) ),
            method: this.params.type,
            contentType: this.params.contentType,
            data: {
                dustpress_data: {
                    path: this.path,
                    args: this.params.args,
                    render: this.params.render,
                    tidy: this.params.tidy,
                    partial: this.params.partial,
                    data: this.params.data,
                    token: this.params.token,
                    bypassMainQuery: this.params.bypassMainQuery
                }
            }
        };

        // Stringify data so it can be sent
        options.data = JSON.stringify( options.data );

        if ( this.params.upload ) {
            options.xhr = () => this.xhrUpload();
        }

        this.params.start();

        this.params.successHandler          = ( data, textStatus, jqXHR ) => this.successHandler( data, textStatus, jqXHR );
        this.params.errorHandler            = ( jqXHR, textStatus, errorThrown ) => this.errorHandler( jqXHR, textStatus, errorThrown );
        this.params.uploadProgressHandler   = ( event ) => this.uploadDownloadProgressHandler( event );
        this.params.downloadProgressHandler = ( event ) => this.uploadDownloadProgressHandler( event );

        return $.ajax( options )
        .done( ( data, textStatus, jqXHR ) => this.params.successHandler( data, textStatus, jqXHR ) )
        .fail( ( jqXHR, textStatus, errorThrown ) => this.params.errorHandler( jqXHR, textStatus, errorThrown ) )
        .always( ( dataOrXhr, textStatus, xhrOrError ) => this.params.complete( dataOrXhr, textStatus, xhrOrError ) );
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
            this.params.success( parsed.success, parsed.data, textStatus, jqXHR );
        } else {
            this.params.error( parsed, textStatus, jqXHR );
        }
    }

    /**
     * Handle file uploads
     */
    xhrUpload() {
        const xhr = new window.XMLHttpRequest();

        xhr.upload.addEventListener( 'progress', ( event ) => this.params.uploadProgressHandler( event ), false );
        xhr.addEventListener( 'progress', ( event ) => this.params.uploadDownloadProgressHandler( event ), false );
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

        this.params.error({error: errorThrown}, textStatus, jqXHR );
    }

    /**
     * Handle uploar or download progress.
     *
     * @param {object} event Event data.
     */
    uploadDownloadProgressHandler( event ) {
        if ( event.lengthComputable ) {
            const complete = ( event.loaded / event.total );

            this.params.downloadProgress( complete );
        }
    }

    /**
     * Add called data to dustpress debugger
     *
     * @param {object} parsed Parsed data.
     */
    addToDebugger( parsed ) {
        delete this.params.params.success;
        delete this.params.params.error;

        const debug = {
            params: this.params.params,
            data: parsed.debug ? parsed.debug : parsed
        };
        window.DustPressDebugger.extend( debug, this.params.path );
    }
}
