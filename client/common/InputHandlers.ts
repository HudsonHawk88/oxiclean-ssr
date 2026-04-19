import type {ChangeEvent, Dispatch, RefObject, SetStateAction} from "react";

function handleInputChange<T> (
    e: ChangeEvent<HTMLInputElement>, obj: T, setObj: Dispatch<SetStateAction<T>>
) {
    console.log(e, obj, setObj);
    /* if (!inputName) { */
    const { target } = e;
    const { type, checked, name } = target;
    const { pattern } = target;
    let value: string | boolean | number = target.value;
    if (type !== 'checkbox') {
        if (pattern && value) {
            if (value[value.length - 1].match(pattern)) {
                value = target.value;
            } else {
                value = value.slice(0, -1);
            }
        } else if (!pattern) {
            value = target.value;
        }
    } else {
        value = checked;
    }

    setObj({
        ...obj,
        [name]: value
    });
};

const toBase64 = (file: File) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

const addFile = async (e: ChangeEvent<HTMLInputElement>, obj: never, setObj: Dispatch<SetStateAction<never>>) => {
    const { target } = e;
    const { name } = target;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const file: File = target.files[0];
    let result: unknown = '';
    const filename = file?.name;
    result = await toBase64(file);
    const value = {
        filename: filename,
        data: result
    };

    setObj({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        ...obj,
        [name]: value
    });
};

const recaptchaOnChange = (ref: RefObject<never>) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    ref.current.execute();
    // console.log(key);
};

export { handleInputChange, addFile, recaptchaOnChange };
