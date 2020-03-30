![geniem-github-banner](https://cloud.githubusercontent.com/assets/5691777/14319886/9ae46166-fc1b-11e5-9630-d60aa3dc4f9e.png)
# DustPress Plugin: DustPress.js

A DustPress plugin that provides a handy JavaScript library for using your DustPress model methods on the front end.

- Contributors: [devgeniem](https://github.com/devgeniem) / [Nomafin](https://github.com/Nomafin), [villesiltala](https://github.com/villesiltala), [godbone](https://github.com/godbone)
- Plugin url: https://github.com/devgeniem/dustpress-debugger
- Tags: dustpress, wordpress, plugins, dustjs, dust.js
- Requires at least: 4.9.0
- Requires DustPress version: 1.25.0
- Tested up to: 5.2.0
- License: GPL-3.0
- License URI: http://www.gnu.org/licenses/gpl-3.0.html

## Usage

You can call for `SomeModel`'s method `SomeMethod` with following code:

```js
dp( 'SomeModel/SomeMethod', {
    tidy: true,
    args: {
        'foo': 'bar'
    }
}).then( ( data ) => {
    // do what you want with the data
}).catch( ( error ) => {
    // possible error
});
```

`tidy: true` parameter cleans up the data tree a bit for more usability. Feel free to try the queries with and without it to see the difference.

`args` parameter passes arguments to the PHP side. They can be accessed there with `$this->get_args();`.

If you want, you can even render HTML with Dust templates.

```js
dp( 'SomeModel/SomeMethod', {
    partial: 'SomePartial',
}).then( ( data ) => {
    // do what you want with the data
}).catch( ( error ) => {
    // possible error
});
```
This code takes the data of `SomeMethod` and renders it with `SomePartial`. Variable `data` then contains the ready html.

If you still want to get the data output as well, use argument `data: true` and you will get the resulting data as the second parameter of your success function.

You can also omit the method completely if you want to get the data of a complete model.

```js
dp( 'SomeModel/SomeMethod' ).then( ( data ) => {
    // do what you want with the data
}).catch( ( error ) => {
    // possible error
});
```

It is also possible to use the `dp` call with the async-await pattern:

```js
try {
    var foobar = await dp( 'SomeModel/SomeMethod', {
        tidy: true,
        args: {
            foo: 'bar'
        }
    });
} catch( err ) {
    console.error( err );
}
```

Now data will consist of an object with the methods' names as keys and their return values as the values. Obviously you can also render that to HTML as well.

### Additional parameters

#### bypassMainQuery

By default DustPress.js requests bypass WordPress' main WP_Query so that it wouldn't slow the request down when it's not necessary. You can prevent that from happening by setting `bypassMainQuery: false` if you want to use the default query.

### Model function front-end visibility

You need to make your methods accessible for DustPress.js by defining a property named `$api` in your model. It should be an array consisting of the names of your accessible methods. DustPress.js can also run `protected` methods which are not automatically run by DustPress normally.

```
class SomeModel extends DustPressModel {
    public $api = [
        'SomeMethod'
    ];

    protected function SomeMethod() {
        // Some code..
    }
}
```

If you need to determine whether a call has been made from ajax or not, you can use `dustpress()->is_dustpress_ajax()` function like shown below:

```
class SomeModel extends DustPressModel {
    public $api = [
        'PublicMethod'
    ];

    public function PublicMethod() {
        if ( dustpress()->is_dustpress_ajax() ) {
            // Do not run if this an ajax request.
            return;
        }
        // Some code..
    }
}
```

## Install

Recommended installation to a WordPress project is through composer:
```
$ composer require devgeniem/dustpress-js
```

Obviously you can also download the ZIP file from GitHub and extract it into your plugins directory.
