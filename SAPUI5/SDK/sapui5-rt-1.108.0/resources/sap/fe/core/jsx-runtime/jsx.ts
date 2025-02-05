import jsxControl from "sap/fe/core/jsx-runtime/jsx-control";
import jsxXml from "sap/fe/core/jsx-runtime/jsx-xml";
import type Control from "sap/ui/core/Control";
import type Element from "sap/ui/core/Element";

type ControlPropertyNames<T> = {
	[K in keyof T]: T[K] extends string | boolean | Function | number | undefined | string[] ? never : K;
}[keyof T];
export type ControlProperties<T> = Partial<Record<ControlPropertyNames<T>, Element>>;
export type NonControlProperties<T> = Partial<Omit<T, ControlPropertyNames<T>>>;

let renderNextAsXML = false;
const jsx = function <T>(
	ControlType: typeof Control,
	mSettings: NonControlProperties<T> & { key: string; children?: Element | ControlProperties<T> },
	key: string
): string | Control | Control[] {
	if (!renderNextAsXML) {
		return jsxControl(ControlType, mSettings, key);
	} else {
		return jsxXml(ControlType, mSettings, key);
	}
};

/**
 * Indicates that the next JSX call should be rendered as XML.
 *
 * @param renderMethod The method that needs to be rendered as XML
 * @returns The XML representation of the control
 */
jsx.renderAsXML = function (renderMethod: Function) {
	renderNextAsXML = true;
	const returnValue = renderMethod();
	renderNextAsXML = false;
	return returnValue;
};

export type Ref<T extends Element> = {
	current?: T;
	setCurrent(oControlInstance: T): void;
};

export default jsx;
