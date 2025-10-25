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

const __htmljs_is_not_object__ = (thing) =>
{
	return typeof thing != "object" || Array.isArray(thing);
};

const __htmljs_element_tags__ = [
	// NO-containers
	"area", "base", "br", "col", "hr", "img", "input", "link",
	"meta", "source", "track", "wbr",
	// wbr id == 11, so the first "container" is #12

	// containers
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
	"tfoot", "th", "thead", "time", "title", "tr", "ul", "var", "video",
];

const __htmljs_check_group_type__ = (property, htmlProperties) =>
{
	if(__htmljs_is_not_object__( htmlProperties[property] ))
	{
		__htmljs_debug_func__(new TypeError(`Invalid value attributed to \`${property}\`, expecting an object.`));
		return false;
	}

	return true;
}

const __htmljs_set_group_of_attributes__ = (prefix, elem, property, htmlProperties) =>
{
	if(!__htmljs_check_group_type__(property, htmlProperties))
		return;

	for(const FIELD in htmlProperties[property])
		elem.setAttribute(prefix + "-" + FIELD, htmlProperties[property][FIELD]);
};

const __htmljs_set_event_listeners__ = (elem, property, htmlProperties) =>
{
	if(!__htmljs_check_group_type__(property, htmlProperties))
		return;

	for(const EVENT in htmlProperties[property])
	{
		if(Array.isArray( htmlProperties[property][EVENT] ))
			for(const LAMBDA of htmlProperties[property][EVENT])
				elem.addEventListener(EVENT, LAMBDA);
		else
			elem.addEventListener(EVENT, htmlProperties[property][EVENT]);
	}
};

const __htmljs_core__ = (elementTag, htmlProperties, ...children) =>
{
	const ELEM = document.createElement(elementTag);

	if(htmlProperties !== undefined)
	{
		let textnode = "";
		const ARGS_MAX = children.length - __htmljs_ignore_last__;

		if(htmlProperties !== null)
		{
			if(__htmljs_is_not_object__( htmlProperties ))
			{
				__htmljs_debug_func__(new TypeError(`Excepting Object to \`htmlProperties\`, instead "${typeof htmlProperties}".`));
				
				// this allows to jump the for-loop below,
				// if the Debug Mode is != 2
				htmlProperties = {};
			}

			for(const PROPERTY in htmlProperties){
				switch(PROPERTY)
				{
					case "dataSets":       __htmljs_set_group_of_attributes__("data", ELEM, PROPERTY, htmlProperties); continue;
					case "ariaAttributes": __htmljs_set_group_of_attributes__("aria", ELEM, PROPERTY, htmlProperties); continue;
					case "eventListeners": __htmljs_set_event_listeners__(            ELEM, PROPERTY, htmlProperties); continue;
				}

				ELEM[PROPERTY] =
					htmlProperties[PROPERTY] == "~"
						? PROPERTY
						: htmlProperties[PROPERTY];
			}
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
				__htmljs_debug_func__(new TypeError(`Excepting Object or String to \`children[${i}]\`, instead "${typeof children[i]}".`));
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

	__htmljs_element_tags__.forEach((elementTag, id) =>
	{
		tag = PREF + elementTag;

		DEST[ (useUpperCase ? tag.toUpperCase() : tag) ] =
			(id < 12) // 12 == first "container"
				? (properties)              => __htmljs_core__(elementTag, properties)
				: (properties, ...children) => __htmljs_core__(elementTag, properties, ...children);
	});

	return DEST;
};
