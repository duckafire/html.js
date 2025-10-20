[html-js]: ./html.js
[example-html]: ./example.html

# html.js

This is a web component library, thought to be:

* Light
* Minimalist
* Easy to use
* Simple to understand
* Similar to HTML (mainly in relation to the structure)
* Independent of preprocessor (or similar)

## Installing

Just copy and paste this code chunk in your HTML file:

``` html
<script src="https://cdn.jsdelivr.net/npm/@duckafire/html.js@0.0.2-3/html.min.js"></script>

```

> [!TIP]
> Put it in the `<head>`.

After this, run the JavaScript code below:

``` html
<script>
	declare_htmljs();
</script>
```

> [!NOTE]
> See more about `declare_htmljs` [here](#start-library).

## How to use

### Start library

As mentioned earlier on, it is necessary call the functions bellow to
start the library:

* `{} declare_htmljs( [prefix: string = ""], [createObject: boolean = false], [useUpperCase: boolean = false] )`
	* `prefix`: prefixs the name of the functions/methods that are
	            used to create the elements.
	* `createObject`: specifics that the methods have to be declared
	                  in a new object, that it will be created by the
	                  functions.
	* `useUpperCase`: specifics that the methods names have to be formated by
	                  upper case characters, instead lower case characteres.

> [!NOTE]
> If `createObject != true`, the methods will be declared in `window`, that
> it also will be returned.

Call any function, from this library, without call this function (probably) will
generate an error.

> [!NOTE]
> Originally, the plan was declare them as constants (like `const div = (...`), but
> it generate one problem: some of these names are too simple (like `a`, `b`, and `q`).
> It can cause some confusion, then I decided to allow that **you** can decide where
> these methods have to be declared and how they have to look like.

### Create an element

To create a HTML element, you need to call its respective function/method, like shown
below:

``` js
// create a <div> that it contains two
// "text nodes" and a <br> element
div( null,
	"foo foo"
	br();
	"bar bar"
div);
```

All these functions/methods have the same parameter structure, the only difference it
is their names/identifiers, because of this, I will not to list all them here, but I
will explain their structure.

* `{} foo( [htmlProperties: object = undefined, [...children: object | string = undefined, [closeTag: any = undefined]]] )`
	* `htmlProperties`: all the HTML properties that will be implemented in the created
	                    element.
	* `children`: all elements that will be appended in the created element. If it is a
	              string, a *text node* will added to the element.
	* `closeTag`: an optional thing, to explicit the end of the element creation. I
	              recommend that it to be equal the itself function (like the previous
	              example). See [this](#closing-the-element-creation) to learn how to
	              disable this optional parameter.

> [!IMPORTANT]
> Deprecated tags are not available.

> [!NOTE]
> See [example.html][example-html] to obtain the list of available *tag-functions*
> (they are stored in `__htmljs_element_tags__`).

### Closing the element creation

To disable the parameter `closeTag` of the *tag-functions*, it is necessary call the
functions below:

* `undefined htmljs_set_ignore_last( [ignore: boolean = false] )`
	* `ignore`: sets if `closeTag` is required by *tag-functions*.

> [!NOTE]
> `closeTag` is required by default. Its value is global, it affects all the
> *tag-functions* call that occur after that it is called.

> [!TIP]
> Run [example.html][example-html] (in your browser) to see how all these work.

### Other stuff

In addition to the things present earlier, this library declare some other stuff, there
are:

* `__htmljs_ignore_last__`
* `__htmljs_is_not_object__`
* `__htmljs_element_tags__`
* `__htmljs_core__`

They are global, and they are used by the library algorithms to that they do their work.
You **do not** have to use them directly (because of this they are between double
underscores). I will not explain more about them here, but you can get some information
about these stuff [here][html-js].
