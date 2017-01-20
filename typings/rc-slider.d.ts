declare module "rc-slider" {

    interface RcSlider extends React.ComponentClass<RcSliderProps> {}

    interface RcSliderProps {
        min?: number;
        max?: number;
        step?: number | undefined;
        defaultValue?: number | (Number | undefined)[] | undefined;
        value?: number | Array<Number>;
        marks?: Marks;
        included?: boolean;
        className?: string;
        prefixCls?: string;
        tooltipPrefixCls?: string;
        disabled?: boolean;
        children?: any;
        onBeforeChange?: (value: number) => void;
        onChange?: (value: number) => void;
        onAfterChange?: (value: number) => void;
        handle?: HTMLElement;
        tipTransitionName?: string;
        tipFormatter?: ((value: number, handleIndex: number) => string) | undefined | null;
        dots?: boolean;
        range?: boolean | number;
        vertical?: boolean;
        allowCross?: boolean;
        pushable?: boolean | number;
    }

    interface Marks {
        [key: number]: string | number | {
            style: HTMLStyleElement,
            label: string
        };
    }
    
    var rcSliderInstance: RcSlider;
    export = rcSliderInstance;
}
