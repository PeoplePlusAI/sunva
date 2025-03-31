import { Fragment } from 'react';
import Form from 'react-bootstrap/Form';

const Input = ({
    componentFrom, className, htmlFor, type,
    placeholder, label, labelClassName, mandatory,
    inputError, change, multiple, value, keyDown,
    disabled, max, min
}) => {

    return type !== "range" ?
        <Fragment>
            {label ?
                <Form.Label htmlFor={htmlFor} className={labelClassName}>
                    {label}
                    {mandatory ? <span className='text-danger ms-1'>*</span> : null}
                </Form.Label>
                :
                null
            }

            <Form.Control
                type={type}
                id={htmlFor}
                placeholder={placeholder}
                className={className}
                onChange={change}
                onKeyDown={keyDown}
                multiple={multiple}
                value={value}
                disabled={disabled}
                max={max}
                min={min}
            />

            {inputError ?
                <div className='text-danger pt-2 ps-1 fs-15'>
                    {inputError}
                </div>
                :
                null
            }
        </Fragment>
        :
        <div className="card my-2 font_drag_card border-0">
            <div className="card-header border-0 bg-transparent">
                {label}
            </div>
            <div className="card-body pt-1 row align-items-center">
                <div className="col text-center">
                    <h6 className='mb-0'>A</h6>
                </div>
                <div className="col-9">
                    <input
                        type={type}
                        value={value}
                        className="col-12 p-1 mt-2"
                        min={min}
                        max={max}
                        onChange={change}
                        onKeyDown={keyDown}
                        disabled={disabled}
                    />
                </div>
                <div className="col text-center">
                    <h4 className='mb-0'>A</h4>
                </div>
            </div>
        </div>
}

export default Input