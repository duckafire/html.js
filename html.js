"use strict";

// Zlib License
//
// Copyright (C) 2025 DuckAfire <duckafire.github.io/nest>
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//    claim that you wrote the original software. If you use this software
//    in a product, an acknowledgment in the product documentation would be
//    appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//    misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

let __htmljs_ignore_last__ = 1;
let __htmljs_debug_func__  = console.warn;

const __htmljs_default_properties_values__ = {};

const __htmljs_is_not_object__ = (thing) =>
{
	return typeof thing != "object" || Array.isArray(thing);
};

const __htmljs_is_object__ = (thing) =>
{
	return thing !== null && typeof thing == "object" && !Array.isArray(thing);
};

const __htmljs_is_empty_object__ = (object) =>
{
	return Object.keys(object).length === 0;
};

const __htmljs_element_tags__ = {
	noContainers: [
		"area", "base", "br", "col", "hr", "img", "input", "link",
		"meta", "source", "track", "wbr",
	],

	containers: [
		"a", "abbr", "address", "article", "audio", "b", "bdi", "bdo",
		"blockquote", "body", "button", "canvas", "caption", "cite",
		"code", "colgroup", "data", "datalist", "dd", "del", "details",
		"dfn", "dialog", "div", "dl", "dt", "em", "fieldset", "figcaption",
		"figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6",
		"head", "header", "hgroup", "html", "i", "iframe", "ins", "kbd",
		"label", "legend", "li", "main", "map", "mark", "meter", "nav",
		"noscript", "object", "ol", "optgroup", "option", "output", "p",
		"picture", "pre", "progress", "q", "rp", "rt", "ruby", "samp",
		"script", "section", "select", "small", "span", "strong", "sub",
		"summary", "sup", "table", "tbody", "td", "template", "textarea",
		"tfoot", "th", "thead", "time", "title", "tr", "ul", "vari", "video",
	]
};

const __htmljs_set_prefixed_property__ = (prefix, elem, field, value) =>
{
	elem.setAttribute(prefix + "-" + field, value);
}

const __htmljs_data_sets__ = (elem, property, value) =>
{
	__htmljs_set_prefixed_property__("data", elem, property, value);
}

const __htmljs_aria_attributes__ = (elem, property, value) =>
{
	__htmljs_set_prefixed_property__("aria", elem, property, value);
}

const __htmljs_event_listeners__ = (elem, event, action) =>
{
	if(Array.isArray(action))
		for(const ACTION of action)
			elem.addEventListener(event, ACTION);
	else
		elem.addEventListener(event, action);
}

const __htmljs_css_rules__ = (elem, rule, value) =>
{
	if(rule.charAt(0) == "-") // it is a variable
		elem.style.setProperty(rule, value);
	else
		elem.style[rule] = value;
}

const __htmljs_treat_special_properties__ = (elem, property, htmlProperties) =>
{
	let behavior;

	switch(property)
	{
		case "dataSets":       behavior = __htmljs_data_sets__;       break;
		case "ariaAttributes": behavior = __htmljs_aria_attributes__; break;
		case "eventListeners": behavior = __htmljs_event_listeners__; break;
		case "cssRules":       behavior = __htmljs_css_rules__;       break;
		default: return false;
	}

	if(__htmljs_is_not_object__( htmlProperties[property] ))
	{
		__htmljs_debug_func__(new TypeError(`Invalid value attributed to \`${property}\`, expecting an object.`));
		return false;
	}

	for(const PROPERTY in htmlProperties[property])
		behavior(elem, PROPERTY, htmlProperties[property][PROPERTY]);

	return true;
}

const __htmljs_set_element_properties__ = (elem, htmlProperties) =>
{
	for(const PROPERTY in htmlProperties)
	{
		if(__htmljs_treat_special_properties__(elem, PROPERTY, htmlProperties))
			continue;

		const VALUE = (htmlProperties[PROPERTY] == "~" ? PROPERTY.toLowerCase() : htmlProperties[PROPERTY]);

		if(elem[PROPERTY] !== undefined || PROPERTY == "className")
			elem[PROPERTY] = VALUE;
		else
			elem.setAttribute(PROPERTY, VALUE);
	}

}

