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

abstract class __HJ_PropertiesManager__
{
	private __defaultProperties__: TDict = {};

	private __formatName__(name: string, prefix: string = null): string
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
	}

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
					elem.setAttribute(this.__formatName__( NAME, prefix ), properties[ NAME ] as string);

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
					content += `${this.__formatName__( NAME, prefix )}:${properties[ NAME ]};`;

				elem.setAttribute("style", (elem.getAttribute("style") ?? "") + content);
				break;

			default:
				return false;
		}

		return true;
	}

	protected __setProperties(elem: Element, properties: TDict): void | never
	{
		for(const NAME in this.__defaultProperties__)
			elem.setAttribute( NAME, this.__defaultProperties__[NAME] as string );

		for(const NAME in properties)
			if(!this.__setSpecialProperties__(elem, NAME, properties))
				elem.setAttribute( this.__formatName__( NAME ), properties[NAME] as string );
	}
	
	setDefaultProperties(properties: TDict = {}): void
	{
		if(properties === null || typeof properties !== "object")
			throw new TypeError("Expecting: OBJECT.");

		for(const PROP in properties)
			this.__defaultProperties__[ this.__formatName__( PROP ) ] = properties[PROP];
	}
}

class HJCreateInlineElement extends __HJ_PropertiesManager__
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

class HJCreateBlockElement extends __HJ_PropertiesManager__
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

