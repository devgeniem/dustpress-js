import 'whatwg-fetch'; // fetch polyfill
import 'core-js/fn/promise'; // Promise polyfill
import Cookie from 'js-cookie';
import fetchRetry from 'fetch-retry';
import jqueryParam from 'jquery-param';

export default class DustPress {

    /**
     * CSRF token
     *
     * @static
     * @type {String}
     */
    static csrfToken = '';

    /**
     * Default dpjs_token cookie params
     *
     * @type {Object}
     */
    cookieParams = {
        expires: 60 * 60 * 1000,
        path: '/'
    }

    /**
     * Default dp() params
     *
     * @type {Object}
     */
    params = {
        url: window.location,
        method: 'POST',
        args: {},
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        bypassMainQuery: false,
        partial: '',
        render: false,
        tidy: false,
        data: false,
        retries: 3,
        retryDelay: 0,
    }

    /**
     * Generate token for CSRF protection
     *
     * @return {String} Generated token.
     */
    generateToken() {
        // Use the already generated token if we have one
        if ( this.csrfToken ) {
            return this.csrfToken;
        }

        let token = '';

        if ( typeof window.crypto !== 'undefined' && typeof window.crypto.getRandomValues === 'function' ) {
            for ( let i = 0; i < 4; i++ ) {
                token += window.crypto.getRandomValues( new Uint32Array( 1 ) );
            }
        } else {
            token = Math.random() + '' + Math.random();
        }

        this.csrfToken = token;
        Cookie.set( 'dpjs_token', token, this.cookieParams );

        return token;
    }

    /**
     * Call dustpress function
     *
     * @param  {String} path   Dustpress call path.
     * @param  {Object} params Call args.
     * @return {Promise}       Result promise.
     */
    send( path, params = {}) {

        // Get the CSRF token
        const token = this.generateToken();

        // Extract params from the combination of default and given params
        const {
            method,          // Ajax call method
            args,            // Dustpress ajax args
            bypassMainQuery, // Whether the main wp query should be disabled
            partial,         // What partial to render
            render,          // Whether we whould render a partial or not
            tidy,            // Should we tidy the ajax call output
            data,            // If set to true, the response also contains the data used when rendering a template.
            credentials,     // Whether we should send cookie data with the call or not
            headers,         // What headers to use for the call
            retries,         // How mny times to retry failed request on network error
            retryDelay       // How much time to wait between retries
        } = Object.assign({}, this.params, params );
        const url = new URL( params.url || this.params.url );

        // Edge doesnt implement the "finally" function in its fetch but does in a Promise so we need to wrap this in a Promise
        return new Promise( ( resolve, reject ) => {
            const dustpress_data = {
                args,
                bypassMainQuery,
                partial,
                path,
                render,
                tidy,
                data,
                token
            };
            const fetchParams = {
                method,
                credentials,
                headers,
                retries,
                retryDelay
            };

            // If doing a GET request add the params to the url
            if ( method === 'GET' ) {
                dustpress_data.dustpress_data = true;
                url.search = jqueryParam( dustpress_data );
            }
            else {
                fetchParams.body = JSON.stringify({ dustpress_data });
            }

            // Send the request
            fetchRetry( fetch )( url, fetchParams ).then( ( response ) => {
                if ( response.ok ) {
                    return response.json();
                }

                // Reject promise as well if the response was not 200
                reject( response.statusText );
            }).then( ( data ) => {
                resolve( data );

                if ( typeof window.DustPressDebugger !== 'undefined' ) {
                    setTimeout( () => {
                        window.DustPressDebugger.extend({
                            params: args,
                            data: data
                        }, path );
                    }, 0 );
                }
            }).catch( ( err ) => {
                reject( err );
            });
        });
    }
}

// Setup global dp() function
if ( typeof window.dp === 'undefined' ) {
    const dustpress = new DustPress();
    window.dp = ( path, params ) => dustpress.send( path, params );
}
