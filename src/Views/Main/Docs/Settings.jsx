import { createSelector } from '@reduxjs/toolkit'
import ButtonComponent from 'Components/Button/Button'
import Img from 'Components/Img/Img'
import Textbox from 'Components/Input/textbox'
import React from 'react'
import { useSelector } from 'react-redux'
import { useCustomNavigate } from 'ResuableFunctions/CustomHooks'
import Image from 'Utils/Image'
import JsonData from 'Utils/JsonData'

const Settings = () => {
    const selectCommonState = (state) => state.commonState
    const selectMainState = (state) => state.mainState
    const { jsxJson } = JsonData();
    const navigate = useCustomNavigate();

    const selectMemoizedStates = createSelector(
        [selectCommonState, selectMainState],
        (commonState, mainState) => ({ commonState, mainState })
    );

    const { mainState } = useSelector(selectMemoizedStates);

    return (
        <div className="full_description_content_height">
            <div className="card border border-light-subtle rounded-4 shadow-sm login_card_deisgn h-100">
                <div className="card-header bg-transparent py-4">
                    <h5 className='m-0'>Settings</h5>
                </div>
                <div className="card-body px-3 px-md-5 row align-content-start">
                    <h5 className='mb-0'>Customize your font</h5>
                    {
                        jsxJson?.select_font_details?.map((font_value, font_index) => {
                            return font_value?.type === "textbox" ?
                                <div className='col-12' key={font_index}>
                                    <Textbox
                                        value={font_value?.value}
                                        change={font_value?.change}
                                        cols={font_value?.cols}
                                        rows={font_value?.rows}
                                        placeholder={font_value?.placeholder}
                                        label={font_value?.name}
                                        labelClassName="text-secondary mb-0 fs-14"
                                        controlClassName={font_value?.controlClassName}
                                        mandatory={font_value?.isMandatory}
                                        inputError={font_value?.Err}
                                        disabled={font_value?.disabled}
                                        mainState={mainState?.font_page_details}
                                    />
                                </div>
                                :
                                <div className="col-12 col-md-6 col-lg-4 col-xxl-3 p-1">
                                    <div className="card my-2 font_drag_card border-0 " key={font_index}>
                                        <div className="card-header border-0 bg-transparent">
                                            {font_value?.name}
                                        </div>
                                        <div className="card-body pt-0 row align-items-center">
                                            <div className="col text-center">
                                                <h6 className='mb-0'>A</h6>
                                            </div>
                                            <div className="col-9">
                                                <input
                                                    type={font_value?.type}
                                                    value={font_value?.value}
                                                    className={font_value?.className}
                                                    min={font_value?.is_min_value}
                                                    max={font_value?.is_max_value}
                                                    onChange={font_value?.change}
                                                />
                                            </div>
                                            <div className="col text-center">
                                                <h4 className='mb-0'>A</h4>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                        })
                    }

                    {/* <div className="col-12 col-lg-4 col-xxl-6 text-end">
                        <ButtonComponent
                            title="Continue"
                            buttonName="Continue"
                            className="btn btn_brand_color col-6 col-xxl-4 my-4"
                            clickFunction={() => navigate("/dashboard/home")}
                        />
                    </div> */}
                </div>

                <div className="login_card_deisgn_absolute">
                    <Img src={Image.login_design}
                        alt="people_ai_login_card-logo"
                        width="70rem"
                        height="70rem"
                    />
                </div>
            </div>
        </div>
    )
}

export default Settings