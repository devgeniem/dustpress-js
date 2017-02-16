![geniem-github-banner](https://cloud.githubusercontent.com/assets/5691777/14319886/9ae46166-fc1b-11e5-9630-d60aa3dc4f9e.png)
# DustPress Plugin: DustPress.js

A DustPress plugin that provides a handy JavaScript library for using your DustPress model methods on the front end.

- Contributors: [devgeniem](https://github.com/devgeniem) / [Nomafin](https://github.com/Nomafin), [villesiltala](https://github.com/villesiltala)
- Plugin url: https://github.com/devgeniem/dustpress-debugger
- Tags: dustpress, wordpress, plugins, dustjs, dust.js
- Requires at least: 4.2.0
- Tested up to: 4.7.2
- License: GPL-3.0
- License URI: http://www.gnu.org/licenses/gpl-3.0.html

## Usage

You can call for SomeModel's method "SomeMethod" with the following call:

```
dp("SomeModel/SomeMethod", {
	tidy: true,
	success: function( data ) {
		// do what you want with the data
	},
	error: function( error ) {
		// possible error
	}
});
```

`tidy: true` parameter cleans up the data tree a bit for more usability. Feel free to try the queries with and without it to see the difference.

If you want, you can even render HTML with Dust templates.

```
dp("SomeModel/SomeMethod", {
	partial: "SomePartial",
	success: function( data ) {
		// do what you want with the data
	},
	error: function( error ) {
		// possible error
	}
});
```
This code takes the data of SomeMethod and renders it with SomePartial. Variable `data` then contains the ready html.

You can also omit the method completely if you want to get the data of a complete model.

```
dp("SomeModel", {
	success: function( data ) {
		// do what you want with the data
	},
	error: function( error ) {
		// possible error
	}
});
```

If you want to call several functions but not all at once, you can do so by replacing the method's name on the call with a comma-separated list.
```
dp("SomeModel/SomeMethod,AnotherMethod", {
	success: function( data ) {
		// data.SomeMethod and data.AnotherMethod contain the return values
	},
	error: function( error ) {
		// possible error
	}
});
```

Now data will consist of an object with the methods' names as keys and their return values as the values. Obviously you can also render that to HTML as well.

### Model function front-end visibility

All *public* functions in your DustPress models are accessible via AJAX by default. You can also call *protected* methods from the models by defining a *protected* array property with the name `$api` to your model with a list of method names that should be allowed to be run via AJAX.

```
class SomeModel extends DustPressModel {
    protected $api = [
        'SomeMethod'
    ];

    protected function SomeMethod() {
        // Some code..
    }
}
```

If you need to block visibility of public funcions, you can do this by examining the `DOING_AJAX` constant or calling the core function `is_dustpress_ajax`.

```
class SomeModel extends DustPressModel {
    protected $api = [
        'PublicMethod'
    ];

    public function PublicMethod() {
        if ( DustPress()->is_dustpress_ajax() ) {
            // Do not run if this an ajax request.
            return;
        }
        // Some code..
    }
}
```

## Install

Recommended installation to WP project is through composer:
```
$ composer require devgeniem/dustpress-js
```