[code-eg]: ./example.html "Go to GitHub repository"
[aria-attr]: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA "Mozilla docs: Accessible Rich Internet Applications"
[data-attr]: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/data-* "Mozilla docs: HTML attributes data-*"
[event-list]: https://www.w3schools.com/js/js_htmldom_eventlistener.asp "W3 docs: DOM Event Listeners"
[style-attr]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style "Mozilla docs: The HTML `style` attrbute"
[css-var]: https://www.w3schools.com/css/css3_variables.asp "W3 docs: CSS variables"

## html.js

This is a WEB component library thought to be:

* Light;
* minimalist;
* easy to use;
* simple to understand;
* similar to HTML; and
* independent.

> [TIP]
> See an **example** [here][code-eg].

``` html
<!-- CDN URL -->
<script src="https://cdn.jsdelivr.net/npm/@duckafire/html.js@1/index.min.js"></script>
```

## FAQ

### What are the parameters of the *Element Constructors*?

``` typescript
INPUT( attributes: {} ): Element;

DIV( attributes: {}, ...children: Element[] ): Element;
```

> [!NOTE]
> This is a simplified version; see the source code to more get tecnical
> information about the typing of the parameters of *Element Constructors*.

### What are *special attributes*?

They are keys, from `attributes` (parameter), which purpose is easily the
attribution of specific *things* to the element (like events). They does not
exist in HTML Standard, and will not be attributed to the element. They are:

* `_aria`:  declares [ARIA attributes][aria-attr].
* `_data`:  declares [*Data attributes*][data-attr].
* `_event`: adds [events listeners][event-list] to the element.
* `_style`: increments the [*inline style*][style-attr] of the element.
* `_var`:   declares [CSS variables][css-var] in the element scope.

### Who are attributes formated?

| Type of attribute   | Formatting               |
| :--                 | :--                      |
| ARIA attributes     | `fooBar -> aria-foo-bar` |
| Data attributes     | `fooBar -> data-foo-bar` |
| CSS rules           | `fontSize -> font-size`  |
| CSS variables       | `foo -> --foo`           |
| Standard attributes | `readOnly -> readonly`  |

> [!NOTE]
> Attributes started with `'-'` are not formated; values also are not.

### How to define default attributes?

Use the methods of `HJDefaultAttributes`.

``` typescript
HJDefaultAttributes.get( tagName: string ): {};

HJDefaultAttributes.unset( list: Record<string, {}> ): void;

HJDefaultAttributes.set( list: Record<string, string[]> ): void;
```

> [!NOTE]
> This is a simplified version; see the source code to more tecnical information
> about the typing of the parameters of methods from `HJDefaultAttributes`.

> [TIP]
> See an **example** [here][code-eg].
