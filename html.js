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

"use strict";
let __htmljs_ignore_last__ = 1;

const __htmljs_is_not_object__ = (thing) =>
{
	return typeof thing != "object" || Array.isArray(thing);
}

const __htmljs_element_tags__ = [
	"a", "abbr", "address", "area", "article", "audio", "b", "base", "bdi", "bdo",
	"blockquote", "body", "br", "button", "canvas", "caption", "cite", "code", "col",
	"colgroup", "data", "datalist", "dd", "del", "details", "dfn", "dialog", "div",
	"dl", "dt", "em", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2",
	"h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "iframe",
	"img", "input", "ins", "kbd", "label", "legend", "li", "link", "main", "map", "mark",
	"meta", "meter", "nav", "noscript", "object", "ol", "optgroup", "option", "output",
	"p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "samp", "script",
	"section", "select", "small", "source", "span", "strong", "sub", "summary", "sup",
	"table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time",
	"title", "tr", "track", "ul", "var", "video", "wbr",
];

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
				throw new TypeError(`Excepting Object to \`htmlProperties\`, instead "${typeof htmlProperties}".`);

			for(const property in htmlProperties)
				ELEM[property] = htmlProperties[property]
		}

		for(let i = 0; i < ARGS_MAX; i++)
		{
			if(typeof children[i] == "string")
			{
				textnode += (textnode == "" ? "" : " ") + children[i];
				continue;
			}

			if(__htmljs_is_not_object__( children[i] ))
				throw new TypeError(`Excepting Object or String to \`children[${i}]\`, instead "${typeof children[i]}".`);

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
				console.error(ex)
				break;
			}
		}

		if(textnode !== null)
			ELEM.appendChild(document.createTextNode( textnode ));
	}

	return ELEM;
};

const htmljs_set_ignore_last = (ignore) =>
{
	__htmljs_ignore_last__ = ignore ? 1 : 0;
}

const declare_htmljs = (prefix, createObject) =>
{
	const DEST = createObject ? {} : window;
	const PREF = prefix || "";

	for(const elementTag of __htmljs_element_tags__)
		DEST[ PREF + elementTag ] = (properties, ...children) => __htmljs_core__(elementTag, properties, ...children);

	return DEST;
};
