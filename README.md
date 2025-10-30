[html-js]: ./html.js "html.js source file"
[example-html]: ./example.html "html.js example"
[data-property]: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/data-* "HTML attributes data-*"
[aria-property]: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA "Accessible Rich Internet Applications"
[event-listeners]: https://www.w3schools.com/js/js_htmldom_eventlistener.asp "DOM Event Listeners"
[style-property]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style "The HTML `style` property"
[camel-case]: https://en.wikipedia.org/wiki/Camel_case "Understanding the camelCase"

# html.js

This is a web component library, thought to be:

* Light
* Minimalist
* Easy to use
* Simple to understand
* Similar to HTML (mainly in relation to the structure)
* Independent of preprocessor (or similar)

### Topics

* [Installing](#installing)
* [How to use](#how-to-use)
	* [Start library](#start-library)
	* [Create an element](#create-an-element)
	* [Closing the element creation](#closing-the-element-creation)
	* [Adding your self tags](#adding-your-self-tags)
	* [Special properties](#special-properties)
	* [Managing default values to properties](#Managing-default-values-to-properties)
		* [Set default values](#set-default-values)
		* [Unset default values](#unset-default-values)
	* [Other stuff](#other-stuff)

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
* `{} declare_htmljs( [ args: object = {[prefix: string = ""], [createObject: boolean = false], [useUpperCase: boolean = false]} ] )`
	* `prefix`: prefixs the name of the functions/methods that are
	            used to create the elements.
	* `createObject`: specifics that the methods have to be declared
	                  in a new object, that it will be created by the
	                  functions.
	* `useUpperCase`: specifics that the methods names have to be formated by
	                  upper case characters, instead lower case characteres.
	* `args`: an object containing the options (these above) wanted.

> [!NOTE]
> If `createObject != true`, the methods will be declared in `window`, that
> it also will be returned.

> [!TIP]
> Try `declare_htmljs({useUpperCase: true})` instead `declare_html(null, false, true)`.

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
div( {className: "foo"},
	"Lorem ipsum",
	br(),
	span( null,
		"Lorem ipsum",
	span),
	input( {type: "text", value: "foobar", readOnly: "~"}),
div);
```

> [!TIP]
> Defining a property as `"~"` makes it equal itself, in other words, `open: "~"` is
> equal `open: "open"`.

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

> [!WARNING]
> Unlike HTML and CSS, the JavaScript syntax do not support the use of the hyphen (`-`)
> in identifiers name. So *compound properties* only can be declared:
> * Between single/double quotes: `"padding-top"`; `"background-color"`; `"font-size"`.
> * In [camelCase][camel-case]: `paddingTop`; `backgroundColor`; `fontSize`.

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

### Adding your self tags

It also is possible to add yourself customized tags to the library, to do this it is
necessary to use this function:

* `void htmljs_add_custom_tag(tag: string, [isNoContainer: boolean = false], [force: boolean = false])`
	* `tag`: will be saved, by the library, as a valid HTML tag.
	* `isNoContainer`: specifics if the tag is a *no-container* or not.
	* `force`: indicates that the addition of the tag must to be forced or not.

> [!NOTE]
> If `!force` and `tag` already was saved an error will occur.

It save the tag name in a library list, that it is used during the tag validations,
what it avoid that the using of the customized tag throw an error.

### Special properties

In addition of the *common element properties*, the `htmlProperties` support the
properties bellow:

* `dataSets`: a list of customized properties that will be prefixed by `data-`.

``` js
SPAN({ dataSets: { property: "value" } });
```

* `ariaAttributes`: a list of properties that will be prefixed by `aria-`.

``` js
SPAN({ ariaProperties: { property: "value" } });
```

* `eventListeners`: a list of events that will be added to the created element.

``` js
SPAN({ eventListeners: { event: action } });
SPAN({ eventListeners: { event: [action0, actionN] } });
```

* `cssRules`: a list of CSS style rules and variables that will be added to the created
element.

``` js
SPAN({ cssRules: { rule: value } });
SPAN({ cssRules: { "--variable": value } });
```

> [!IMPORTANT]
> These *compound properties* follow the same writing rules of the ***common***
> *compound properties*. See [Create an element](#create-an-element) to more
> information about.

> [!NOTE]
> See more about these concepts bellow:
>
> * [data-][data-property]
> * [aria-][aria-property]
> * [Event Listeners][event-listeners]
> * [The `style` property][style-property]

### Setting default values to properties

It is possible (un)set default values to elements properties. They are based in tags,
so if you define a default value (e.g.) to `href`, from `<a>`, all tags (`<a>`)
create after this will receive this default value automatically. But if during the
call of the *Creator Function* (of `<a>`) the `href` is defined, the default value
will be overrided.

#### Set default values

* `void htmljs_set_default_properties_values(tag: string[, validateTag: boolean = false], htmlProperties: object)`
* `void htmljs_set_default_properties_values( [validateTag: boolean = false ,] args: array )`
	* `tag`: element whose properties will receive a, or more, default value(s).
	* `validateTag`: specifics if `tag` have to be validated (check if it exists or not).
	* `htmlProperties`: all tags, and their default values, that will receive a default
	                    value.
	* `args`: an object containing a list of tags, with their HTML properties.

> [!NOTE]
> These values are global, they affects all the *Creator Functions* call that occur
> after that it is called. *Special Properties* are included too, but their
> *subproperties* cannot receive a default value individually.

> [!TIP]
> This is a example of value to `args`: `{a: {href: "#"}, div: {className: "div"}}`.

#### Unset default values

* `void htmljs_unset_default_properties_values(tag: string[, validateTag: boolean = false], htmlProperties: array)`
* `void htmljs_unset_default_properties_values( [validateTag: boolean = false ,] args: array )`
	* `tag`: element whose properties will lose a, or more, default value(s).
	* `validateTag`: specifics if `tag` have to be validated (check if it exists or not).
	* `htmlProperties`: a list of properties that will lose their default values.
	* `args`: an object containing a list of tags, with their HTML properties.

> [!NOTE]
> These values are global, they affects all the *Creator Functions* call that occur
> after that it is called. *Special Properties* are included too, but their
> *subproperties* cannot receive a default value individually.

> [!TIP]
> This is a example of value to `args`: `{a: ["href"], div: ["className"]}`.

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
