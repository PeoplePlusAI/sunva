import { Fragment } from "react";
import ReactDropdownSelect from "Components/Input/ReactDropdownSelect";
import SelectBox from "Components/Input/SelectBox";
import GoogleLocationInput from "Components/Input/GoogleLocationInput";
import Input from "Components/Input/Input";
import ButtonComponent from "Components/Button/Button";
import Textbox from "Components/Input/textbox";
import Icons from "Utils/Icons";
import Checkbox from "Components/Input/Checkbox";

export function Inputfunctions(funBy) {

    return funBy?.map((ipVal, iPInd) => {
        switch (ipVal?.category) {
            case "heading":
                return <div className={ipVal?.divClassName} key={iPInd}>
                    {
                        iPInd !== 0 ?
                            <hr className="bg-secondary" />
                            :
                            null
                    }
                    <h5>{ipVal?.title}</h5>
                </div>

            case "select":
                return <div className={ipVal?.divClassName} key={iPInd}>
                    {
                        ipVal?.type !== "normal_select" ?
                            <Fragment>
                                <ReactDropdownSelect
                                    multi={ipVal?.multi}
                                    name={ipVal?.name}
                                    isMandatory={ipVal?.isMandatory}
                                    options={ipVal?.options}
                                    labelField="label"
                                    valueField="label"
                                    create={ipVal?.create}
                                    value={ipVal?.value}
                                    change={ipVal?.change}
                                    className='rounded filter-select-dropdown'
                                    disabled={ipVal?.disabled}
                                />
                                {
                                    ipVal?.Err ?
                                        <div className='text-danger pt-2 ps-1 fs-15'>
                                            {ipVal?.Err}
                                        </div>
                                        :
                                        null
                                }
                            </Fragment>
                            :
                            <Fragment>
                                <SelectBox
                                    selectOptions={ipVal?.options}
                                    value={ipVal?.value}
                                    change={ipVal?.change}
                                    label={ipVal?.name}
                                    labelClassName="text-secondary mb-0 fs-14"
                                    mandatory={ipVal?.isMandatory}
                                    disableSelectBox={ipVal?.disabled}
                                    default_select_option={ipVal?.default_select_option}
                                    className={ipVal?.className}
                                />
                                {
                                    ipVal?.Err ?
                                        <div className='text-danger pt-2 ps-1 fs-15'>
                                            {ipVal?.Err}
                                        </div>
                                        :
                                        null
                                }
                            </Fragment>
                    }
                </div >

            case "googleLocation":
                return <div className={ipVal?.divClassName} key={iPInd}>
                    <GoogleLocationInput
                        name={ipVal?.name}
                        value={ipVal?.value}
                        change={ipVal?.change}
                        selcted={ipVal?.placedSelectedClick}
                        label={ipVal?.name}
                        labelClassName="text-secondary mb-0 fs-14"
                        mandatory={ipVal?.isMandatory}
                        disabled={ipVal?.disabled}
                    />
                    {
                        ipVal?.Err ?
                            <div className='text-danger pt-2 ps-1 fs-15'>
                                {ipVal?.Err}
                            </div>
                            :
                            null
                    }
                </div>

            case "input":
                return ipVal?.type === "file" ?
                    <Fragment>
                        <div className={`cursor-pointer ${ipVal?.divClassName} ${ipVal?.value?.length >= ipVal?.fileLength ? 'pe-none' : ''}`} onClick={() => document.getElementById('file_upload').click()} key={iPInd}>
                            <Input
                                type={ipVal?.type}
                                change={ipVal?.change}
                                label={ipVal?.name}
                                labelClassName="text-secondary mb-0 fs-14"
                                mandatory={ipVal?.isMandatory}
                                className="d-none"
                                htmlFor="file_upload"
                                multiple={true}
                                inputError={ipVal?.Err}
                                disabled={ipVal?.disabled}
                            />

                            <div className='border py-2 rounded-2 col-12 text-center'>
                                <span className='me-2'>{Icons.fileUploadIcon}</span>
                                <span className='text-secondary fs-15'>{ipVal?.value?.length >= ipVal?.fileLength ? `Only ${ipVal?.fileLength} ${ipVal?.name} can be selectable` : `Click here to choose image ${ipVal?.name}`}</span>
                            </div>
                        </div>

                        <div className="mt-4 w-100">
                            {ipVal?.value?.map((data, index) => {
                                const {
                                    id,
                                    filename,
                                    fileimage,
                                    datetime,
                                    filesize,
                                } = data;
                                return (
                                    typeof data === "string" ?
                                        <div className="file-atc-box w-100" key={id}>
                                            <div className="file-image">
                                                <img src={data} alt="" />
                                            </div>
                                            <div className="file-detail row">
                                                <div className="col-9">
                                                    <h6>{data?.split("/")[data?.split("/")?.length - 1]}</h6>
                                                </div>
                                                <div className="file-actions col-3">
                                                    <ButtonComponent
                                                        type="button"
                                                        className="file-action-btn w-100 text-end"
                                                        // clickFunction={() => dispatch(handleDeleteImage({ user_id: servicesState?.new_edit_buyAndsell_card?.user_id, buy_sell_id: servicesState?.new_edit_buyAndsell_card?.buy_sell_id, image: data }))}
                                                        buttonName={
                                                            // servicesState?.deletion_image_cdn_path === data ?
                                                            //     <SpinnerComponent />
                                                            //     :
                                                            "Delete"
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        :
                                        <div className="file-atc-box w-100" key={id}>
                                            {filename.match(/.(jpg|jpeg|png|gif|svg)$/i) ? (
                                                <div className="file-image">
                                                    {" "}
                                                    <img src={fileimage} alt="" />
                                                </div>
                                            ) : (
                                                <div className="file-image">
                                                    <i className="far fa-file-alt"></i>
                                                </div>
                                            )}
                                            <div className="file-detail row">
                                                <h6>{filename}</h6>
                                                <div className="col-9">
                                                    <p>
                                                        <span>Size : {filesize}</span>,
                                                        <span className="ps-1 ml-2">
                                                            Modified Time : {datetime}
                                                        </span>
                                                    </p>
                                                </div>
                                                <div className="file-actions col-3">
                                                    <ButtonComponent
                                                        type="button"
                                                        className="file-action-btn w-100 text-end"
                                                        // clickFunction={() => DeleteSelectFile(id)}
                                                        buttonName="Delete"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                );
                            })}
                        </div>
                    </Fragment>
                    :
                    <div className={ipVal?.divClassName} key={iPInd}>
                        <Input
                            type={ipVal?.type}
                            value={ipVal?.value}
                            change={ipVal?.change}
                            keyDown={ipVal?.keyDown}
                            label={ipVal?.name}
                            placeholder={ipVal?.placeholder}
                            labelClassName="text-secondary mb-0 fs-14"
                            mandatory={ipVal?.isMandatory}
                            inputError={ipVal?.Err}
                            disabled={ipVal?.disabled}
                            className={ipVal?.className}
                            max={ipVal?.is_max ? new Date().toISOString().split('T')[0] : ipVal?.is_max_value}
                            min={ipVal?.is_min ? new Date().toISOString().split('T')[0] : ipVal?.is_min_value}
                        />
                    </div>

            case "Checkbox":
                return <div className={ipVal?.divClassName} key={iPInd}>
                    <Checkbox
                        formType={ipVal?.type}
                        formLabel={ipVal?.name}
                        formClassName="text-secondary mb-0 fs-14"
                        formId={ipVal?.name}
                        formName="radio"
                        change={ipVal?.change}
                        formChecked={ipVal?.checked}
                        formValue={ipVal?.value}
                    />
                </div>

            case "textbox":
                return <div className={ipVal?.divClassName} key={iPInd}>
                    <Textbox
                        value={ipVal?.value}
                        change={ipVal?.change}
                        style={ipVal?.style}
                        cols={ipVal?.cols}
                        rows={ipVal?.rows}
                        className=""
                        label={ipVal?.name}
                        labelClassName="text-secondary mb-0 fs-14"
                        mandatory={ipVal?.isMandatory}
                        inputError={ipVal?.Err}
                        disabled={ipVal?.disabled}
                    />

                    {
                        ipVal?.Err ?
                            <div className='text-danger pt-2 ps-1 fs-15'>
                                {ipVal?.Err}
                            </div>
                            :
                            null
                    }
                </div >

            default:
                break;
        }
    })
}