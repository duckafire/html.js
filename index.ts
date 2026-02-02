/*
 * Zlib License
 *
 * Copyright (C) 2025 DuckAfire <duckafire.github.io/nest>
 *
 * This software is provided 'as-is', without any express or implied
 * warranty. In no event will the authors be held liable for any damages
 * arising from the use of this software.
 *
 * Permission is granted to anyone to use this software for any purpose,
 * including commercial applications, and to alter it and redistribute it
 * freely, subject to the following restrictions:
 *
 * 1. The origin of this software must not be misrepresented; you must not
 *    claim that you wrote the original software. If you use this software
 *    in a product, an acknowledgment in the product documentation would be
 *    appreciated but is not required.
 * 2. Altered source versions must be plainly marked as such, and must not be
 *    misrepresented as being the original software.
 * 3. This notice may not be removed or altered from any source distribution.
 */

type TChildren = [] | Element[] | [...Array<Element>, Function];
type TDict     = Record<string, unknown>;

const enum SpecialProperties
{
	ARIA  = "_aria",
	DATA  = "_data",
	EVENT = "_event",
	STYLE = "_style",
	VAR   = "_var",
}

const __hj_formatPropertyName__ = (name: string, prefix: string = null): string =>
{
	if(name.charAt(0) === "-")
		return name;

	let result: string = name.charAt(0);
	let char: string;

	for(let i = 1; i < name.length; i++)
	{
		char = name.charAt(i);

		if(char === char.toUpperCase())
			result += "-" + char.toLowerCase();
		else
			result += char;
	}

	if(prefix !== null)
		return prefix + result;

	return result;
};

class HJDefaultProperties
{
	private static __list__: Record<string, TDict> = {}

	static set(tagName: string, properties: TDict)
	{
		if(properties === null || typeof properties !== "object")
			throw new TypeError("Expecting: OBJECT.");

		tagName = tagName.toUpperCase();

		for(const PROP in properties)
			this.__list__[tagName][ __hj_formatPropertyName__( PROP ) ] = properties[PROP];
	}

	static get(tagName: string): TDict
	{
		return HJDefaultProperties.__list__[ tagName.toUpperCase() ] ?? {} as TDict;
	}
}

abstract class __HJ_PropertiesManager__
{
	// Return true if it is defined.
	private __setSpecialProperties__(elem: Element, propName: string, properties: TDict): boolean | never
	{
		// ALL special properties start with "_".
		if(propName.charAt(0) !== "_")
			return false;

		let prefix: string;

		switch(propName)
		{
			case SpecialProperties.ARIA:
			case SpecialProperties.DATA:
				prefix = propName.slice(1) + "-"; // removes "_".

				for(const NAME in properties)
					elem.setAttribute(__hj_formatPropertyName__( NAME, prefix ), properties[ NAME ] as string);

				break;

			case SpecialProperties.EVENT:
				// Event-key : behavior | behavior[]
				for(const PAIR in properties)
				{
					if(!Array.isArray(PAIR[1]))
					{
						elem.addEventListener((PAIR[0] as keyof ElementEventMap), (PAIR[1] as unknown as EventListenerOrEventListenerObject));
						continue;
					}

					for(const BEHAVIOR of PAIR[1])
						elem.addEventListener((PAIR[0] as keyof ElementEventMap), (BEHAVIOR as unknown as EventListenerOrEventListenerObject));
					// NOTE: I do not why, but TSC thinks
					// PAIR[1]/BEHAVIOR is a `string`, but,
					// based in TDict, it is a `unknown`;
					// because of this, I use `as unknown as`
					// (assertion to
					// EventListenerOrEventListenerObject was
					// working).
				}

				break;

			case SpecialProperties.STYLE:
			case SpecialProperties.VAR:
				let content : string = "";
				prefix = (propName === SpecialProperties.VAR ? "--" : "");

				for(const NAME in properties)
					content += `${__hj_formatPropertyName__( NAME, prefix )}:${properties[ NAME ]};`;

				elem.setAttribute("style", (elem.getAttribute("style") ?? "") + content);
				break;

			default:
				return false;
		}

		return true;
	}

