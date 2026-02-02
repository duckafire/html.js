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

// P( null, <...CHILDREN>, <TAG-CLOSER>)
type TChildren = [] | Element[] | [...Array<Element>, Function];

// { display: "inline-block" }
// { click: ()=>0 }
// { click: [ ()=>1, ()=>2 ] }
type TSpecDict = Record<string, string> | Record<keyof ElementEventMap, EventListener | EventListener[]>;

// {
//   title: "lorem",
//   _style: { display: "inline-block" }
//   _event: { click: ()=>0 }
// }
type TAttrDict = Record<string, string | TSpecDict>;

// { div: {{
//   title: "lorem",
//   _style: { display: "inline-block" }
//   _event: { click: ()=>0 }
// }} }
type TElemAttr = Record<string, TAttrDict>;

const enum SpecialAttributes
{
	ARIA  = "_aria",
	DATA  = "_data",
	EVENT = "_event",
	STYLE = "_style",
	VAR   = "_var",
}

const __hj_formatAttributeName__ = (name: string, prefix: string = null): string =>
{
	if(name.charAt(0) === "-")
		return name;

	// If prefix is null, the attribute
	// is a "default attribute" (from
	// element standard).
	if(prefix === null)
		return name.toLowerCase();

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

class HJDefaultAttributes
{
	private static __list__: TElemAttr = {};

	static set(list: TElemAttr): void | never
	{
		if(list === null || typeof list !== "object")
			throw new TypeError("Expecting: OBJECT.");

		for(const TAG_NAME in list)
		{
			if(this.__list__[TAG_NAME] === undefined)
				this.__list__[TAG_NAME] = {};

			for(const ATTR in list[ TAG_NAME ])
				this.__list__[TAG_NAME][ __hj_formatAttributeName__( ATTR ) ] = list[ TAG_NAME ][ ATTR ];
		}
	}

	static get(tagName: string): TAttrDict
	{
		return HJDefaultAttributes.__list__[ tagName.toUpperCase() ] ?? {};
	}

	static unset(list: Record<string, string[]>): void | never
	{
		if(list === null || typeof list !== "object")
			throw new TypeError("Expecting: OBJECT.");

		for(const TAG_NAME in list)
			for(const ATTR of list[ TAG_NAME ])
				delete HJDefaultAttributes.__list__[TAG_NAME][ __hj_formatAttributeName__(ATTR) ];
	}
}

abstract class __HJ_AttributesManager__
{
	// Return true if it is defined.
	private __setSpecialAttributes__(elem: Element, attrName: string, attributes: TSpecDict): boolean | never
	{
		// ALL special attributes start with "_".
		if(attrName.charAt(0) !== "_")
			return false;

		let prefix: string;

		switch(attrName)
		{
			case SpecialAttributes.ARIA:
			case SpecialAttributes.DATA:
				prefix = attrName.slice(1) + "-"; // removes "_".

				for(const NAME in attributes)
					elem.setAttribute(__hj_formatAttributeName__( NAME, prefix ), attributes[ NAME ]);

				break;

			case SpecialAttributes.EVENT:
				for(const EV_NAME in attributes)
				{
					if(!Array.isArray( attributes[ EV_NAME ] ))
						elem.addEventListener(EV_NAME, attributes[ EV_NAME ]);
					else
						for(const BEHAVIOR of attributes[EV_NAME])
							elem.addEventListener(EV_NAME, BEHAVIOR);
				}

				break;

			case SpecialAttributes.STYLE:
			case SpecialAttributes.VAR:
				let content : string = "";
				prefix = (attrName === SpecialAttributes.VAR ? "--" : "");

				for(const NAME in attributes)
					content += `${__hj_formatAttributeName__( NAME, prefix )}:${attributes[ NAME ]};`;

				elem.setAttribute("style", (elem.getAttribute("style") ?? "") + content);
				break;

			default:
				return false;
		}

		return true;
	}

	protected __setAttributes(elem: Element, attributes: TAttrDict): void | never
	{
		const DEFAULT_ATTRIBUTES: TAttrDict = HJDefaultAttributes.get(elem.tagName);

		for(const NAME in DEFAULT_ATTRIBUTES)
			elem.setAttribute( NAME, DEFAULT_ATTRIBUTES[ NAME ] as string);

		for(const NAME in attributes)
			if(!this.__setSpecialAttributes__(elem, NAME, attributes[NAME] as TSpecDict))
				elem.setAttribute( __hj_formatAttributeName__( NAME ), attributes[NAME] as string);
	}
}

class __HJ_InlineElement__ extends __HJ_AttributesManager__
{
	constructor()
	{
		super();
	}

	createElement(tagName: string, attributes: TAttrDict = {}): Element | never
	{
		const ELEM = document.createElement(tagName);
		
		this.__setAttributes(ELEM, attributes);

		return ELEM;
	}
}

class __HJ_BlockElement__ extends __HJ_AttributesManager__
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

	createElement(tagName: string, attributes: TAttrDict = {}, ...children: TChildren): Element | never
	{
		const ELEM = document.createElement(tagName);
		
		this.__setAttributes(   ELEM, attributes);
		this.__insertChildren__(ELEM, children);

		return ELEM;
	}
}

for(const TAG of ["AREA", "BASE", "BR", "COL", "HR", "IMG", "INPUT", "LINK", "META", "SOURCE", "TRACK", "WBR"])
	window[TAG] = (attributes?: TAttrDict): Element | never => __HJ_InlineElement__.prototype.createElement(TAG, attributes);

for(const TAG of ["A", "ABBR", "ADDRESS", "ARTICLE", "AUDIO", "B", "BDI", "BDO", "BLOCKQUOTE", "BODY", "BUTTON", "CANVAS", "CAPTION", "CITE", "CODE", "COLGROUP", "DATA", "DATALIST", "DD", "DEL", "DETAILS", "DFN", "DIALOG", "DIV", "DL", "DT", "EM", "FIELDSET", "FIGCAPTION", "FIGURE", "FOOTER", "FORM", "H1", "H2", "H3", "H4", "H5", "H6", "HEAD", "HEADER", "HGROUP", "HTML", "I", "IFRAME", "INS", "KBD", "LABEL", "LEGEND", "LI", "MAIN", "MAP", "MARK", "METER", "NAV", "NOSCRIPT", "OBJECT", "OL", "OPTGROUP", "OPTION", "OUTPUT", "P", "PICTURE", "PRE", "PROGRESS", "Q", "RP", "RT", "RUBY", "SAMP", "SCRIPT", "SECTION", "SELECT", "SMALL", "SPAN", "STRONG", "SUB", "SUMMARY", "SUP", "TABLE", "TBODY", "TD", "TEMPLATE", "TEXTAREA", "TFOOT", "TH", "THEAD", "TIME", "TITLE", "TR", "UL", "VARI", "VIDEO"])
	window[TAG] = (attributes?: TAttrDict, ...children: TChildren): Element | never => __HJ_BlockElement__.prototype.createElement(TAG, attributes, ...children);