const __htmljs_core__ = (elementTag, htmlProperties, ...children) =>
{
	const ELEM = document.createElement(elementTag);

	if(__htmljs_default_properties_values__[elementTag] != undefined)
	{
		let ref = __htmljs_default_properties_values__[elementTag];

		if(__htmljs_is_not_object__(ref))
		{
			__htmljs_debug_func__(new TypeError(`Excepting object to \`htmlProperties\`, instead "${typeof htmlProperties}".`));

			// this allows to jump the for-loop below,
			// if the Debug Mode is != 2
			ref = {};
		}

		__htmljs_set_element_properties__(ELEM, ref);
	}

	if(htmlProperties !== undefined)
	{
		let textnode = "";
		const ARGS_MAX = children.length - __htmljs_ignore_last__;

		if(htmlProperties !== null)
		{
			if(__htmljs_is_not_object__( htmlProperties ))
			{
				__htmljs_debug_func__(new TypeError(`Excepting object to \`htmlProperties\`, instead "${typeof htmlProperties}".`));

				// this allows to jump the for-loop below,
				// if the Debug Mode is != 2
				htmlProperties = {};
			}

			__htmljs_set_element_properties__(ELEM, htmlProperties);
		}

		for(let i = 0; i < ARGS_MAX; i++)
		{
			if(typeof children[i] == "string")
			{
				textnode += (textnode == "" ? "" : " ") + children[i];
				continue;
			}

			if(!(children[i] instanceof HTMLElement))
			{
				__htmljs_debug_func__(new TypeError(`Excepting object or String to \`children[${i}]\`, instead "${typeof children[i]}".`));
				continue;
			}

			if(textnode != "")
			{
				ELEM.appendChild(document.createTextNode( textnode ));
				textnode = "";
			}

			try
			{
				ELEM.appendChild( children[i] );
			}
			catch(ex)
			{
				__htmljs_debug_func__(ex);
				break;
			}
		}

		if(textnode != "")
			ELEM.appendChild(document.createTextNode( textnode ));
	}

	return ELEM;
};

const htmljs_set_ignore_last = (ignore) =>
{
	__htmljs_ignore_last__ = ignore ? 1 : 0;
};

const htmljs_set_debug_mode = (mode) =>
{
	const TYPE = typeof mode;

	if(TYPE != "number")
		throw new TypeError(`Invalid mode type: "${TYPE}". Use only integer numbers.`);

	if(mode > 2)
		throw new RangeError(`Invalid mode value: "${mode}". Use only 0, 1, or 2.`);

	__htmljs_debug_func__ = [
		() => {},
		console.warn,
		(exception) => { throw exception; }
	][ Math.floor(mode) ];
};

const declare_htmljs = (...args) =>
{
	let prefix, createObject, useUpperCase;

	if(args[0] !== null && typeof args[0] == "object")
		({prefix, createObject, useUpperCase} = args[0]);
	else
		[prefix, createObject, useUpperCase] = args;

	const DEST = createObject ? {} : window;
	const PREF = prefix || "";
	let tag;

	for(const FIELD in __htmljs_element_tags__)
	{
		__htmljs_element_tags__[FIELD].forEach((elementTag, id) =>
		{
			tag = PREF + elementTag;

			if(elementTag == "vari")
				elementTag = "var";

			DEST[ (useUpperCase ? tag.toUpperCase() : tag) ] =
				(FIELD == "noContainers")
					? (properties)              => __htmljs_core__(elementTag, properties)
					: (properties, ...children) => __htmljs_core__(elementTag, properties, ...children);
		});
	}

	return DEST;
};