	protected __setProperties(elem: Element, properties: TDict): void | never
	{
		const DEFAULT_PROPERTIES: TDict = HJDefaultProperties.get(elem.tagName);

		for(const NAME in DEFAULT_PROPERTIES)
			elem.setAttribute( NAME, DEFAULT_PROPERTIES[ NAME ] as string );

		for(const NAME in properties)
			if(!this.__setSpecialProperties__(elem, NAME, properties[NAME] as TDict))
				elem.setAttribute( __hj_formatPropertyName__( NAME ), properties[NAME] as string );
	}
}

class __HJ_InlineElement__ extends __HJ_PropertiesManager__
{
	constructor()
	{
		super();
	}

	createElement(tagName: string, properties: TDict = {}): Element | never
	{
		const ELEM = document.createElement(tagName);
		
		this.__setProperties(ELEM, properties);

		return ELEM;
	}
}

class __HJ_BlockElement__ extends __HJ_PropertiesManager__
{
	constructor()
	{
		super();
	}

	private __insertChildren__(elem: Element, children: TChildren): void | never
	{
		if(children.length === 0)
			return;

		let textNode: string = "";

		// Discart last because it is the "closing tag".
		const MAX: number = children.length - 1;

		for(let i = 0; i < MAX; i++)
		{
			if(typeof children[i] === "string")
			{
				textNode += (textNode === "" ? "" : " ") + children[i];
				continue;
			}

			if(textNode !== "")
			{
				elem.appendChild( document.createTextNode( textNode ) );
				textNode = "";
			}

			elem.appendChild( children[i] as HTMLElement );
		}

		if(textNode !== "")
			elem.appendChild( document.createTextNode( textNode ) );
	}

	createElement(tagName: string, properties: TDict = {}, ...children: TChildren): Element | never
	{
		const ELEM = document.createElement(tagName);
		
		this.__setProperties(   ELEM, properties);
		this.__insertChildren__(ELEM, children);

		return ELEM;
	}
}

for(const TAG of ["AREA", "BASE", "BR", "COL", "HR", "IMG", "INPUT", "LINK", "META", "SOURCE", "TRACK", "WBR"])
	window[TAG] = (properties?: TDict): Element | never => __HJ_InlineElement__.prototype.createElement(TAG, properties);

for(const TAG of ["A", "ABBR", "ADDRESS", "ARTICLE", "AUDIO", "B", "BDI", "BDO", "BLOCKQUOTE", "BODY", "BUTTON", "CANVAS", "CAPTION", "CITE", "CODE", "COLGROUP", "DATA", "DATALIST", "DD", "DEL", "DETAILS", "DFN", "DIALOG", "DIV", "DL", "DT", "EM", "FIELDSET", "FIGCAPTION", "FIGURE", "FOOTER", "FORM", "H1", "H2", "H3", "H4", "H5", "H6", "HEAD", "HEADER", "HGROUP", "HTML", "I", "IFRAME", "INS", "KBD", "LABEL", "LEGEND", "LI", "MAIN", "MAP", "MARK", "METER", "NAV", "NOSCRIPT", "OBJECT", "OL", "OPTGROUP", "OPTION", "OUTPUT", "P", "PICTURE", "PRE", "PROGRESS", "Q", "RP", "RT", "RUBY", "SAMP", "SCRIPT", "SECTION", "SELECT", "SMALL", "SPAN", "STRONG", "SUB", "SUMMARY", "SUP", "TABLE", "TBODY", "TD", "TEMPLATE", "TEXTAREA", "TFOOT", "TH", "THEAD", "TIME", "TITLE", "TR", "UL", "VARI", "VIDEO"])
	window[TAG] = (properties?: TDict, ...children: TChildren): Element | never => __HJ_BlockElement__.prototype.createElement(TAG, properties, ...children);

