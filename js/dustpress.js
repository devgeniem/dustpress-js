import 'whatwg-fetch'; // fetch polyfill
import 'core-js/fn/promise'; // Promise polyfill
import Cookie from 'js-cookie';

export default class DustPress {

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
        tidy: false
    }

    /**
     * Generate token for CSRF protection
     *
     * @return {String} Generated token.
     */
    generateToken() {
        let token = '';

        if ( typeof window.crypto !== 'undefined' && typeof window.crypto.getRandomValues === 'function' ) {
            for ( let i = 0; i < 4; i++ ) {
                token += window.crypto.getRandomValues( new Uint32Array( 1 ) );
            }
        } else {
            token = Math.random() + '' + Math.random();
        }

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

        // Set dpjs_token cookie
        const token = this.generateToken();
        Cookie.set( 'dpjs_token', token, this.cookieParams );

        // Extract params from the combination of default and given params
        const {
            url,             // Url to send ajax call to
            method,          // Ajax call method
            args,            // Dustpress ajax args
            bypassMainQuery, // Whether the main wp query should be disabled
            partial,         // What partial to render
            render,          // Whether we whould render a partial or not
            tidy,            // Should we tidy the ajax call output
            credentials,     // Whether we should send cookie data with the call or not
            headers          // What headers to use for the call
        } = Object.assign({}, this.params, params );


        // Edge doesnt implement the "finally" function in its fetch but does in a Promise so we need to wrap this in a Promise
        return new Promise( ( resolve, reject ) => {
            const fetchParams = {
                method,
                body: JSON.stringify({
                    dustpress_data: {
                        args,
                        bypassMainQuery,
                        partial,
                        path,
                        render,
                        tidy,
                        token
                    }
                }),
                credentials,
                headers
            };

            // Send the request
            fetch( url, fetchParams ).then( ( response ) => {
                if ( response.ok ) {
                    return response.json();
                }

                // Reject promise as well if the response was not 200
                throw Error( response.statusText );
            }).then( ( data ) => {
                resolve( data );
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