const __htmljs_save_custom_tag__ = (dest, tag, force) =>
{
	if(typeof tag != "string")
	{
		__htmljs_debug_func__(new TypeError(`Expecting a string, instead a "${typeof tag}".`));
		return;
	}

	if(force)
	{
		for(const TAG of dest)
		{
			if(tag == TAG)
			{
				console.warn(new Error(`"${tag}" already was added.`));
				return;
			}
		}
	}

	dest.push(tag);
}

const htmljs_add_custom_tag = (tag, isNoContainer, force) =>
{
	const DEST = __htmljs_element_tags__[ (isNoContainer ? "noC" : "c") + "ontainers" ];

	if(!Array.isArray(tag))
	{
		__htmljs_save_custom_tag__(DEST, tag, force);
		return;
	}

	for(const TAG of tag)
		__htmljs_save_custom_tag__(DEST, TAG, force);
}

const __htmljs_validate_tags__ = (tag) =>
{
	for(const ELEMENT_TYPE in __htmljs_element_tags__)
		for(const TAG of __htmljs_element_tags__[ ELEMENT_TYPE ])
			if(tag == TAG)
				return true;

	__htmljs_debug_func__(new TypeError(`Invalid HTML tag: "${tag}".`));
	return false;
}

const __htmljs_manager_default_properties_values__ = (userFunc, ...args) =>
{
	let validateTags, tagsList;

	if(__htmljs_is_object__(args[0]))
	{
		validateTags = false;
		tagsList     = args[0];
	}
	else if(typeof args[0] == "boolean" && __htmljs_is_object__(args[1]))
	{
		validateTags = args[0];
		tagsList     = args[1];
	}
	else
	{
		validateTags = (typeof args[1] == "boolean" && args[1]);
		tagsList     = null;
	}

	if(tagsList !== null)
	{
		for(const TAG in tagsList)
			userFunc(TAG, validateTags, tagsList[ TAG ]);

		return null;
	}

	const ARG_TAG = args[0].toLowerCase();

	// TAG == args[0]
	if(typeof ARG_TAG != "string")
		throw new TypeError(`Expecting a string, instead a "${typeof args[0]}".`);

	if(validateTags)
	{
		if(__htmljs_validate_tags__(ARG_TAG))
			return ARG_TAG;

		return null;
	}

	return ARG_TAG;
}

const htmljs_set_default_properties_values = (...args) =>
{
	const TAG = __htmljs_manager_default_properties_values__(htmljs_set_default_properties_values, ...args);

	if(TAG === null)
		return;

	const VALIDATE_TAGS   = args[1];
	const HTML_PROPERTIES = args[2];

	if(!__htmljs_is_object__(HTML_PROPERTIES))
		throw new TypeError("Invalid type to `htmlProperties`. Expecting an object.");

	if(VALIDATE_TAGS)
		__htmljs_validate_tags__(TAG);

	if(__htmljs_default_properties_values__[TAG] === undefined)
		__htmljs_default_properties_values__[TAG] = {};

	for(const PROPERTY in HTML_PROPERTIES)
		__htmljs_default_properties_values__[TAG][PROPERTY] = HTML_PROPERTIES[ PROPERTY ];

	if(__htmljs_is_empty_object__(__htmljs_default_properties_values__[TAG]))
		delete __htmljs_default_properties_values__[TAG];
};

const htmljs_unset_default_properties_values = (...args) =>
{
	const TAG = __htmljs_manager_default_properties_values__(htmljs_unset_default_properties_values, ...args);

	if(TAG === null)
		return;

	const VALIDATE_TAGS   = args[1];
	const HTML_PROPERTIES = args[2];

	if(!Array.isArray(HTML_PROPERTIES))
		throw new TypeError("Invalid type to `htmlProperties`. Expecting an object.");

	if(VALIDATE_TAGS)
		__htmljs_validate_tags__(TAG);

	if(__htmljs_default_properties_values__[TAG] === undefined)
		return;

	for(const PROPERTY of HTML_PROPERTIES)
		delete __htmljs_default_properties_values__[TAG][PROPERTY];

	if(__htmljs_is_empty_object__(__htmljs_default_properties_values__[TAG]))
		delete __htmljs_default_properties_values__[TAG];
}
