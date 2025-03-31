import React from 'react'
import { Form } from 'react-bootstrap'

const Textbox = ({
    componentFrom,
    controlId,
    label,
    labelClassName,
    mandatory,
    rows,
    cols,
    change,
    value,
    disabled,
    placeholder,
    className,
    controlClassName,
    style,
    mainState
}) => {

    return (
        <Form.Group className={`${className ? className : ''}`} controlId={controlId}>
            <Form.Label className={labelClassName}>
                {label}
                {
                    mandatory ?
                        <span className='text-danger ms-1'>*</span>
                        :
                        null
                }
            </Form.Label>
            <Form.Control
                as="textarea"
                rows={rows}
                cols={cols}
                onChange={change} value={value} disabled={disabled} placeholder={placeholder} className={controlClassName}
                style={{ fontSize: `${mainState?.font_size}px`, fontWeight: mainState?.font_weight * 100 }}
            // style={style}
            />
        </Form.Group>
    )
}

export default Textbox